import { createContext, useState } from "react";


const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [loginError, setLoginError] = useState("")
    const [signUpError, setSignUpError] = useState([])
    const [account, setAccount] = useState("")
    const [token, setToken] = useState(null);
    const [users, setUsers] = useState([])
    const [loginCred, setLoginCred] = useState({
        username: "",
        password: "",
        })
    const [signUpCred, setSignUpCred] = useState({
        email: "",
        username: "",
        password: "",
        collection: [],
        wishlist: [],
        decks: [],
        favorited_decks: [],
        roles: [],
        created_on: {},
        })
    const [updateCred, setUpdateCred] = useState({
        email: "",
        username: "",
        password: "",
        unhashed_password: "",
        collection: [],
        wishlist: [],
        decks: [],
        favorited_decks: [],
        roles: [],
        created_on: {},
        })
    const [passwordCon, setPasswordCon] = useState("")

    const getToken = async (event) => {
        return fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/token/`, {
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => data?.access_token ?? null)
        .catch(console.error);
    };

    // const getToken = async (event) => {
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/token/`, {
    //             credentials: "include",
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch');
    //         }
    //         const data = await response.json();
    //         console.log(response); // Log the obtained response data
    //         return data?.access_token ?? null;
    //     } catch (error) {
    //         console.error(error);
    //         return null;
    //     }
    // };

    const signup = async (event) => {
        const url = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/accounts/`
        console.log(signUpCred)
        fetch(url, {
            method: "post",
            body: JSON.stringify(signUpCred),
            headers: {
            "Content-Type": "application/json",
            },
        })
        .then(() => login())
        .catch(console.error);
    };

    const update = async (event) => {
        const url = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/accounts/${account.id}`
        fetch(url, {
            method: "put",
            body: JSON.stringify(updateCred),
            headers: {
            "Content-Type": "application/json",
            },
        })
        .then(() => getAccountData())
        .catch(console.error);
    };

    const updateWithOutPass = async (event) => {
        const url = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/accounts/${account.id}/without`
        console.log(url)
        console.log(updateCred)
        fetch(url, {
            method: "put",
            body: JSON.stringify(updateCred),
            headers: {
            "Content-Type": "application/json",
            },
        })
        .then(() => getAccountData())
        .catch(console.error);
    };

    const login = async () => {
        try {
            const url = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/token`;
            const form = new FormData();
            form.append("username", loginCred.username);
            form.append("password", loginCred.password);
            const response = await fetch(url, {
                method: "post",
                credentials: "include",
                body: form,
            });
            if (response.ok) {
                const token = await getToken();
                if (token) {
                    setToken(token);
                    setLoginError("");
                    getAccountData();
                    return token;
                } else {
                    throw new Error("Failed to get token after login.");
                }
            } else {
                setLoginError("Incorrect Username/Password");
                throw new Error("Login failed.");
            }
        } catch (error) {
          throw error; // Re-throw the error for handling in the calling function.
        }
    };

    const logout = async () => {
        if (account) {
            const url = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/token`;
            fetch(url, { method: "delete", credentials: "include" })
                .then(() => {
                setToken(null);
                // Delete old token
                console.log("logged out")
                document.cookie =
                "fastapi_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                })
                .catch(console.error);
        }
        window.location.href = `${process.env.PUBLIC_URL}/`
    };

    const getAccountData = async () => {
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/token/`,
        {credentials: "include"})
        const data = await response.json()
        setAccount(data.account)
    };

    const getUsers = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/accountswithout/`);
        const data = await response.json();
        setUsers(data)
    }

    const signUpCredCheck = async(signUpCred) => {
        const check = []
        const specialChar = ["!","@","$","&","+","~"]
        if (users.some(account => account.username === signUpCred.username)) {
            check.push("An account with this username already exists")
        }
        console.log("1, ",check)
        if (users.some(account => account.email === signUpCred.email)) {
            check.push("An account with this email already exists")
        }
        console.log("2, ",check)
        const password = signUpCred.password
        const checkSpec = password.split('').filter(char => specialChar.includes(char))
        if (checkSpec.length === 0) {
            check.push("Password must contain at least 1 special character (!, $, &, + or ~)")
        }
        console.log("3, ",check)
        const checkUpper = password.split('').filter(char => /[A-Z]/.test(char))
        if (checkUpper.length === 0) {
            check.push("Password must contain atleast 1 Uppercase letter")
        }
        console.log("4, ",check)
        const checkLower = password.split('').filter(char => /[a-z]/.test(char))
        if (checkLower.length === 0) {
            check.push("Password must contain atleast 1 Lowercase letter")
        }
        console.log("5, ",check)
        if (password !== passwordCon) {
            check.push("Passwords must match")
        }
        if (check.length > 0) {
            setSignUpError(check)
            return check
        }
        return check
    }

    return (
        <AuthContext.Provider value={{
            signUpError,
            setSignUpError,
            loginError,
            setLoginError,
            getToken,
            getUsers,
            users,
            token,
            setToken,
            signUpCred,
            setSignUpCred,
            updateCred,
            setUpdateCred,
            update,
            updateWithOutPass,
            passwordCon,
            setPasswordCon,
            loginCred,
            setLoginCred,
            signUpCredCheck,
            signup,
            login,
            logout,
            getAccountData,
            account,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };
