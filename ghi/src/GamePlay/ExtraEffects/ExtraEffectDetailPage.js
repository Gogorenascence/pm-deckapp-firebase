import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";


function ExtraEffectDetails() {

    const [extraEffect, setExtraEffect ] = useState({
        name: "",
        rules: "",
        tag_number: "",
        support: [],
        anti_support: [],
    });

    const {extra_effect_id} = useParams()
    const { account } = useContext(AuthContext)

    const [support_list, setSupportList] = useState([]);
    const [anti_support_list, setAntiSupportList] = useState([]);

    const [members, setMembers] = useState([]);

    const [showPool, setShowPool] = useState(true);
    const [showSupport, setShowSupport] = useState(true);
    const [showAntiSupport, setShowAntiSupport] = useState(true);

    const getExtraEffect = async() =>{
        const extraEffectResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/extra_effects/${extra_effect_id}/`);
        const extra_effect_data = await extraEffectResponse.json();
        setExtraEffect(extra_effect_data);

        const cardResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/`);
        const cardData = await cardResponse.json();

        const sortedCards = [...cardData.cards].sort((a,b) => a.name.localeCompare(b.name));
        const tagMembersList = sortedCards.filter(card => card.extra_effects.includes(extra_effect_data.effect_number))
        setMembers(tagMembersList)

        const support_card_list = extra_effect_data.support.map(supportItem =>
            cardData.cards.find(card => card.card_number === supportItem)).filter(card => card !== undefined)
        const anti_support_card_list = extra_effect_data.anti_support.map(antiSupportItem =>
            cardData.cards.find(card => card.card_number === antiSupportItem)).filter(card => card !== undefined)
        setSupportList(support_card_list)
        setAntiSupportList(anti_support_card_list)
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getExtraEffect();
    // eslint-disable-next-line
    },[]);

    useEffect(() => {
        document.title = `${extraEffect.name} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[extraEffect]);

    const handleShowPool = (event) => {
        setShowPool(!showPool);
    };

    const handleShowSupport = (event) => {
        setShowSupport(!showSupport);
    };

    const handleShowAntiSupport = (event) => {
        setShowAntiSupport(!showAntiSupport);
    };

    const preprocessCompText = (text) => {
        return text.split("\n");
    };

    return (
        <div className="white-space">
            <h1 className="margin-top-40">{extraEffect.name}</h1>
            {preprocessCompText(extraEffect.rules).map(line => {
                return(<h2>{line}</h2>)})}
                <div className={showPool ? "rarities" : "no-rarities"} style={{marginTop: "20px"}}>

                        <div style={{display: "flex", alignItems: "center"}}>
                            <h2
                                className="left"
                                style={{margin: "1% 0px 1% 20px", fontWeight: "700"}}
                            >Members</h2>
                            <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                            {members.length > 0 ?
                                <h5
                                    className="left db-pool-count"
                                >{members.length}</h5>:
                                null}
                            { showPool ?
                                <h5 className="left db-pool-count"
                                    onClick={() => handleShowPool()}>
                                        &nbsp;[Hide]
                                </h5> :
                                <h5 className="left db-pool-count"
                                    onClick={() => handleShowPool()}>
                                    &nbsp;[Show]
                                </h5>}
                            { account && account.roles.includes("admin")?
                            <NavLink to={`/extraeffects/${extraEffect.id}/edit`}>
                                <button
                                    className="left red"
                                    style={{ margin: "3px 0px 0px 9px"}}
                                >
                                    Edit Effect
                                </button>
                            </NavLink>
                            :null}
                        </div>
                        <div className={showPool ? "card-pool-fill2" : "hidden2"}>
                                {members.map((card) => {
                                    return (
                                        <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                        <div style={{display: "flex", justifyContent: "center"}}>
                                            <img
                                                className="builder-card2 pointer glow3"
                                                title={card.name}
                                                src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                alt={card.name}/>
                                        </div>
                                        </NavLink>
                                    );
                                })}

                        </div>

                </div>

                    <div className={support_list.length > 0? "support":"hidden2"}>
                        <div>
                            <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                                <h2
                                    className="left"
                                    style={{margin: "1% 0%", fontWeight: "700"}}
                                >Support</h2>
                                <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                                {support_list.length > 0 ?
                                <h5
                                    className="left"
                                    style={{margin: "1% 0%", fontWeight: "700"}}
                                >{support_list.length}</h5>:
                                null}
                                { showSupport ?
                                    <h5 className={support_list.length > 0 ? "left db-main-count" : "hidden2"}
                                        onClick={() => handleShowSupport()}>
                                            &nbsp;[Hide]
                                    </h5> :
                                    <h5 className={support_list.length > 0 ? "left db-main-count" : "hidden2"}
                                        onClick={() => handleShowSupport()}>
                                        &nbsp;[Show]
                                    </h5>}
                            </div>

                            {support_list.length > 0 ?
                            <div className={showSupport ? "card-pool-fill2": "hidden2"}>
                            {support_list.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                return (
                                    <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <img
                                            className="builder-card2 pointer"
                                            title={card.name}
                                            src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                            alt={card.name}/>
                                    </div>
                                    </NavLink>
                                );
                            })}
                        </div> :
                        <h4 className="left no-cards">No cards added</h4>}
                    </div>
                    </div>

                    <div className={anti_support_list.length > 0? "anti_support":"hidden2"}>
                        <div>
                            <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                                <h2
                                    className="left"
                                    style={{margin: "1% 0%", fontWeight: "700"}}
                                >Anti-Support</h2>
                                <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                                {anti_support_list.length > 0 ?
                                <h5
                                    className="left"
                                    style={{margin: "1% 0%", fontWeight: "700"}}
                                >{anti_support_list.length}</h5>:
                                null}
                                { showAntiSupport ?
                                    <h5 className={anti_support_list.length > 0 ? "left db-main-count" : "hidden2"}
                                        onClick={handleShowAntiSupport}
                                    >
                                        &nbsp;[Hide]
                                    </h5> :
                                    <h5 className={anti_support_list.length > 0 ? "left db-main-count" : "hidden2"}
                                        onClick={handleShowAntiSupport}
                                    >
                                        &nbsp;[Show]
                                    </h5>}
                            </div>
                            {anti_support_list.length > 0 ?
                            <div className={showAntiSupport ? "card-pool-fill2": "hidden2"}>
                            {anti_support_list.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                return (
                                    <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <img
                                            className="builder-card2 pointer"
                                            title={card.name}
                                            src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                            alt={card.name}/>
                                    </div>
                                    </NavLink>
                                );
                            })}
                        </div> :
                        <h4 className="left no-cards">No cards added</h4>}
                    </div>
                </div>
        </div>
    );
}

export default ExtraEffectDetails;
