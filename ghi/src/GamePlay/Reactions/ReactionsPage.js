import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import ImageWithoutRightClick from "../../Display/ImageWithoutRightClick";
import { shortenedText } from "../../Helpers";


function ReactionsPage() {

    const { account } = useContext(AuthContext)

    const [reactions, setReactions ] = useState([]);

    const getReactions = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/reactions/`);
        const data = await response.json();
        const sortedData = [...data.reactions].sort((a,b) => a.name.localeCompare(b.name));
        setReactions(sortedData.filter(item => item.tag_number !== 1000));
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getReactions();
        document.title = "Reactions - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    const replaceCount = (reaction) => {
        return reaction.rules.replace("{count}", `X, where "X" is the count of ${reaction.name}`)
    }

    return (
        <div className="white-space">
            <div className="flex-items">
                <h1 className="left-h1-2">Reactions</h1>

                { account && account.roles.includes("admin")?
                    <NavLink to="/reactioncreate">
                        <button
                            className="left red margin-left-13">
                            Create
                        </button>
                    </NavLink>:
                null}
            </div>

            <div className="fullTableBorder">
                {reactions.map(function(reaction, index, arr) {
                        return (
                            <NavLink to={`/reactions/${reaction.id}`} className="nav-link no-pad" key={reaction.name}>
                                <div className="flex">
                                    <div className="table200">
                                        <h5 className="text-table aligned">{reaction.name}</h5>
                                    </div>
                                    <div className="tableText">
                                        <h5 className="text-table-2">{shortenedText(replaceCount(reaction))}</h5>
                                    </div>
                                </div>
                        </NavLink>
                    );
                })}
            </div>

        </div>
    );
}

export default ReactionsPage;
