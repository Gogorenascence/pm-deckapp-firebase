import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import ImageWithoutRightClick from "../../Display/ImageWithoutRightClick";
import { shortenedText } from "../../Helpers";

function CardTypesPage() {

    const { account } = useContext(AuthContext)

    const [cardTypes, setCardTypes ] = useState([]);

    const getCardTypes = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/card_types/`);
        const data = await response.json();
        const sortedData = [...data.card_types].sort((a,b) => a.name.localeCompare(b.name));
        setCardTypes(sortedData.filter(item => item.tag_number !== 1000));
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getCardTypes();
        document.title = "Card Types - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);


    return (
        <div className="white-space">
            <div className="flex-items">
                <h1 className="left-h1-2">Card Types</h1>

                { account && account.roles.includes("admin")?
                    <NavLink to="/cardtypecreate">
                        <button
                            className="left red margin-left-13">
                            Create
                        </button>
                    </NavLink>:
                null}
            </div>

            <div className="fullTableBorder">
                {cardTypes.map(function(cardType, index, arr) {
                    return (
                        <NavLink to={`/cardtypes/${cardType.id}`} className="nav-link no-pad" key={cardType.name}>
                            <div className="flex">
                                <div className="table200">
                                    <h5 className="text-table aligned">{cardType.name}</h5>
                                </div>
                                <div className="tableText">
                                    <h5 className="text-table-2">{cardType.description}</h5>
                                </div>
                            </div>
                    </NavLink>
                    );
                })}
            </div>

        </div>
    );
}

export default CardTypesPage;
