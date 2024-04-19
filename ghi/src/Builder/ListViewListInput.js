import React from 'react';
import {
    Col
} from "react-bootstrap";


function ListViewListInput({
title,
list,
main_list,
handleRemoveCard,
}) {
    return(
        <div className="margin-left-20">
            <div style={{display: "flex", alignItems: "center"}}>
                    <h2
                        className="left"
                        style={{margin: "2% 0% 1% 0%", fontWeight: "700"}}
                    >{title}</h2>
                    <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                    {list.length > 0 ?
                    <h5
                        className="left"
                        style={{margin: "1% 0%", fontWeight: "700"}}
                    >{list.length}</h5>:
                    null}
                </div>
                {list.length > 0 ?<>
                        {list.sort((a,b) => a.card_number - b.card_number).map((card, index) => {
                            return (
                                <Col style={{padding: "5px"}} key={index.toString() + card.card_number.toString()}>
                                    { (title === "Main Deck" || card.hero_id === "GEN" || main_list?.filter(cardItem => cardItem.hero_id === card.hero_id).length > 3)?
                                        <div className="card-container pointer">
                                            <h5 onClick={() => handleRemoveCard(card)}>{card.name}</h5>
                                            <img
                                                className="card-image media-hover-center"
                                                src={card.picture_url}
                                                alt={card.name}
                                            />
                                        </div>
                                    :
                                        <div className="card-container pointer">
                                            <h5 onClick={() => handleRemoveCard(card)}>{card.name}</h5>
                                            <h6 className='error3'>The Main deck needs at least 4 cards with the same Hero ID as this card.</h6>
                                            <img
                                                className="card-image3 greyScale media-hover-center"
                                                src={card.picture_url}
                                                alt={card.name}
                                            />
                                        </div>
                                    }
                                </Col>
                            );
                        })}
                    </>:
                <h4 className="left margin-0 media-margin-bottom-20">No cards added</h4>}
        </div>
    )
}

export default ListViewListInput
