import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";


function CardTypeDetails() {

    const [cardType, setCardType ] = useState({
        name: "",
        deck_type: "",
        description: "",
        rules: "",
        type_number: "",
        support: [],
        anti_support: [],
    });


    const {card_type_id} = useParams()
    const { account } = useContext(AuthContext)

    const [support_list, setSupportList] = useState([]);
    const [anti_support_list, setAntiSupportList] = useState([]);

    const [members, setMembers] = useState([]);

    const [showPool, setShowPool] = useState(true);
    const [showSupport, setShowSupport] = useState(true);
    const [showAntiSupport, setShowAntiSupport] = useState(true);

    const getCardType = async() =>{
        const cardTypeResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/card_types/${card_type_id}/`);
        const card_type_data = await cardTypeResponse.json();
        setCardType(card_type_data);

        const cardResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/`);
        const cardData = await cardResponse.json();

        const sortedCards = [...cardData.cards].sort((a,b) => a.name.localeCompare(b.name));
        const typeMembersList = sortedCards.filter(card => card.card_type[0] === card_type_data.type_number)
        setMembers(typeMembersList)

        const support_card_list = card_type_data.support.map(supportItem =>
            cardData.cards.find(card => card.card_number === supportItem)).filter(card => card !== undefined)
        const anti_support_card_list = card_type_data.anti_support.map(antiSupportItem =>
            cardData.cards.find(card => card.card_number === antiSupportItem)).filter(card => card !== undefined)
        setSupportList(support_card_list)
        setAntiSupportList(anti_support_card_list)
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getCardType();
    // eslint-disable-next-line
    },[]);

    useEffect(() => {
        document.title = `${cardType.name} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[cardType]);

    const handleShowPool = (event) => {
        setShowPool(!showPool);
    };

    const handleShowSupport = (event) => {
        setShowSupport(!showSupport);
    };

    const handleShowAntiSupport = (event) => {
        setShowAntiSupport(!showAntiSupport);
    };

    const preprocessText = (text) => {
        return text.split("//").join("\n");
    };

    return (
        <div className="white-space">
            <h1 className="margin-top-40">{cardType.name}</h1>
            <h2>{cardType.description}</h2>
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
                    <NavLink to={`/cardtypes/${cardType.id}/edit`}>
                        <button
                            className="left red"
                            style={{ margin: "3px 0px 0px 9px"}}
                        >
                            Edit Card Type
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

export default CardTypeDetails;
