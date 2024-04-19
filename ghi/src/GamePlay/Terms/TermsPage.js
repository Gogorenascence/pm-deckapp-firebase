import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";


function TermsPage() {

    const { account } = useContext(AuthContext)

    const [terms, setTerms ] = useState([]);

    const getTerms = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/terms/`);
        const data = await response.json();
        const sortedData = [...data].sort((a,b) => a.name.localeCompare(b.name));
        setTerms(sortedData);
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getTerms();
        document.title = "Glossary and Rulings - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);


    return (
        <div className="white-space">
            <div className="flex-items">
                <h1 className="left-h1-2">Glossary and Rulings</h1>

                { account && account.roles.includes("admin")?
                    <NavLink to="/termcreate">
                        <button
                            className="left red margin-left-13">
                            Create
                        </button>
                    </NavLink>:
                null}
            </div>

            <div className="fullTableBorder">
                {terms.map(function(term, index, arr) {
                    return (
                        <div className="flex" key={term.name}>
                            <div className="table200">
                                <h5 className="text-table aligned">{term.name}</h5>
                            </div>
                            <div className="tableText flex-items between-space">
                                <h5 className="text-table-2">{term.text}</h5>
                                { account && account.roles.includes("admin")?
                                <NavLink className="nav-link" to={`/glossary/${term.id}`}>
                                    <h5 className="text-table">[Edit]</h5>
                                </NavLink>:
                            null}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

export default TermsPage;
