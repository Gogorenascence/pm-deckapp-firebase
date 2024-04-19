import React from "react";
import { NavLink } from "react-router-dom";


function CardPool({
    all_cards,
    noCards,
    noPulledCards,
    combinedList,
    isQueryEmpty,
    usePool,
    showPool,
    showMore,
    handleClick,
    handleUsePool,
    handleShowPool,
    handleShowMore,
    main_list,
    pluck_list
})
{

    const preprocessText = (text) => {
        return text.split("//").join("\n");
    };

    const seeCombinedList = (card) => {
        const cardInList = combinedList.filter(cardItem => cardItem.card_number === card.card_number)
        if (cardInList.length > 0) {
            return true
        }
    }

    return(
        <>
            { usePool?
                <div className={showPool ? "cardpool" : "no-cardpool"}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <h2
                            className="left"
                            style={{margin: "1% 0px 1% 20px", fontWeight: "700"}}
                            >All Cards</h2>
                        <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                        {all_cards.length > 0 ?
                            <h5
                            className="left db-pool-count"
                            >{all_cards.length}</h5>:
                            null}
                        {showPool ?
                            <h5 className="left db-pool-count"
                            onClick={() => handleShowPool()}>
                                    &nbsp;[Hide]
                            </h5> :
                            <h5 className="left db-pool-count"
                            onClick={() => handleShowPool()}>
                                &nbsp;[Show]
                            </h5>}
                            <h5 className="left db-pool-count"
                                style={{marginLeft: "8px"}}
                                onClick={() => handleUsePool()}>
                                [Use Pulls]
                            </h5>
                    </div>

                    <div className={showPool ? "scrollable" : "hidden2"}>
                        <div style={{margin: "8px"}}>

                            { all_cards.length == 0 && isQueryEmpty && !noCards?
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                </div> :
                            null}

                            <div className="card-pool-fill">
                                {all_cards.slice(0, showMore).map((card, index) => {
                                    return (
                                        <div className="flex-content" key={index.toString() + card.card_number.toString()}>
                                            { ( (card.card_type[0] < 1006 && main_list.length < 60) ||
                                                (card.card_type[0] > 1005 && (card.hero_id === "GEN" || main_list?.filter(cardItem => cardItem.hero_id === card.hero_id).length > 3) && pluck_list.length < 30))
                                                && main_list.concat(pluck_list).filter(cardItem => cardItem.card_number === card.card_number).length < 4 ?
                                                <img
                                                    onClick={() => handleClick(card)}
                                                    className={seeCombinedList(card) ? "selected builder-card pointer glow3" : "builder-card pointer glow3"}
                                                    title={`${card.name}\n${preprocessText(card.effect_text)}\n${card.second_effect_text ? preprocessText(card.second_effect_text) : ""}`}
                                                    src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                    alt={card.name}/>
                                            :
                                                <img
                                                    className="builder-card glow3 greyScale"
                                                    title={`${card.name}\n${preprocessText(card.effect_text)}\n${card.second_effect_text ? preprocessText(card.second_effect_text) : ""}`}
                                                    src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                    alt={card.name}/>
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {showMore < all_cards.length ?
                            <button
                                style={{ width: "97%", margin:".5% 0% .5% 1.5%"}}
                                onClick={handleShowMore}>
                                Show More Cards ({all_cards.length - showMore} Remaining)
                            </button> : null
                        }
                    </div>
                </div>
            :
                <>
                    { !noPulledCards?

                        <div className={showPool ? "cardpool" : "no-cardpool"}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <h2
                                className="left"
                                style={{margin: "1% 0px 1% 20px", fontWeight: "700"}}
                                >{usePool? "All Cards":"Pulled Cards"}</h2>
                            <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                            {all_cards.length > 0 ?
                                <h5
                                className="left db-pool-count"
                                >{all_cards.length}</h5>:
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
                                <h5 className="left db-pool-count"
                                    style={{marginLeft: "8px"}}
                                    onClick={() => handleUsePool()}>
                                    [Use All Cards]
                                </h5>
                        </div>

                        <div className={showPool ? "scrollable" : "hidden2"}>
                            <div style={{margin: "8px"}}>

                                { all_cards.length == 0 && isQueryEmpty && !noPulledCards?
                                    <div className="loading-container">
                                        <div className="loading-spinner"></div>
                                    </div> :
                                null}

                                <div className="card-pool-fill">
                                    {all_cards.slice(0, showMore).map((card, index) => {
                                        return (
                                            <div className="flex-content" key={index.toString() + card.card_number.toString()}>
                                                { (card.card_type[0] < 1006 || card.hero_id === "GEN" || main_list?.filter(cardItem => cardItem.hero_id === card.hero_id).length > 3)
                                                    && combinedList.filter(cardItem => cardItem.card_number === card.card_number).length < 4?
                                                    <img
                                                        onClick={() => handleClick(card)}
                                                        className={combinedList.includes(card) ? "selected builder-card pointer glow3" : "builder-card pointer glow3"}
                                                        title={`${card.name}\n${preprocessText(card.effect_text)}\n${card.second_effect_text ? preprocessText(card.second_effect_text) : ""}`}
                                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                        alt={card.name}/>
                                                :
                                                    <img
                                                        className="builder-card glow3 greyScale"
                                                        title={`${card.name}\n${preprocessText(card.effect_text)}\n${card.second_effect_text ? preprocessText(card.second_effect_text) : ""}`}
                                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                        alt={card.name}/>
                                                }
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {showMore < all_cards.length ?
                                <button
                                    style={{ width: "97%", margin:".5% 0% .5% 1.5%"}}
                                    onClick={handleShowMore}>
                                    Show More Cards ({all_cards.length - showMore} Remaining)
                                </button> : null
                            }
                        </div>

                        </div>

                    :

                        <div className="no-cardpool">
                            <div style={{display: "flex", alignItems: "center"}}>
                                <h2
                                    className="left"
                                    style={{margin: "1% 0px 1% 20px", fontWeight: "700"}}
                                    >Pulled Cards</h2>
                                <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                                {all_cards.length > 0 ?
                                    <h5
                                    className="left db-pool-count"
                                    >{all_cards.length}</h5>:
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
                                <h5 className="left db-pool-count"
                                    style={{marginLeft: "8px"}}
                                    onClick={() => handleUsePool()}>
                                    [Use All Cards]
                                </h5>
                            </div>

                            <div className={showPool ? null : "hidden2"}>
                                <div style={{margin: "8px"}}>
                                    { all_cards.length == 0 && isQueryEmpty && noPulledCards?
                                        <div className="inScrollable">
                                            <NavLink to="/cardsets"
                                                className="black-white nav-link">
                                                <div className="media-h1-h2-box">
                                                    <h1 className="media-h1-h2">No pulled cards</h1>
                                                    <h1 className="media-h1-h2">Click here for Card Set Search</h1>
                                                </div>
                                            </NavLink>
                                        </div>
                                        : null
                                    }

                                </div>
                                {showMore < all_cards.length ?
                                    <button
                                        style={{ width: "97%", margin:".5% 0% .5% 1.5%"}}
                                        onClick={handleShowMore}>
                                        Show More Cards ({all_cards.length - showMore} Remaining)
                                    </button> : null
                                }
                            </div>

                        </div>

                    }
                </>

            }
        </>
    )

}

export default CardPool;
