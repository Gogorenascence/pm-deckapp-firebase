import { NavLink, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import emailjs from "@emailjs/browser";


function ResetPassword() {
    // const [viewPass, setViewPass] = useState(false)
    const {
        signUpError,
        setSignUpError,
        loginError,
        setLoginError,
        token,
        setToken,
        getToken,
        getUsers,
        signUpCred,
        setSignUpCred,
        loginCred,
        setLoginCred,
        signUpCredCheck,
        passwordCon,
        setPasswordCon,
        signup,
        login,
        logout,
        account,
        setAccount,
        getAccountData,
        update,
        updateCred,
        setUpdateCred
    } = useContext(AuthContext)

    const {reset_id} = useParams()
    const [passwordReset, setPasswordReset] = useState("")
    const [accountInfo, setAccountInfo] = useState("")

    const getPasswordReset = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/password_resets/${reset_id}/`);
        const resetData = await response.json();
        setPasswordReset(resetData);
    };

    const getAccountInfo = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/accounts/${passwordReset.account_id}/`);
        const accountData = await response.json();
        accountData["password"] = "password"
        setAccountInfo(accountData);
        setUpdateCred(accountData)
        console.log(accountData)
        console.log(updateCred)
    };

    const Update = async(event) => {
        update(updateCred)
    }

    useEffect(() => {
        getPasswordReset()
        getAccountInfo()
        emailjs.init("deGtSFC4mncNpm_4n");
        console.log(passwordReset)
    },[]);

    function sendEmail() {
        const templateParams = {
            to_email: "nantahkl@gmail.com",
            from_name: "Team CardBase",
            message: "Here's the reset link: ",
            reset_link: `http://localhost:3000/reset/${passwordReset.id}`
            // reset_link: "http://localhost:3000/reset/64f6a25e07273674a7a1375d"
            };

        emailjs.send("service_y0l4y9e", "template_58fwghk", templateParams)
        .then(function(response) {
            console.log("Email sent successfully:", response);
        }, function(error) {
            console.error("Email sending failed:", error);
        });
    }

    return (
        <div className="whitespace">
            <button onClick={getPasswordReset}>Password Reset</button>
            <button onClick={getAccountInfo}>Account</button>
            <button onClick={Update}>Update</button>
            <button onClick={sendEmail}>Send Email</button>



        </div>
    );
}

export default ResetPassword;
