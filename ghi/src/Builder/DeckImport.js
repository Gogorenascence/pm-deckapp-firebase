import React, { useRef } from "react";


function DeckImport({
    fileInput,
    importDeck,
    importedDecks,
    showDecks,
    handleFileChange,
    handleShowDecks,
    clearDecks
}){

    const dropArea = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFileChange({ target: { files } });
    };

    return(
        <div className="deck-import"
            ref={dropArea}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div style={{display: "flex", alignItems: "center"}}>
                <h2
                    className="left"
                    style={{margin: "1% 0px 1% 20px", fontWeight: "700"}}
                >Imported Decks</h2>
                <img className="logo" src="https://i.imgur.com/JRHwOGw.png" alt="import"/>
                {importedDecks.length > 0 ?
                    <h5
                        className="left db-pool-count"
                    >{importedDecks.length}</h5>:
                    null}
                { showDecks ?
                    <h5 className="left db-pool-count"
                        onClick={() => handleShowDecks()}>
                            &nbsp;[Hide]
                    </h5> :
                    <h5 className="left db-pool-count"
                        onClick={() => handleShowDecks()}>
                        &nbsp;[Show]
                    </h5>}
            </div>
            <input
                type="file"
                multiple={true}
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInput}
            />
            {showDecks?
                <>
                    {importedDecks.length > 0?
                        <div className="deck-import-scrollable">
                            {importedDecks.map((deckItem, index) => (
                                <div key={index}>
                                    <button
                                        onClick={() => importDeck(deckItem)}
                                        style={{ margin:"5px"}}
                                        >
                                        {deckItem.ObjectStates[0].Nickname? deckItem.ObjectStates[0].Nickname: `Imported Deck ${index + 1}`}
                                    </button>
                                </div>
                            ))}
                        </div>:
                            <h4 className="left no-cards2">No decks imported</h4>
                    }
                    <div style={{display: "flex", alignItems: "center", margin: "0px 0px 15px 17px", paddingTop: "0"}}>
                        <button
                            className="left heightNorm"
                            onClick={() => fileInput.current.click()}
                        >
                            Select
                        </button>
                        {importedDecks.length > 0?
                            <button
                                className="left heightNorm red"
                                style={{ marginRight: '6px', marginLeft: '4px', width: "115px" }}
                                onClick={clearDecks}
                            >
                                Clear Decks
                            </button>:null
                        }
                        <h6 className="error2 none">Select or Drag Over a Deck</h6>
                    </div>
                </>:null
            }
        </div>
    )
}

export default DeckImport;
