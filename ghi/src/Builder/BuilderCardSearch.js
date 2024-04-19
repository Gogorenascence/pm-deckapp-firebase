import React, { useEffect, useContext } from 'react';
import { BuilderQueryContext } from '../Context/BuilderQueryContext';


function BuilderCardSearch() {
    const {query,
        setQuery,
        sortState,
        setSortState,
        setBoosterSet,
        boosterSets,
        setBoosterSets,
        boosterSetId,
        setBoosterSetId,
        rarity,
        setRarity,
        listView,
        setListView,
        setShowMore} = useContext(BuilderQueryContext)

    const getBoosterSets = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/booster_sets/`);
        const data = await response.json();
        setBoosterSets(data.booster_sets);
    };

    const handleBoosterSetChange = (event) => {
        setBoosterSetId(event.target.value)
        const selectedBoosterSet = boosterSets.find(set => set.id === event.target.value);
        setBoosterSet(selectedBoosterSet)
    };

    const handleRarityChange = (event) => {
        setRarity(event.target.value);
    };

    useEffect(() => {
        getBoosterSets();
    // eslint-disable-next-line
    },[]);

    const handleQuery = (event) => {
        setQuery({ ...query, [event.target.name]: event.target.value });
        setShowMore(20)
    };

    const handleQueryReset = (event) => {
        setQuery({
            cardName: "",
            cardText: "",
            cardNumber: "",
            heroID: "",
            series: "",
            startingNum: "",
            type: "",
            cardClass: "",
            extraEffect: "",
            reaction: "",
            tag: "",
        });
        setBoosterSetId("")
        setBoosterSet("");
        setRarity("")
        setSortState("none")
    };

    const handleSort = (event) => {
        setSortState(event.target.value);
    };

    const handleListView = (event) => {
        setListView(!listView);
    };

    return (

        <div>
            <h2 className="left">Search for cards</h2>
            <input
                className="left dcbsearch-large"
                type="text"
                placeholder=" Card Name Contains..."
                name="cardName"
                value={query.cardName}
                onChange={handleQuery}>
            </input>
            <br/>
            <input
                className="left dcbsearch-large"
                type="text"
                placeholder=" Card Text Contains..."
                name="cardText"
                value={query.cardText}
                onChange={handleQuery}>
            </input>
            <br/>
            <input
                className="left dcbsearch-medium"
                type="text"
                placeholder=" Card Number"
                name="cardNumber"
                value={query.cardNumber}
                onChange={handleQuery}>
            </input>
            <input
                className="left dcbsearch-medium"
                type="text"
                placeholder=" Starting Number"
                name="startingNum"
                value={query.startingNum}
                onChange={handleQuery}>
            </input>
            <br/>
            <input
                className="left dcbsearch-medium"
                type="text"
                placeholder=" Hero ID"
                name="heroID"
                value={query.heroID}
                onChange={handleQuery}>
            </input>
            <input
                className="left dcbsearch-medium"
                type="text"
                placeholder=" Series"
                name="series"
                value={query.series}
                onChange={handleQuery}>
            </input>
            <br/>
            <select
                className="left dcbsearch-small"
                type="text"
                placeholder=" Type"
                name="type"
                value={query.type}
                onChange={handleQuery}>
                <option value="">Type</option>
                <option value="1001">Fighter</option>
                <option value="1002">Aura</option>
                <option value="1003">Move</option>
                <option value="1004">Ending</option>
                <option value="1005">Any Type</option>
                <option value="1006">Item</option>
                <option value="1007">Event</option>
                <option value="1008">Comeback</option>
            </select>
            <select
                className="left dcbsearch-small"
                type="text"
                placeholder=" Class"
                name="cardClass"
                value={query.cardClass}
                onChange={handleQuery}>
                <option value="">Class</option>
                <option value="Staunch">Staunch</option>
                <option value="Power">Power</option>
                <option value="Unity">Unity</option>
                <option value="Canny">Canny</option>
            </select>
            <select
                className="left dcbsearch-small"
                type="text"
                placeholder=" Extra Effect"
                name="extraEffect"
                value={query.extraEffect}
                onChange={handleQuery}>
                <option value="">Extra Effect</option>
                <option value="1001">Trigger</option>
                <option value="1003">Limited</option>
                <option value="1002">Critical</option>
            </select>
            <br/>
            <select
                className="left dcbsearch-small"
                type="text"
                placeholder=" Reaction"
                name="reaction"
                value={query.reaction}
                onChange={handleQuery}>
                <option value="">Reaction</option>
                <option value="1001">Block</option>
                <option value="1002">Counter</option>
                <option value="1003">Endure</option>
                <option value="1004">Redirect</option>
            </select>
            <select
                className="left dcbsearch-small"
                type="text"
                placeholder=" Tag"
                name="tag"
                value={query.tag}
                onChange={handleQuery}>
                <option value="">Tag</option>
                <option value="1001">5 HP</option>
                <option value="1002">Focus</option>
                <option value="1003">Auto</option>
                <option value="1004">Stay</option>
                <option value="1005">Max</option>
                <option value="1006">Cycle</option>
                <option value="1007">Hit 1</option>
            </select>
            <select
                className="left dcbsearch-small"
                type="text"
                placeholder=" Sorted By"
                value={sortState}
                onChange={handleSort}>
                <option value="none">Sorted By</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">A-Z</option>
                <option value="card_number">Card Number</option>
                <option value="enthusiasm_highest">Enth (High)</option>
                <option value="enthusiasm_lowest">Enth (Low)</option>
            </select>
            <br/>
            <br/>
            <h5 className="left">Search by Rarity</h5>
            <select
                className="left dcbsearch-medium"
                type="text"
                placeholder=" Card Set"
                onChange={handleBoosterSetChange}
                name="boosterSet"
                value={boosterSetId}>
                <option value="">Card Set</option>
                {boosterSets.map(function(boosterSet, index)
                {return( <option value={boosterSet.id} key={index}>{boosterSet.name}</option>)}
                    )}
            </select>
            <select
                className="left dcbsearch-medium"
                type="text"
                placeholder=" Rarity"
                onChange={handleRarityChange}
                name="rarity"
                value={rarity}>
                <option value="">Rarity</option>
                <option value="mv">Max Variables</option>
                <option value="normals">Normals</option>
                <option value="rares">Rares</option>
                <option value="super_rares">Super Rares</option>
                <option value="ultra_rares">Ultra Rares</option>
            </select>
            <br/>
            <button
                className="left"
                variant="dark"
                onClick={handleQueryReset}
                >
                Reset Filters
            </button>
            {listView?
                <button
                    className="left"
                    variant="dark"
                    onClick={handleListView}
                >
                    Deck Image View
                </button>:
                <button
                    className="left"
                    variant="dark"
                    onClick={handleListView}
                >
                    Deck List View
                </button>}
            <br/>
        </div>
    );
}


export default BuilderCardSearch;
