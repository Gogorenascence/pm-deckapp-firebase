import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext.js";


function TermCreate() {

    const [term, setTerm ] = useState({
        name: "",
        text: "",
        term_number: 1000,
    });

    const { account } = useContext(AuthContext)
    const [stayHere, setStayHere] = useState(false)

    const [terms, setTerms ] = useState([]);
    const [termNumber, setTermNumber] = useState(0)

    const getTerms = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/terms/`);
        const data = await response.json();
        const sortedData = [...data].sort((a,b) => a.name.localeCompare(b.name));
        setTerms(sortedData);
        const term_numbers = data.map(term => term.term_number)
        const max_term_number = Math.max(...term_numbers)
        setTermNumber(max_term_number + 1)
    };

    useEffect(() => {
        window.scroll(0, 0);
        getTerms();
        document.body.style.overflow = 'auto';
        document.title = "Term Create - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    const handleChange = (event) => {
        setTerm({ ...term, [event.target.name]: event.target.value });
        console.log(termNumber)
    };

    const handleCheck = (event) => {
        setStayHere(!stayHere);
    };

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...term};
        data["term_number"] = termNumber
        const termUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/terms/`;
        const fetchConfig = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(termUrl, fetchConfig);
        if (response.ok) {
            setTerm({
                name: "",
                text: "",
                term_number: 1000
            });
            getTerms()
            if (!stayHere) {navigate(`/glossary`)}
            console.log("Success")
        } else {
            alert("Error in creating term");
        }
    }

    if (!(account && account.roles.includes("admin"))) {
        setTimeout(function() {
            window.location.href = `${process.env.PUBLIC_URL}/`
        }, 3000);
    }


    return (
        <div>
            { account && account.roles.includes("admin")?
                <div className="white-space">
                    <h1 className="margin-top-40">Term Create</h1>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{width: "50%", display: "flex", justifyContent: "center"}}>
                                <div
                                    id="create-term-page">
                                    <h2 className="left">Term Details</h2>
                                    <h5 className="label">Name </h5>
                                    <input
                                        className="builder-input"
                                        type="text"
                                        placeholder=" Term Name"
                                        onChange={handleChange}
                                        name="name"
                                        value={term.name}>
                                    </input>
                                    <br/>
                                    <h5 className="label"> Text </h5>
                                    <textarea
                                        className="builder-text"
                                        type="text"
                                        placeholder=" Term Text"
                                        onChange={handleChange}
                                        name="text"
                                        value={term.text}>
                                    </textarea>
                                    <br/>

                                    <input
                                        style={{margin: "20px 5px 9px 5px", height:"10px"}}
                                        id="stayHere"
                                        type="checkbox"
                                        onChange={handleCheck}
                                        name="stayHere"
                                        checked={stayHere}>
                                    </input>
                                    <label for="stayHere"
                                        className="bold"
                                    >
                                        Keep me here
                                    </label>

                                    <br/>
                                    {account?
                                        <button
                                            className="left"
                                            onClick={handleSubmit}
                                        >
                                            Create Term
                                        </button>:null
                                    }
                                    <br/>
                                    { !account?
                                        <h6 className="error">You must be logged in to create a term</h6>:
                                    null
                                    }
                                </div>
                            </div>
                        </div>
                </div>:
                <div className="textwindow">
                    <h1 className="undercontext">This Feature Is For Admins Only</h1>
                    <h3 className="undercontext">Redirecting in 3 Seconds</h3>
                </div>
            }
        </div>
    );
}

export default TermCreate;
