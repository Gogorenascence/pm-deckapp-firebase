import React from 'react';


function ImageViewCardSetInput({
    rarityString,
    rarityList,
    showRarity,
    handleShowRarity,
    modify,
    modifyName,
    clearList,
    handleModify,
    handleRemoveCard,
}) {

    const rarityModified = modify[modifyName]

    return (
        <div className="rarities">
            <div>
                <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                    <h2
                        className="left"
                        style={{margin: "1% 0%", fontWeight: "700"}}
                    >{rarityString}</h2>
                    <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                    {rarityList.length > 0 ?
                    <h5
                        className="left"
                        style={{margin: "1% 0%", fontWeight: "700"}}
                    >{rarityList.length}</h5>:
                    null}
                    { showRarity ?
                        <h5 className={rarityList.length > 0 ? "left db-main-count" : "hidden2"}
                            onClick={() => handleShowRarity()}>
                                &nbsp;[Hide]
                        </h5> :
                        <h5 className={rarityList.length > 0 ? "left db-main-count" : "hidden2"}
                            onClick={() => handleShowRarity()}>
                            &nbsp;[Show]
                        </h5>}
                    { rarityModified ?
                        <h5 className="left db-main-count">
                                &nbsp;[Changing]
                        </h5> :
                        <h5 className="left db-main-count"
                            onClick={() => handleModify(modifyName)}
                            >
                            &nbsp;[Change]
                        </h5>}
                    {rarityList.length > 0?
                        <button
                            className="left red"
                            style={{margin: "3px 0px 0px 9px"}}
                            onClick={() => clearList(modifyName)}
                        >
                            Clear {rarityString}
                        </button>:null
                    }
                </div>

                {rarityList.length > 0 ?
                    <div className={showRarity ? "card-pool-fill2": "hidden2"}>
                        {rarityList.sort((a,b) => a.card_number - b.card_number).map((card) => {
                            return (
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <img
                                        className="builder-card2 pointer"
                                        onClick={() => handleRemoveCard(card, modifyName)}
                                        title={card.name}
                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                        alt={card.name}/>
                                </div>
                            );
                        })}
                    </div> :
                    <h4 className="left no-cards">No cards added</h4>
                }
            </div>
        </div>
    );
}

export default ImageViewCardSetInput
