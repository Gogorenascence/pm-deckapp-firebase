import {
    Card,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink, useParams} from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext";
import BackButton from "../Display/BackButton";


function SetDetailPage() {

    const {account} = useContext(AuthContext)
    const {card_set_id} = useParams();
    const [boosterSet, setBoosterSet] = useState("");
    const [maxVariables, setMaxVariables] = useState([]);
    const [normals, setNormals] = useState([]);
    const [rares, setRares] = useState([]);
    const [superRares, setSuperRares] = useState([]);
    const [ultraRares, setUltraRares] = useState([]);
    const [date_created, setDateCreated] = useState([])

    const [listView, setListView] = useState(false);
    const [showMaxVariables, setShowMaxVariables] = useState(false);
    const [showNormals, setShowNormals] = useState(false);
    const [showRares, setShowRares] = useState(false);
    const [showSuperRares, setShowSuperRares] = useState(false);
    const [showUltraRares, setShowUltraRares] = useState(false);

    const [perPack, setPerPack] = useState(0)

    const getBoosterSet = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/booster_sets/${card_set_id}`);
        const boosterSetData = await response.json();
        const ratio = boosterSetData.ratio
        const perPack = ratio.normals + ratio.rares + ratio.supers + ratio.mv
        setDateCreated(boosterSetData.created_on.date_created)
        setPerPack(perPack)
        setBoosterSet(boosterSetData);
    };

    const getCardLists = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/booster_sets/${card_set_id}/list`);
        const listData = await response.json();
        setMaxVariables(listData.max_variables)
        setNormals(listData.normals)
        setRares(listData.rares)
        setSuperRares(listData.super_rares)
        setUltraRares(listData.ultra_rares)
    }

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getBoosterSet();
        getCardLists();
    },[]);

    useEffect(() => {
        document.title = `${boosterSet.name} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    },[boosterSet]);

    const handleListView = (event) => {
        setListView(!listView);
    };

    const handleShowMaxVariables = (event) => {
        setShowMaxVariables(!showMaxVariables);
    };

    const handleShowNormals = (event) => {
        setShowNormals(!showNormals);
    };

    const handleShowRares = (event) => {
        setShowRares(!showRares);
    };

    const handleShowSuperRares = (event) => {
        setShowSuperRares(!showSuperRares);
    };

    const handleShowUltraRares = (event) => {
        setShowUltraRares(!showUltraRares);
    };

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
                    <h3 className="left margin-top-30 media-margin-top-none">{boosterSet.name}</h3>
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
            <div style={{ display: "flex" }}>
                { account && account.roles.includes("admin")?
                    <NavLink to={`/cardsets/${boosterSet.id}/edit`}>
                        <button className="left red">
                            Edit Set
                        </button>
                    </NavLink>:
                null}
                <NavLink to={`/cardsets/${boosterSet.id}/pulls`}>
                    <button className="left">
                            Open Packs
                    </button>
                </NavLink>
                <NavLink to={`/cardsets/${boosterSet.id}/copy`}>
                    <button className="left">
                            Copy Set
                    </button>
                </NavLink>
                <BackButton/>
            </div>
            <div className="rarities">
                <div>
                    <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                        <h2
                            className="left"
                            style={{margin: "1% 0%", fontWeight: "700"}}
                        >Ultra Rares</h2>
                        <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                        {ultraRares.length > 0 ?
                        <h5
                            className="left db-main-count"
                        >{ultraRares.length}</h5>:
                        null}
                        { showUltraRares ?
                            <h5 className={ultraRares.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowUltraRares()}>
                                    &nbsp;[Hide]
                            </h5> :
                            <h5 className={ultraRares.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowUltraRares()}>
                                &nbsp;[Show]
                            </h5>}
                    </div>
                    {ultraRares.length > 0 ?
                        <div className={showUltraRares ? "card-pool-fill2" : "hidden2"} style={{marginBottom: "18px"}}>
                            {ultraRares.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                            <div className="ultra">
                                                <img
                                                    className="builder-card4"
                                                    title={card.name}
                                                    src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                    alt={card.name}
                                                    variant="bottom"/>
                                            </div>
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>:
                        <h4 className="left no-cards">No cards added</h4>
                    }
                </div>
            </div>
            <div className="rarities">
                <div>
                    <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                        <h2
                            className="left"
                            style={{margin: "1% 0%", fontWeight: "700"}}
                        >Super Rares</h2>
                        <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                        {superRares.length > 0 ?
                        <h5
                            className="left db-main-count"
                        >{superRares.length}</h5>:
                        null}
                        { showSuperRares ?
                            <h5 className={superRares.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowSuperRares()}>
                                    &nbsp;[Hide]
                            </h5> :
                            <h5 className={superRares.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowSuperRares()}>
                                &nbsp;[Show]
                            </h5>}
                    </div>
                    {superRares.length > 0 ?

                        <div className={showSuperRares ? "card-pool-fill2" : "hidden2"} style={{marginBottom: "18px"}}>
                            {superRares.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                            <img
                                                className="builder-card2"
                                                title={card.name}
                                                src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                alt={card.name}
                                                variant="bottom"/>
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>:
                    <h4 className="left no-cards">No cards added</h4>}
                </div>
            </div>
            <div className="rarities">
                <div>
                    <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                        <h2
                            className="left"
                            style={{margin: "1% 0%", fontWeight: "700"}}
                        >Rares</h2>
                        <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                        {rares.length > 0 ?
                        <h5
                            className="left db-main-count"
                        >{rares.length}</h5>:
                        null}
                        { showRares ?
                            <h5 className={rares.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowRares()}>
                                    &nbsp;[Hide]
                            </h5> :
                            <h5 className={rares.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowRares()}>
                                &nbsp;[Show]
                            </h5>}
                    </div>
                    {rares.length > 0 ?
                        <div className={showRares ? "card-pool-fill2" : "hidden2"} style={{marginBottom: "18px"}}>
                            {rares.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                            <img
                                                className="builder-card2"
                                                title={card.name}
                                                src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                alt={card.name}
                                                variant="bottom"/>
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>:
                        <h4 className="left no-cards">No cards added</h4>
                    }
                </div>
            </div>
            <div className="rarities">
                <div>
                    <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                        <h2
                            className="left"
                            style={{margin: "1% 0%", fontWeight: "700"}}
                        >Normals</h2>
                        <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                        {normals.length > 0 ?
                        <h5
                            className="left db-main-count"
                        >{normals.length}</h5>:
                        null}
                        { showNormals ?
                            <h5 className={normals.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowNormals()}>
                                    &nbsp;[Hide]
                            </h5> :
                            <h5 className={normals.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowNormals()}>
                                &nbsp;[Show]
                            </h5>}
                    </div>
                    {normals.length > 0 ?
                        <div className={showNormals ? "card-pool-fill2" : "hidden2"} style={{marginBottom: "18px"}}>
                            {normals.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                            <img
                                                className="builder-card2"
                                                title={card.name}
                                                src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                alt={card.name}
                                                variant="bottom"/>
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>:
                        <h4 className="left no-cards">No cards added</h4>
                    }
                </div>
            </div>
            <div className="rarities">
                <div>
                    <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                        <h2
                            className="left"
                            style={{margin: "1% 0%", fontWeight: "700"}}
                        >Max Variables</h2>
                        <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                        {maxVariables.length > 0 ?
                        <h5
                            className="left db-main-count"
                        >{maxVariables.length}</h5>:
                        null}
                        { showMaxVariables ?
                            <h5 className={maxVariables.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowMaxVariables()}>
                                    &nbsp;[Hide]
                            </h5> :
                            <h5 className={maxVariables.length > 0 ? "left db-main-count" : "hidden2"}
                                onClick={() => handleShowMaxVariables()}>
                                &nbsp;[Show]
                            </h5>}
                    </div>
                    {maxVariables.length > 0 ?
                        <div className={showMaxVariables ? "card-pool-fill2" : "hidden2"} style={{marginBottom: "18px"}}>
                            {maxVariables.sort((a,b) => a.card_number - b.card_number).map((card) => {
                                return (
                                    <div style={{display: "flex", justifyContent: "center"}}>
                                        <NavLink to={`/cards/${card.card_number}`} key={card.name}>
                                            <img
                                                className="builder-card2"
                                                title={card.name}
                                                src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                alt={card.name}
                                                variant="bottom"/>
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>:
                        <h4 className="left no-cards">No cards added</h4>
                    }
                </div>
            </div>
        </div>
    );
}


export default SetDetailPage;
