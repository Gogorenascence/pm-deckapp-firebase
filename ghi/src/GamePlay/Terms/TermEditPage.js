import {
    Col
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext.js";
import BackButton from "../../Display/BackButton.js";
import PopUp from "../../Display/PopUp.js";


function TermEdit() {

    const [term, setTerm ] = useState({
        name: "",
        text: "",
        term_number: 1000,
    });

    const {term_id} = useParams()
    const { account } = useContext(AuthContext)

    const [popUpAction, setPopUpAction] = useState({
        action: "",
        message: "",
        show: false
    });

    const handlePopUp = (action, message, show) => {
        setPopUpAction({
            action: action,
            message: message,
            show: show
        })
    }

    const getTerm = async() =>{
        const termResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/terms/${term_id}`);
        const term_data = await termResponse.json();
        setTerm(term_data);
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getTerm();
    // eslint-disable-next-line
    },[]);

    useEffect(() => {
        document.title = `Editing ${term.name} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[term.id]);

    const handleChange = (event) => {
        setTerm({ ...term, [event.target.name]: event.target.value });
    };

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...term};
        data["term_number"] = parseInt(term["term_number"], 10);
        const termUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/terms/${term_id}`;
        console.log(termUrl)
        const fetchConfig = {
            method: "PUT",
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
                term_number: 1000,
            });
            navigate(`/glossary/`);
            console.log("Success")
        } else {
            alert("Error in editing term");
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();
        const termUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/terms/${term_id}`;
        const fetchConfig = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(termUrl, fetchConfig);
        if (response.ok) {
            navigate(`/glossary/`);
            console.log("Success")
        } else {
            alert("Error in deleting term");
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
                    {popUpAction.show === true?
                        <PopUp
                            action={popUpAction.action}
                            message={popUpAction.message}
                            show={popUpAction.show}
                            setPopUpAction={setPopUpAction}
                        />
                    :null}
                    <h1 className="margin-top-40">Term Edit</h1>
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
                                        placeholder=" Text"
                                        onChange={handleChange}
                                        name="text"
                                        value={term.text}>
                                    </textarea>
                                    <br/>
                                    {/* <h5 className="label">Term Number </h5>
                                    <input
                                        className="builder-input"
                                        type="number"
                                        placeholder=" Term Number"
                                        onChange={handleChange}
                                        name="term_number"
                                        value={term.term_number}>
                                    </input>
                                    <br/> */}

                                    {account && account.roles.includes("admin")?
                                        <>
                                            <button
                                                className="left"
                                                style={{ marginTop: "9px"}}
                                                onClick={handleSubmit}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="left heightNorm red"
                                                onClick={() => handlePopUp(handleDelete, "Are you sure you want to delete this term?", true)}
                                                style={{marginLeft: "5px", marginRight: "7px"}}
                                                >
                                                Delete
                                            </button>
                                        </>:null
                                    }
                                    <BackButton/>
                                    <br/>
                                    { !account?
                                        <h6 className="error">You must be logged in to edit a term</h6>:
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

export default TermEdit;
