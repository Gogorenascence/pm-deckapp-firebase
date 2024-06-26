import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import reactionQueries from "../../QueryObjects/ReactionQueries";
import cardQueries from "../../QueryObjects/CardQueries";


function ReactionDetails() {

    const [reaction, setReaction ] = useState({
        name: "",
        rules: "",
        reaction_number: "",
        support: [],
        anti_support: [],
    });

    const {reaction_id} = useParams()
    const { account } = useContext(AuthContext)

    const [support_list, setSupportList] = useState([]);
    const [anti_support_list, setAntiSupportList] = useState([]);

    const [members, setMembers] = useState([]);

    const [showPool, setShowPool] = useState(true);
    const [showSupport, setShowSupport] = useState(true);
    const [showAntiSupport, setShowAntiSupport] = useState(true);

    const getReaction = async() =>{
        const reaction_data = await reactionQueries.getReactionDataById(reaction_id);
        setReaction(reaction_data);

        const cardData = await cardQueries.getCardsData();

        const sortedCards = [...cardData].sort((a,b) => a.name.localeCompare(b.name));
        const reactionMembersList = sortedCards.filter(card => card.reactions.includes(reaction_data.reaction_number))
        setMembers(reactionMembersList)

        const support_card_list = reaction_data.support.map(supportItem =>
            cardData.find(card => card.card_number === supportItem))
        const anti_support_card_list = reaction_data.anti_support.map(antiSupportItem =>
            cardData.find(card => card.card_number === antiSupportItem))
        setSupportList(support_card_list)
        setAntiSupportList(anti_support_card_list)
    };

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getReaction();

    // eslint-disable-next-line
    },[]);

    useEffect(() => {;
        document.title = `${reaction.name} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[reaction]);

    const navigate = useNavigate()

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

    const replaceCount = (reaction) => {
        return reaction.rules.replace("{count}", `X, where "X" is the count of ${reaction.name}`)
    }

    return (
        <div className="white-space">
            <h1 className="margin-top-40">{reaction.name}</h1>
            {preprocessCompText(replaceCount(reaction)).map(line => {
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
                    <NavLink to={`/reactions/${reaction.id}/edit`}>
                        <button
                            className="left red"
                            style={{ margin: "3px 0px 0px 9px"}}
                        >
                            Edit Reaction
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

export default ReactionDetails;
