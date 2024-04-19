import React, { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';


function StatsPanel({
main_list,
pluck_list
}) {

    const {isDark} = useContext(AppContext)
    const stats = {
        fighters: 0,
        auras: 0,
        moves: 0,
        endings: 0,
        anyTypes: 0,
        items: 0,
        events: 0,
        comebacks: 0,
        staunch: 0,
        power: 0,
        unity: 0,
        canny: 0
    }

    const [showStats, setShowStats] = useState(false)
    const [showModal, setShowModal] = useState({
        show: false,
        label: "",
        card_type: 0,
        card_class: ""
    })
    const navigate = useNavigate()
    const content = useRef(null)
    useOutsideAlerter(content)

    function useOutsideAlerter(ref) {
        useEffect(() => {
          // Function for click event
            function handleOutsideClick(event) {
                if (ref.current && !ref.current.contains(event.target)
                    && !event.target.closest(".stat-item")) {
                    handleClose();
                }
            }
          // Adding click event listener
            document.addEventListener("click", handleOutsideClick);
                return () => document.removeEventListener("click", handleOutsideClick);
        }, [ref]);
    }

    for (let card of main_list){
        if (card.card_type[0] === 1001) {
            stats["fighters"] += 1
        }
        else if (card.card_type[0] === 1002) {
            stats["auras"] += 1
        }
        else if (card.card_type[0] === 1003) {
            stats["moves"] += 1
        }
        else if (card.card_type[0] === 1004) {
            stats["endings"] += 1
        }
        else if (card.card_type[0] === 1005) {
            stats["anyTypes"] += 1
        }

        if (card.card_class === "Staunch") {
            stats["staunch"] += 1
        }
        else if (card.card_class === "Power") {
            stats["power"] += 1
        }
        else if (card.card_class === "Unity") {
            stats["unity"] += 1
        }
        else if (card.card_class === "Canny") {
            stats["canny"] += 1
        }
    }

    for (let card of pluck_list){
        if (card.card_type[0] === 1006) {
            stats["items"] += 1
        }
        else if (card.card_type[0] === 1007) {
            stats["events"] += 1
        }
        else if (card.card_type[0] === 1008) {
            stats["comebacks"] += 1
        }
    }

    const handleShowStats = (event) => {
        setShowStats(!showStats)
    }

    const handleClose = () => {
        setShowModal({
            show: false,
            label: "",
            card_type: 0,
            card_class: ""
        })
        document.body.style.overflow = 'auto';
    };

    const handleSetClass = (card_class, item) => {
        setShowModal({
            show: true,
            label: item,
            card_type: 0,
            card_class: card_class
        })
        document.body.style.overflow = 'hidden';
    };

    const handleSetType = async(card_type, item) => {
        setShowModal({
            show: true,
            label: item,
            card_type: card_type,
            card_class: ""
        })
        document.body.style.overflow = 'hidden';
    };

    const selectCard = async(card) =>{
        const cards_number = card.card_number
        navigate(`/cards/${cards_number}`);
        handleClose()
    }

    const fullLength = main_list.length + pluck_list.length

    const card_list = main_list.concat(pluck_list)
    const filteredCards = card_list.filter(card =>
        (showModal.card_type? card.card_type[0] === showModal.card_type: true))
        .filter(card => (showModal.card_class? card.card_class === showModal.card_class: true))

    const preprocessText = (text) => {
        return text.split("//").join("\n");
    };


    return(
        <div>
            {showModal.show?
                <div className={!isDark? "large-modal topbar":"large-modal-dark topbar"}>
                    <div className="outScrollable" ref={content}>
                        <h1 className="centered-h1">{showModal.label}</h1>
                        <div>
                            <div className="cd-inner2 card-pool-fill">
                                {filteredCards.map((card) => {
                                    return (
                                        <img
                                            className="cd-related-modal-card pointer"
                                            title={`${card.name}\n${preprocessText(card.effect_text)}\n${card.second_effect_text ? preprocessText(card.second_effect_text) : ""}`}
                                            src={card.picture_url ? card.picture_url : "logo4p.png"}
                                            alt={card.name}
                                            onClick={() => selectCard(card)}/>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="cd-inner margin-top-20">
                            <button onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
            <div className={showStats ? "rarities" : "no-rarities"}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <h2
                        className="left"
                        style={{margin: "1% 5px 1% 20px", fontWeight: "700"}}
                        >Deck Stats</h2>
                    <img className="logo6" src="https://i.imgur.com/n86pToh.png" alt="bars icon"/>
                    {fullLength > 0 ?
                        <h5
                        className="left db-pool-count"
                        style={{marginLeft: "2px"}}
                        >{fullLength}</h5>:
                        null}
                    { showStats ?
                        <h5 className={fullLength > 0 ? "left db-pluck-count" : "hidden2"}
                        onClick={() => handleShowStats()}>
                                &nbsp;[Hide]
                        </h5> :
                        <h5 className={fullLength > 0 ? "left db-pluck-count" : "hidden2"}
                        onClick={() => handleShowStats()}>
                            &nbsp;[Show]
                        </h5>}
                </div>
                {fullLength > 0 ?
                <div>
                    <div className={showStats ? "card-pool-fill4": "hidden2"}
                        style={{marginTop: "10px"}}>
                        <button className={stats.fighters? "stat-item" : "hidden2"}
                            onClick={() => handleSetType(1001, "Fighters")}>
                            Fighters: {stats.fighters}</button>
                        <button className={stats.auras? "stat-item" : "hidden2"}
                            onClick={() => handleSetType(1002, "Auras")}>
                            Auras: {stats.auras}</button>
                        <button className={stats.moves? "stat-item" : "hidden2"}
                            onClick={() => handleSetType(1003, "Moves")}>
                            Moves: {stats.moves}</button>
                        <button className={stats.endings? "stat-item" : "hidden2"}
                            onClick={() => handleSetType(1004, "Endings")}>
                            Endings: {stats.endings}</button>
                        <button className={stats.anyTypes? "stat-item" : "hidden2"}
                            onClick={() => handleSetType(1005, "Any Types")}>
                            Any Types: {stats.anyTypes}</button>
                        <button className={stats.items? "stat-item" : "hidden2"}
                            onClick={() => handleSetType(1006, "Items")}>
                            Items: {stats.items}</button>
                        <button className={stats.events? "stat-item" : "hidden2"}
                            onClick={() => handleSetType(1007, "Events")}>
                            Events: {stats.events}</button>
                        <button className={stats.comebacks? "stat-item" : "hidden2"}
                            onClick={() => handleSetType(1008, "Comebacks")}>
                            Comebacks: {stats.comebacks}</button>
                        <button className={stats.staunch? "stat-item" : "hidden2"}
                            onClick={() => handleSetClass("Staunch", "Staunch")}>
                            Staunch: {stats.staunch}</button>
                        <button className={stats.power? "stat-item" : "hidden2"}
                            onClick={() => handleSetClass("Power", "Power")}>
                            Power: {stats.power}</button>
                        <button className={stats.unity? "stat-item" : "hidden2"}
                            onClick={() => handleSetClass("Unity", "Unity")}>
                            Unity: {stats.unity}</button>
                        <button className={stats.canny? "stat-item" : "hidden2"}
                            onClick={() => handleSetClass("Canny", "Canny")}>
                            Canny: {stats.canny}</button>
                    </div>
                </div>
                :
                <h4 className="left no-cards">No cards added</h4>}
            </div>
        </div>
    )
}

export default StatsPanel
