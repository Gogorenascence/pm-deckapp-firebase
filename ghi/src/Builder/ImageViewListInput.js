import React from 'react';


function ImageViewListInput({
title,
list,
main_list,
showList,
handleShowList,
handleRemoveCard,
}) {
    return(
        <div>
            <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                <h2
                    className="left"
                    style={{margin: "1% 0%", fontWeight: "700"}}
                >{title}</h2>
                <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                {list.length > 0 ?
                <h5
                    className="left"
                    style={{margin: "1% 0%", fontWeight: "700"}}
                >{list.length}</h5>:
                null}
                { showList ?
                    <h5 className={list.length > 0 ? "left db-pluck-count" : "hidden2"}
                        onClick={handleShowList}
                    >
                        &nbsp;[Hide]
                    </h5> :
                    <h5 className={list.length > 0 ? "left db-pluck-count" : "hidden2"}
                        onClick={handleShowList}
                    >
                        &nbsp;[Show]
                    </h5>}
            </div>
            {list.length > 0 ?
            <div className={showList ? "card-pool-fill2": "hidden2"}>
                {list.sort((a,b) => a.card_number - b.card_number).map((card, index) => {
                    return (
                        <div className='flex-content' key={index.toString() + card.card_number.toString()}>
                            { (title === "Main Deck" || card.hero_id === "GEN" || main_list?.filter(cardItem => cardItem.hero_id === card.hero_id).length > 3)?
                                <img
                                    className="builder-card2 pointer"
                                    onClick={() => handleRemoveCard(card)}
                                    title={card.name}
                                    src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                    alt={card.name}
                                    variant="bottom"/>
                            :
                                <img
                                    className="builder-card2 pointer greyScale"
                                    onClick={() => handleRemoveCard(card)}
                                    title="The Main deck needs at least 4 cards with the same Hero ID as this card."
                                    src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                    alt={card.name}
                                    variant="bottom"/>
                            }
                        </div>
                    );
                })}
            </div> :
            <h4 className="left no-cards">No cards added</h4>}
        </div>
    )
}

export default ImageViewListInput
