import {
    Card,
} from "react-bootstrap";
import { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useParams, useNavigate} from 'react-router-dom';
import BackButton from "../Display/BackButton";
import { PullsContext } from "../Context/PullsContext";
import PackOpener from "./PackOpener";
import boosterSetQueries from "../QueryObjects/BoosterSetQueries";


function PullPage() {

    const {card_set_id} = useParams();
    const [boosterSet, setBoosterSet] = useState("");
    const [perPack, setPerPack] = useState(0)
    const [date_created, setDateCreated] = useState([])
    const [maxVariables, setMaxVariables] = useState([]);
    const [normals, setNormals] = useState([]);
    const [rares, setRares] = useState([]);
    const [superRares, setSuperRares] = useState([]);
    const [ultraRares, setUltraRares] = useState([]);

    const [num, setNum] = useState("");
    const [savedPulls, setSavedPulls] = useState([]);
    const {
        boosterSetPulled,
        setBoosterSetPulled,
        pulls,
        setPulls,
        pullsList,
        pulling,
    } = useContext(PullsContext);

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [fullView, setFullView] = useState(false)

    const getBoosterSet = async() =>{
        const boosterSetData = await boosterSetQueries.getBoosterSetDataById(card_set_id);
        const ratio = boosterSetData.ratio
        const perPack = ratio.normals + ratio.rares + ratio.supers + ratio.mv
        setDateCreated(boosterSetData.created_on.date_created)
        setPerPack(perPack)
        setBoosterSet(boosterSetData);
    };

    const getCardLists = async() =>{
        const listData = await boosterSetQueries.getBoosterSetListDataById(card_set_id);
        setMaxVariables(listData.max_variables)
        setNormals(listData.normals)
        setRares(listData.rares)
        setSuperRares(listData.super_rares)
        setUltraRares(listData.ultra_rares)
    }

    const getPulls = async() =>{
        setLoading(true)
        const newPulls = []
        for (let pull of pullsList.pulls) {
            newPulls.push(pull.pulled_cards)
        }
        const allPulls = savedPulls.concat(newPulls)
        console.log(allPulls)

        setPulls(allPulls)

        if (lastSavedPullRef.current) {
            lastSavedPullRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        findUltras()
    }

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getBoosterSet();
        getCardLists();
    },[]);

    useEffect(() => {
        document.title = `Pack Openings - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    },[]);

    useEffect(() => {
        getPulls()
    },[pulling]);

    const handleFullView = (event) => {
        setFullView(!fullView);
    };

    const handleChangeNum = (event) => {
        setNum(event.target.value)
    };

    const lastSavedPullRef = useRef(null);

    const findUltras = (pull) => {
        return pull.reduce(function(ultras, card, index, arr) {
            if (boosterSet.ultra_rares.includes(card.card_number)) {
                ultras.push(card);
            }
            return ultras;
        }, []);
    };

    const handleSavePulls= (event) => {
        setSavedPulls(pulls)
        findUltras()
    }

    const handleClearPulls = (event) => {
        setBoosterSetPulled("")
        setPulls([])
        setSavedPulls([])
    }

    const getAllCards = (pulls) => {
        return pulls.reduce((all_cards, pull) => all_cards.concat(pull))
    }

    return (
        <div className="white-space">
            <Card className="text-white text-center card-list-card3" style={{margin: "2% 0%" }}>
                <div className="card-image-wrapper">
                    <div className="card-image-clip2">
                        <Card.Img
                            src={boosterSet.cover_image ? boosterSet.cover_image : "https://i.imgur.com/8wqd1sD.png"}
                            alt={boosterSet.name}
                            className="card-image2"
                            variant="bottom"/>
                    </div>
                </div>
                <Card.ImgOverlay className="blackfooter2 mt-auto">
                        <h3 className="left cd-container-child media-margin-top-none">{boosterSet.name}</h3>
                        <h6 className="left"
                            style={{margin: '0px 0px 10px 10px', fontWeight: "600"}}
                            >
                            Ultra Rares: {ultraRares.length} &nbsp; Super Rares: {superRares.length} &nbsp;
                            Rares: {rares.length} &nbsp; Normals: {normals.length} &nbsp; Max Variables: {maxVariables.length}
                        </h6>
                        <h6 className="left"
                            style={{margin: '0px 0px 10px 10px', fontWeight: "600"}}
                            >
                            {perPack} Cards Per Pack
                        </h6>
                        <div style={{ display: "flex" }}>
                            <img className="logo2" src="https://i.imgur.com/nIY2qSx.png" alt="created on"/>
                            <h6
                            className="left justify-content-end"
                            style={{margin: '5px 0px 5px 5px', fontWeight: "600", textAlign: "left"}}
                            >
                                {date_created}
                            </h6>
                        </div>
                </Card.ImgOverlay>
            </Card>

            {boosterSet.description ?
            <div>
                <h5 className="left-h1"
                    style={{marginTop: "0"}}
                    >{boosterSet.description}</h5>
            </div>:
            null}

            <div className="button-fill">
                <input
                    className="left dcbsearch-semi"
                    type="text"
                    placeholder=" Number of Packs"
                    onChange={handleChangeNum}
                    value={num}>
                </input>
                <PackOpener
                    boosterSet={boosterSet}
                    maxVariables={maxVariables}
                    normals={normals}
                    rares={rares}
                    superRares={superRares}
                    ultraRares={ultraRares}
                    num={num}
                />
                {fullView?
                    <button
                        className="left media-center"
                        onClick={handleFullView}
                    >
                        Multiple View
                    </button>:
                    <button
                        className="left media-center"
                        onClick={handleFullView}
                    >
                        Single View
                    </button>}
                <button onClick={handleSavePulls} className="left media-center">
                    Save Pulls
                </button>
                <button onClick={handleClearPulls} className="left media-center">
                    Clear Pulls
                </button>
                <button
                    className="left media-center"
                    onClick={() => navigate(`/pulls/deckbuilder`)}>
                    Create Deck
                </button>

                <BackButton/>
            </div>

            {!fullView && pulls.length > 0?
                (pulls.map((pull, pullIndex) => {
                    return (
                        <div className="rarities" ref={pullIndex === savedPulls.length - 1 ? lastSavedPullRef : null}>
                            <div>
                                <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                                    <h2
                                        className="left"
                                        style={{margin: "1% 0%", fontWeight: "700"}}
                                    > Pull {pullIndex + 1} &nbsp; </h2>
                                { findUltras(pull).length > 0 ?
                                        <h2
                                            className="rainbow rainbow_text_animated"
                                            style={{margin: "1% 0%", fontWeight: "700"}}
                                        >
                                            { findUltras(pull).length > 1 ?
                                                ` ${findUltras(pull).length} Ultra Rares Detected!!`:
                                                ` 1 Ultra Rare Detected!!`
                                            }
                                        </h2>:
                                        null
                                }
                                </div>
                                    <div className="card-pool-fill2">
                                        {pull.map((card) => {
                                            return (
                                                <div style={{display: "flex", justifyContent: "center"}}>
                                                    <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                                        {boosterSet.ultra_rares.includes(card.card_number) ?
                                                            <div className="ultra">
                                                                <img
                                                                    className="builder-card4"
                                                                    title={card.name}
                                                                    src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                                    alt={card.name}
                                                                    variant="bottom"/>
                                                            </div>:
                                                            <img
                                                                className="builder-card2"
                                                                title={card.name}
                                                                src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                                alt={card.name}
                                                                variant="bottom"/>
                                                        }
                                                    </NavLink>
                                                </div>
                                            );
                                        })}
                                    </div>
                            </div>
                        </div>
                    )})
                ):null
            }
            {fullView && pulls.length > 0?
                <div className="rarities">
                    <div>
                        <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                            <h2
                                className="left"
                                style={{margin: "1% 0%", fontWeight: "700"}}
                            >All Pulls &nbsp;</h2>
                            { findUltras(getAllCards(pulls)).length > 0 ?
                                <h2
                                    className="rainbow rainbow_text_animated"
                                    style={{margin: "1% 0%", fontWeight: "700"}}
                                >
                                    { findUltras(getAllCards(pulls)).length > 1 ?
                                        ` ${findUltras(getAllCards(pulls)).length} Ultra Rares Detected!!`:
                                        ` 1 Ultra Rare Detected!!`
                                    }
                                </h2>:
                                null
                            }
                        </div>
                        <div className="card-pool-fill2">
                                {getAllCards(pulls).sort((a,b) => a.card_number - b.card_number).map((card) => {
                                    return (
                                        <div style={{display: "flex", justifyContent: "center"}}>
                                            <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                                {boosterSet.ultra_rares.includes(card.card_number) ?
                                                    <div className="ultra">
                                                        <img
                                                            className="builder-card4"
                                                            title={card.name}
                                                            src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                            alt={card.name}
                                                            variant="bottom"/>
                                                    </div>:
                                                    <img
                                                        className="builder-card2"
                                                        title={card.name}
                                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                        alt={card.name}
                                                        variant="bottom"/>
                                                }
                                            </NavLink>
                                        </div>
                                    );
                                })}
                            </div>
                    </div>
                </div>:null
            }
        </div>
    )
}


export default PullPage;
