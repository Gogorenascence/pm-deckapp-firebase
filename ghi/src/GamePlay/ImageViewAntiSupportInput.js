import React from 'react';


function ImageViewAntiSupportInput({
    anti_support_list,
    showAntiSupport,
    handleShowAntiSupport,
    modifySupport,
    clearAntiSupport,
    handleModifySupport,
    handleRemoveCard,
}) {
    return (
        <div className="anti_support">
            <div>
                <div style={{display: "flex", alignItems: "center", marginLeft: "20px"}}>
                    <h2
                        className="left"
                        style={{margin: "1% 0%", fontWeight: "700"}}
                    >Anti-Support</h2>
                    <img className="logo" src="https://i.imgur.com/YpdBflG.png" alt="cards icon"/>
                    {anti_support_list.length > 0 ?
                    <h5
                        className="left"
                        style={{margin: "1% 0%", fontWeight: "700"}}
                    >{anti_support_list.length}</h5>:
                    null}
                    { showAntiSupport ?
                        <h5 className={anti_support_list.length > 0 ? "left db-main-count" : "hidden2"}
                            onClick={handleShowAntiSupport}
                        >
                            &nbsp;[Hide]
                        </h5> :
                        <h5 className={anti_support_list.length > 0 ? "left db-main-count" : "hidden2"}
                            onClick={handleShowAntiSupport}
                        >
                            &nbsp;[Show]
                        </h5>}
                    { modifySupport ?
                        <h5 className="left db-main-count"
                            onClick={() => handleModifySupport()}>
                                &nbsp;[Change]
                        </h5> :
                        <h5 className="left db-main-count"
                            onClick={() => handleModifySupport()}>
                            &nbsp;[Changing]
                        </h5>}
                    {anti_support_list.length > 0?
                        <button
                            className="left red"
                            style={{margin: "3px 0px 0px 9px"}}
                            onClick={clearAntiSupport}
                        >
                            Clear Anti-Support
                        </button>:null}
                </div>
                {anti_support_list.length > 0 ?
                    <div className={showAntiSupport ? "card-pool-fill2": "hidden2"}>
                        {anti_support_list.sort((a,b) => a.card_number - b.card_number).map((card) => {
                            return (
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <img
                                        className="builder-card2 pointer"
                                        onClick={() => handleRemoveCard(card)}
                                        title={card.name}
                                        src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                                        alt={card.name}/>
                                </div>
                            );
                        })}
                    </div> :
                <h4 className="left no-cards">No cards added</h4>}
            </div>
        </div>
    );
}

export default ImageViewAntiSupportInput;
