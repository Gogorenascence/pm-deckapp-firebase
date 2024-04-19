import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import ImageWithoutRightClick from "../../Display/ImageWithoutRightClick";
import { shortenedText } from "../../Helpers";

function ExtraEffectsPage() {

    const { account } = useContext(AuthContext)

    const [extraEffects, setExtraEffects ] = useState([]);

    const getExtraEffects = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/extra_effects/`);
        const data = await response.json();
        const sortedData = [...data.extra_effects].sort((a,b) => a.name.localeCompare(b.name));
        setExtraEffects(sortedData.filter(item => item.tag_number !== 1000));
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getExtraEffects();
        document.title = "Extra Effects - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);


    return (
        <div className="white-space">
            <div className="flex-items">
                <h1 className="left-h1-2">Extra Effects</h1>

                { account && account.roles.includes("admin")?
                    <NavLink to="/extraeffectcreate">
                        <button
                            className="left red margin-left-13">
                            Create
                        </button>
                    </NavLink>:
                null}
            </div>

            <div className="fullTableBorder">
                {extraEffects.map(function(extraEffect, index, arr) {
                    return (
                        <NavLink to={`/extraeffects/${extraEffect.id}`} className="nav-link no-pad" key={extraEffect.name}>
                            <div className="flex">
                                <div className="table200">
                                    <h5 className="text-table aligned">{extraEffect.name}</h5>
                                </div>
                                <div className="tableText">
                                    <h5 className="text-table-2">{extraEffect.rules}</h5>
                                </div>
                            </div>
                        </NavLink>
                    );
                })}
            </div>

        </div>
    );
}

export default ExtraEffectsPage;
