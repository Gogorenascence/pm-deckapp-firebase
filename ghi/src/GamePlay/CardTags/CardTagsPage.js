import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import ImageWithoutRightClick from "../../Display/ImageWithoutRightClick";
import { shortenedText } from "../../Helpers";

function CardTagsPage() {

    const { account } = useContext(AuthContext)

    const [cardTags, setCardTags ] = useState([]);

    const getCardTags = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/tags/`);
        const data = await response.json();
        const sortedData = [...data.card_tags].sort((a,b) => a.name.localeCompare(b.name));
        setCardTags(sortedData.filter(item => item.tag_number !== 1000));
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getCardTags();
        document.title = "Card Tags - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);


    return (
        <div className="white-space">
            <div className="flex-items">
                <h1 className="left-h1-2">Card Tags</h1>

                { account && account.roles.includes("admin")?
                    <NavLink to="/cardtagcreate">
                        <button
                            className="left red margin-left-13">
                            Create
                        </button>
                    </NavLink>:
                null}
            </div>

            <div className="fullTableBorder">
                {cardTags.map(function(cardTag, index, arr) {
                    return (
                        <NavLink to={`/cardtags/${cardTag.id}`} className="nav-link no-pad" key={cardTag.name}>
                            <div className="flex">
                                <div className="table200">
                                    <h5 className="text-table aligned">{cardTag.name}</h5>
                                </div>
                                <div className="tableText">
                                    <h5 className="text-table-2">{cardTag.rules}</h5>
                                </div>
                            </div>
                        </NavLink>
                    );
                })}
            </div>

        </div>
    );
}

export default CardTagsPage;
