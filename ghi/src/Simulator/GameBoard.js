import { useState, useEffect, useContext } from "react";
import { GameStateContext } from "../Context/GameStateContext";
import SimDeckSearch from "./SimDeckSearch";
import SimDeckSearchModal from "./SimDeckSearchModal";
import SimPluckSearch from "./SimPluckSearch";
import SimPluckSearchModal from "./SimPluckSearchModal";
import Ownership from "./Ownership";
import OwnershipModal from "./OwnershipModal";
import UnfurlModal from "./UnfurlModal";
import UnfurlPluckModal from "./UnfurlPluckModal";
import {PlayAreaZone, ActivePluckZone, ExtraZone} from "./SimulatorZones";
import PlayAreaModal from "./PlayAreaModal";
import ActivePluckModal from "./ActivePluckModal";


function GameBoard({
    playArea,
    activePluck,
    mainDeck,
    pluckDeck,
    ownership,
    showPluckMenu,
    setShowPluckMenu,
    drawCard,
    addCardFromDeck,
    addCardFromDiscard,
    drawPluck,
    addPluckFromDeck,
    addPluckFromDiscard,
    returnPluckToDeck,
    playCard,
    playPluck,
    fieldStyle,
    mainDiscard,
    discardCard,
    discardFromDeck,
    returnDiscardedCardToDeck,
    pluckDiscard,
    discardPluck,
    discardPluckFromOwnership,
    discardFromPluckDeck,
    returnDiscardedPluckToDeck,
    handleHoveredCard,
    selectCard,
    fromDeck,
    setFromDeck,
    fromDiscard,
    setFromDiscard,
    selectPluck,
    selectedIndex,
    selectedPluckIndex,
    shuffleMainDeck,
    shufflePluckDeck,
    showExtra,
    setShowExtra,
    volume,
    shuffling,
    shufflingPluck
}) {

    const {
        faceDown,
        setFaceDown,
        playingFaceDown,
        defending,
        handleDefending,
        addToLog
    } = useContext(GameStateContext)

    const fighter = playArea.fighter_slot || [];
    const aura = playArea.aura_slot || [];
    const move = playArea.move_slot || [];
    const ending = playArea.ending_slot || [];
    const slot5 = playArea.slot_5 || [];
    const slot6 = playArea.slot_6 || [];
    const slot7 = playArea.slot_7 || [];
    const slot8 = playArea.slot_8 || [];

    const pluck_slot1 = activePluck.slot_1 || [];
    const pluck_slot2 = activePluck.slot_2 || [];
    const pluck_slot3 = activePluck.slot_3 || [];
    const pluck_slot4 = activePluck.slot_4 || [];

    const [showOwnershipModal, setShowOwnershipModal] = useState(false)
    const [showDeckSearchModal, setShowDeckSearchModal] = useState(false)
    const [showUnfurlModal, setShowUnfurlModal] = useState(false)
    const [unfurlCount, setUnfurlCount] = useState(1)
    const [showUnfurlPluckModal, setShowUnfurlPluckModal] = useState(false)
    const [unfurlPluckCount, setUnfurlPluckCount] = useState(1)
    const [showDiscardModal, setShowDiscardModal] = useState(false)
    const [showPluckSearchModal, setShowPluckSearchModal] = useState(false)
    const [showPluckDiscardModal, setShowPluckDiscardModal] = useState(false)
    const [showPlayAreaModal, setShowPlayAreaModal] = useState({name: "", zone: null, objectName: ""})
    const [showActivePluckModal, setShowActivePluckModal] = useState({name: "", zone: null, objectName: ""})

    const totalSlotLength = slot5.length + slot6.length + slot7.length + slot8.length;

    return (
        // <div className={showExtra? "play-area" : "play-area2"}>
        <div className="play-area">
            <SimDeckSearchModal
                mainDeck={mainDeck}
                handleHoveredCard={handleHoveredCard}
                showDeckSearchModal={showDeckSearchModal}
                setShowDeckSearchModal={setShowDeckSearchModal}
                selectCard={selectCard}
                selectedIndex={selectedIndex}
                fromDiscard={fromDiscard}
                setFromDiscard={setFromDiscard}
                addCardFromDeck={addCardFromDeck}
                addCardFromDiscard={addCardFromDiscard}
                returnDiscardedCardToDeck={returnDiscardedCardToDeck}
                mainDiscard={mainDiscard}
                showDiscardModal={showDiscardModal}
                setShowDiscardModal={setShowDiscardModal}
                setFromDeck={setFromDeck}
                volume={volume}
            />
            <SimPluckSearchModal
                pluckDeck={pluckDeck}
                handleHoveredCard={handleHoveredCard}
                showPluckSearchModal={showPluckSearchModal}
                setShowPluckSearchModal={setShowPluckSearchModal}
                addPluckFromDeck={addPluckFromDeck}
                addPluckFromDiscard={addPluckFromDiscard}
                returnDiscardedPluckToDeck={returnDiscardedPluckToDeck}
                pluckDiscard={pluckDiscard}
                showPluckDiscardModal={showPluckDiscardModal}
                setShowPluckDiscardModal={setShowPluckDiscardModal}
                volume={volume}
            />
            <OwnershipModal
                ownership={ownership}
                selectPluck={selectPluck}
                handleHoveredCard={handleHoveredCard}
                selectedPluckIndex={selectedPluckIndex}
                showOwnershipModal={showOwnershipModal}
                setShowOwnershipModal={setShowOwnershipModal}
                discardPluckFromOwnership={discardPluckFromOwnership}
                returnPluckToDeck={returnPluckToDeck}
                showPluckMenu={showPluckMenu}
                setShowPluckMenu={setShowPluckMenu}
            />
            <UnfurlModal
                mainDeck={mainDeck}
                handleHoveredCard={handleHoveredCard}
                showUnfurlModal={showUnfurlModal}
                setShowUnfurlModal={setShowUnfurlModal}
                unfurlCount={unfurlCount}
                setUnfurlCount={setUnfurlCount}
                addCardFromDeck={addCardFromDeck}
                selectCard={selectCard}
                selectedIndex={selectedIndex}
                fromDeck={fromDeck}
                setFromDeck={setFromDeck}
                discardFromDeck={discardFromDeck}
                setFromDiscard={setFromDiscard}
                volume={volume}
            />
            <UnfurlPluckModal
                pluckDeck={pluckDeck}
                handleHoveredCard={handleHoveredCard}
                showUnfurlPluckModal={showUnfurlPluckModal}
                setShowUnfurlPluckModal={setShowUnfurlPluckModal}
                unfurlPluckCount={unfurlPluckCount}
                setUnfurlPluckCount={setUnfurlPluckCount}
                addPluckFromDeck={addPluckFromDeck}
                discardFromPluckDeck={discardFromPluckDeck}
                volume={volume}
            />
            <PlayAreaModal
                playArea={playArea}
                showPlayAreaModal={showPlayAreaModal}
                setShowPlayAreaModal={setShowPlayAreaModal}
                handleHoveredCard={handleHoveredCard}
            />
            <ActivePluckModal
                activePluck={activePluck}
                showActivePluckModal={showActivePluckModal}
                setShowActivePluckModal={setShowActivePluckModal}
                handleHoveredCard={handleHoveredCard}
                setShowOwnershipModal={setShowOwnershipModal}
            />
            <div className="field_box" style={fieldStyle}>
                <div className={showExtra? "flex margin-top-10": "hidden2"}>
                    <div
                        className={defending.slot_5? "matLabel selected4 pointer":"matLabel pointer"}
                        onClick={() => handleDefending("slot_5")}
                    ><h5 className="margin-bottom-0">{defending.slot_5? "Defending":"Defend"}</h5></div>
                    <div
                        className={defending.slot_6? "matLabel selected4 pointer":"matLabel pointer"}
                        onClick={() => handleDefending("slot_6")}
                    ><h5 className="margin-bottom-0">{defending.slot_6? "Defending":"Defend"}</h5></div>
                    <div
                        className={defending.slot_7? "matLabel selected4 pointer":"matLabel pointer"}
                        onClick={() => handleDefending("slot_7")}
                    ><h5 className="margin-bottom-0">{defending.slot_7? "Defending":"Defend"}</h5></div>
                    <div
                        className={defending.slot_8? "matLabel selected4 pointer":"matLabel pointer"}
                        onClick={() => handleDefending("slot_8")}
                    ><h5 className="margin-bottom-0">{defending.slot_8? "Defending":"Defend"}</h5></div>
                </div>
                <div className={showExtra? "flex": "hidden2"}>
                    <ExtraZone
                        objectName={"slot_5"}
                        stringName={"Extra Slot 1"}
                        zoneArray={slot5}
                        selectedIndex={selectedIndex}
                        playCard={playCard}
                        setShowPlayAreaModal={setShowPlayAreaModal}
                        handleHoveredCard={handleHoveredCard}
                        discardCard={discardCard}
                        playingFaceDown={playingFaceDown}
                    />
                    <ExtraZone
                        objectName={"slot_6"}
                        stringName={"Extra Slot 2"}
                        zoneArray={slot6}
                        selectedIndex={selectedIndex}
                        playCard={playCard}
                        setShowPlayAreaModal={setShowPlayAreaModal}
                        handleHoveredCard={handleHoveredCard}
                        discardCard={discardCard}
                        playingFaceDown={playingFaceDown}
                    />
                    <ExtraZone
                        objectName={"slot_7"}
                        stringName={"Extra Slot 3"}
                        zoneArray={slot7}
                        selectedIndex={selectedIndex}
                        playCard={playCard}
                        setShowPlayAreaModal={setShowPlayAreaModal}
                        handleHoveredCard={handleHoveredCard}
                        discardCard={discardCard}
                        playingFaceDown={playingFaceDown}
                    />
                    <ExtraZone
                        objectName={"slot_8"}
                        stringName={"Extra Slot 4"}
                        zoneArray={slot8}
                        selectedIndex={selectedIndex}
                        playCard={playCard}
                        setShowPlayAreaModal={setShowPlayAreaModal}
                        handleHoveredCard={handleHoveredCard}
                        discardCard={discardCard}
                        playingFaceDown={playingFaceDown}
                    />
                </div>
                <div className="margin-top-10 flex">
                    <div
                        className={defending.fighter_slot? "matLabel selected4 pointer":"matLabel pointer"}
                        onClick={() => handleDefending("fighter_slot")}
                    ><h5 className="margin-bottom-0">{defending.fighter_slot? "Defending":"Defend"}</h5></div>
                    <div
                        className={defending.aura_slot? "matLabel selected4 pointer":"matLabel pointer"}
                        onClick={() => handleDefending("aura_slot")}
                    ><h5 className="margin-bottom-0">{defending.aura_slot? "Defending":"Defend"}</h5></div>
                    <div
                        className={defending.move_slot? "matLabel selected4 pointer":"matLabel pointer"}
                        onClick={() => handleDefending("move_slot")}
                    ><h5 className="margin-bottom-0">{defending.move_slot? "Defending":"Defend"}</h5></div>
                    <div
                        className={defending.ending_slot? "matLabel selected4 pointer":"matLabel pointer"}
                        onClick={() => handleDefending("ending_slot")}
                    ><h5 className="margin-bottom-0">{defending.ending_slot? "Defending":"Defend"}</h5></div>
                </div>
                <div className="flex">
                    <div className={ totalSlotLength > 0 && !showExtra? "notify" : null}
                        style={{marginLeft: "-160px", marginRight: "20px"}}
                    >
                    { !showExtra?
                        <div className="matToggle pointer" onClick={() => setShowExtra(true)}>
                            <img className="logo5 pointer" src="https://i.imgur.com/z4CRxAm.png"/>
                        </div>
                        :
                        <div className="matToggle pointer" onClick={() => setShowExtra(false)}>
                            <img className="logo5" src="https://i.imgur.com/NE539ZZ.png"/>
                        </div>
                    }
                    </div>
                    <PlayAreaZone
                        objectName={"fighter_slot"}
                        stringName={"Fighter Slot"}
                        zoneArray={fighter}
                        selectedIndex={selectedIndex}
                        playingFaceDown={playingFaceDown}
                        playCard={playCard}
                        setShowPlayAreaModal={setShowPlayAreaModal}
                        handleHoveredCard={handleHoveredCard}
                        setFaceDown={setFaceDown}
                        faceDown={faceDown}
                        discardCard={discardCard}
                    />
                    <PlayAreaZone
                        objectName={"aura_slot"}
                        stringName={"Aura Slot"}
                        zoneArray={aura}
                        selectedIndex={selectedIndex}
                        playingFaceDown={playingFaceDown}
                        playCard={playCard}
                        setShowPlayAreaModal={setShowPlayAreaModal}
                        handleHoveredCard={handleHoveredCard}
                        setFaceDown={setFaceDown}
                        faceDown={faceDown}
                        discardCard={discardCard}
                    />
                    <PlayAreaZone
                        objectName={"move_slot"}
                        stringName={"Move Slot"}
                        zoneArray={move}
                        selectedIndex={selectedIndex}
                        playingFaceDown={playingFaceDown}
                        playCard={playCard}
                        setShowPlayAreaModal={setShowPlayAreaModal}
                        handleHoveredCard={handleHoveredCard}
                        setFaceDown={setFaceDown}
                        faceDown={faceDown}
                        discardCard={discardCard}
                    />
                    <PlayAreaZone
                        objectName={"ending_slot"}
                        stringName={"Ending Slot"}
                        zoneArray={ending}
                        selectedIndex={selectedIndex}
                        playingFaceDown={playingFaceDown}
                        playCard={playCard}
                        setShowPlayAreaModal={setShowPlayAreaModal}
                        handleHoveredCard={handleHoveredCard}
                        setFaceDown={setFaceDown}
                        faceDown={faceDown}
                        discardCard={discardCard}
                    />
                    <SimDeckSearch
                        mainDeck={mainDeck}
                        handleHoveredCard={handleHoveredCard}
                        setShowDeckSearchModal={setShowDeckSearchModal}
                        drawCard={drawCard}
                        setShowUnfurlModal={setShowUnfurlModal}
                        unfurlCount={unfurlCount}
                        setUnfurlCount={setUnfurlCount}
                        shuffleMainDeck={shuffleMainDeck}
                        mainDiscard={mainDiscard}
                        setShowDiscardModal={setShowDiscardModal}
                        fromDeck={fromDeck}
                        fromDiscard={fromDiscard}
                        volume={volume}
                        shuffling={shuffling}
                    />
                </div>
                <div className="flex">
                    <div className="matLabel margin-top-20"
                        style={{marginLeft: "-160px", marginRight: "20px"}}
                    >
                        <h5 className="margin-bottom-0">Reserve</h5>
                    </div>
                    <div className="matLabel2 margin-top-20"><h5 className="margin-bottom-0">Active Pluck</h5></div>
                </div>

                <div className="flex">
                    <Ownership
                        ownership={ownership}
                        selectPluck={selectPluck}
                        handleHoveredCard={handleHoveredCard}
                        selectedPluckIndex={selectedPluckIndex}
                        showOwnershipModal={showOwnershipModal}
                        setShowOwnershipModal={setShowOwnershipModal}
                        volume={volume}
                    />
                    <ActivePluckZone
                        objectName={"slot_1"}
                        stringName={"Active Pluck 1"}
                        zoneArray={pluck_slot1}
                        selectedPluckIndex={selectedPluckIndex}
                        playPluck={playPluck}
                        discardPluck={discardPluck}
                        handleHoveredCard={handleHoveredCard}
                        showOwnershipModal={showOwnershipModal}
                        setShowOwnershipModal={setShowOwnershipModal}
                        setShowActivePluckModal={setShowActivePluckModal}
                    />
                    <ActivePluckZone
                        objectName={"slot_2"}
                        stringName={"Active Pluck 2"}
                        zoneArray={pluck_slot2}
                        selectedPluckIndex={selectedPluckIndex}
                        playPluck={playPluck}
                        discardPluck={discardPluck}
                        handleHoveredCard={handleHoveredCard}
                        showOwnershipModal={showOwnershipModal}
                        setShowOwnershipModal={setShowOwnershipModal}
                        setShowActivePluckModal={setShowActivePluckModal}
                    />
                    <ActivePluckZone
                        objectName={"slot_3"}
                        stringName={"Active Pluck 3"}
                        zoneArray={pluck_slot3}
                        selectedPluckIndex={selectedPluckIndex}
                        playPluck={playPluck}
                        discardPluck={discardPluck}
                        handleHoveredCard={handleHoveredCard}
                        showOwnershipModal={showOwnershipModal}
                        setShowOwnershipModal={setShowOwnershipModal}
                        setShowActivePluckModal={setShowActivePluckModal}
                    />
                    <ActivePluckZone
                        objectName={"slot_4"}
                        stringName={"Active Pluck 4"}
                        zoneArray={pluck_slot4}
                        selectedPluckIndex={selectedPluckIndex}
                        playPluck={playPluck}
                        discardPluck={discardPluck}
                        handleHoveredCard={handleHoveredCard}
                        showOwnershipModal={showOwnershipModal}
                        setShowOwnershipModal={setShowOwnershipModal}
                        setShowActivePluckModal={setShowActivePluckModal}
                    />
                    <SimPluckSearch
                        pluckDeck={pluckDeck}
                        setShowPluckSearchModal={setShowPluckSearchModal}
                        handleHoveredCard={handleHoveredCard}
                        drawPluck={drawPluck}
                        setShowUnfurlPluckModal={setShowUnfurlPluckModal}
                        unfurlPluckCount={unfurlPluckCount}
                        setUnfurlPluckCount={setUnfurlPluckCount}
                        shufflePluckDeck={shufflePluckDeck}
                        pluckDiscard={pluckDiscard}
                        setShowPluckDiscardModal={setShowPluckDiscardModal}
                        volume={volume}
                        shufflingPluck={shufflingPluck}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameBoard;
