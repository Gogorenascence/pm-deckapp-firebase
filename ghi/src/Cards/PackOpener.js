import { useContext } from "react";
import { PullsContext } from "../Context/PullsContext";


function PackOpener(props) {
    const { boosterSet,
            maxVariables,
            normals,
            rares,
            superRares,
            ultraRares,
            num,
    } = props
    const {
        boosterSetPulled,
        setBoosterSetPulled,
        setPullsList,
        pulling,
        setPulling
    }= useContext(PullsContext);

    const desiredSuperRaresCount = Math.floor(500 / superRares.length);
    const desiredUltraRaresCount = Math.floor(100 / ultraRares.length);
    const super_rares = superRares.map(card => Array(desiredSuperRaresCount).fill(card)).flat();
    const ultra_rares = ultraRares.map(card => Array(desiredUltraRaresCount).fill(card)).flat();
    const superRarePool = super_rares.concat(ultra_rares)

    const openPack = async() => {
        const openedPack = {
            "pull_list": [],
            "pulled_cards": [],
            "pull_stats": {
                "set_name": boosterSet.name,
                "max_variables": 0,
                "normals": 0,
                "rares": 0,
                "super_rares": 0,
                "ultra_rares": 0,
            },
            "pulled_card_types": {
                "fighters": 0,
                "auras": 0,
                "moves": 0,
                "endings": 0,
                "max_variables": 0,
                "items": 0,
                "events": 0,
                "comebacks": 0,
                "main_deck_cards": 0,
                "pluck_deck_cards": 0
            }
        }
        setBoosterSetPulled(boosterSet)
        if (maxVariables.length) {
            for (let i = 0; i < boosterSet.ratio["mv"]; i++) {
                const randomIndex = Math.floor(Math.random() * maxVariables.length);
                const card = maxVariables[randomIndex]
                openedPack["pulled_cards"].push(card)
                openedPack["pull_list"].push(card.card_number)
                openedPack["pull_stats"]["max_variables"]++
            }
        }
        for (let i = 0; i < boosterSet.ratio["normals"]; i++) {
            const randomIndex = Math.floor(Math.random() * normals.length);
            const card = normals[randomIndex]
            openedPack["pulled_cards"].push(card)
            openedPack["pull_list"].push(card.card_number)
            openedPack["pull_stats"]["normal"]++
        }
        for (let i = 0; i < boosterSet.ratio["rares"]; i++) {
            const randomIndex = Math.floor(Math.random() * rares.length);
            const card = rares[randomIndex]
            openedPack["pulled_cards"].push(card)
            openedPack["pull_list"].push(card.card_number)
            openedPack["pull_stats"]["rares"]++
        }
        for (let i = 0; i < boosterSet.ratio["supers"]; i++) {
            const randomIndex = Math.floor(Math.random() * superRarePool.length);
            const card = superRarePool[randomIndex]
            openedPack["pulled_cards"].push(card)
            openedPack["pull_list"].push(card.card_number)
            if (boosterSet.super_rares.includes(card.card_number)) {
                openedPack["pull_stats"]["super_rares"]++
            } else {
                openedPack["pull_stats"]["ultra_rares"]++
            }
        }


        for (let card of openedPack["pulled_cards"]) {
            if (card.card_type[0] === 1001) {
                openedPack["pulled_card_types"]["fighters"] += 1
                openedPack["pulled_card_types"]["main_deck_cards"] += 1
            }
            else if (card.card_type[0] == 1002){
                openedPack["pulled_card_types"]["auras"] += 1
                openedPack["pulled_card_types"]["main_deck_cards"] += 1
            }
            else if (card.card_type[0] == 1003){
                openedPack["pulled_card_types"]["moves"] += 1
                openedPack["pulled_card_types"]["main_deck_cards"] += 1
            }
            else if (card.card_type[0] == 1004){
                openedPack["pulled_card_types"]["endings"] += 1
                openedPack["pulled_card_types"]["main_deck_cards"] += 1
            }
            else if (card.card_type[0] == 1006){
                openedPack["pulled_card_types"]["items"] += 1
                openedPack["pulled_card_types"]["pluck_deck_cards"] += 1
            }
            else if (card.card_type[0] == 1007){
                openedPack["pulled_card_types"]["events"] += 1
                openedPack["pulled_card_types"]["pluck_deck_cards"] += 1
            }
            else if (card.card_type[0] == 1008){
                openedPack["pulled_card_types"]["comebacks"] += 1
                openedPack["pulled_card_types"]["pluck_deck_cards"] += 1
            } else {
                openedPack["pulled_card_types"]["max_variables"] += 1
                openedPack["pulled_card_types"]["main_deck_cards"] += 1
            }
        }
        return openedPack
    }

    const openPacks = async() => {
        console.log(num)
        if (num) {
            const openedPacks = {
                "pulls": [],
                "full_pull_list": [],
                "full_pull_stats": {
                    "set_name": boosterSet.name,
                    "max_variables": 0,
                    "normals": 0,
                    "rares": 0,
                    "super_rares": 0,
                    "ultra_rares": 0,
                },
                "full_pull_card_types": {
                    "fighters": 0,
                    "auras": 0,
                    "moves": 0,
                    "endings": 0,
                    "max_variables": 0,
                    "items": 0,
                    "events": 0,
                    "comebacks": 0,
                    "main_deck_cards": 0,
                    "pluck_deck_cards": 0
                }
            }
            setBoosterSetPulled(boosterSet)

            for (let i = 0; i < num; i++) {
                const pull = await openPack()
                openedPacks["pulls"].push(pull)

                openedPacks["full_pull_list"] = openedPacks["full_pull_list"].concat(pull["pull_list"])

                const pull_stats = pull["pull_stats"]
                const all_pull_stats = openedPacks["full_pull_stats"]
                all_pull_stats["max_variables"] += pull_stats["max_variables"]
                all_pull_stats["normals"] += pull_stats["normals"]
                all_pull_stats["rares"] += pull_stats["rares"]
                all_pull_stats["super_rares"] += pull_stats["super_rares"]
                all_pull_stats["ultra_rares"] += pull_stats["ultra_rares"]

                const pull_types = pull["pulled_card_types"]
                const all_pull_types = openedPacks["full_pull_card_types"]
                all_pull_types["fighters"] += pull_types["fighters"]
                all_pull_types["auras"] += pull_types["auras"]
                all_pull_types["moves"] += pull_types["moves"]
                all_pull_types["endings"] += pull_types["endings"]
                all_pull_types["max_variables"] += pull_types["max_variables"]
                all_pull_types["items"] += pull_types["items"]
                all_pull_types["events"] += pull_types["events"]
                all_pull_types["comebacks"] += pull_types["comebacks"]
                all_pull_types["main_deck_cards"] += pull_types["main_deck_cards"]
                all_pull_types["pluck_deck_cards"] += pull_types["pluck_deck_cards"]
            }
            console.log(openedPacks)
            setPullsList(openedPacks);
            setPulling(!pulling);
        }
    }

    return (
        <button
            className="left media-center"
            onClick={() => openPacks()}>
                Open
        </button>
    )
}

export default PackOpener;
