function DeckExport(props) {

  let deck_id = props.deck_id
  let deck = props.deck
  let main_list = props.main_list
  let pluck_list = props.pluck_list

  let DeckIDsMainList = []
  const getDeckIDsMainList = async() =>{
    for (let id of deck.cards){
      DeckIDsMainList.push(id * 100)
    }
  }
  let DeckIDsPluckList = []
  const getDeckIDsPluckList = async() =>{
    for (let id of deck.pluck){
      DeckIDsPluckList.push(id * 100)
    }
  }

  const loadCardImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      image.src = src;
    });

  const exportDeck = async() =>{
    loadCardImage()
    getDeckIDsMainList()
    let deckExport = {
        "ObjectStates": [
          {
            "GUID": "",
            "Name": "Deck",
            "Transform": {
              "posX": -7.67987967,
              "posY": 1.0001868,
              "posZ": 12.2712269,
              "rotX": -2.99913445E-08,
              "rotY": 179.999084,
              "rotZ": -4.10565463E-07,
              "scaleX": 1.36402035,
              "scaleY": 1.0,
              "scaleZ": 1.36402035
            },
            "Nickname": `${deck.name} Main`,
            "Description": "",
            "GMNotes": "",
            "AltLookAngle": {
              "x": 0.0,
              "y": 0.0,
              "z": 0.0
            },
            "ColorDiffuse": {
              "r": 0.713235259,
              "g": 0.713235259,
              "b": 0.713235259
            },
            "LayoutGroupSortIndex": 0,
            "Value": 0,
            "Locked": false,
            "Grid": true,
            "Snap": true,
            "IgnoreFoW": false,
            "MeasureMovement": false,
            "DragSelectable": true,
            "Autoraise": true,
            "Sticky": true,
            "Tooltip": true,
            "GridProjection": false,
            "HideWhenFaceDown": true,
            "Hands": false,
            "SidewaysCard": false,
            "DeckIDs": [],
            "CustomDeck": {},
            "LuaScript": "",
            "LuaScriptState": "",
            "XmlUI": "",
            "ContainedObjects": []
          }
        ]
      }
    deckExport["ObjectStates"][0]["GUID"] = deck_id.slice(0,7)
    deckExport["ObjectStates"][0]["DeckIDs"] = DeckIDsMainList
    let deckExportContainedObjects = []
    for (let card of main_list){
      deckExport["ObjectStates"][0]["CustomDeck"][card.card_number.toString()] = {
        "FaceURL": "",
        "BackURL": "https://i.imgur.com/krY25iI.png",
        "NumWidth": 1,
        "NumHeight": 1,
        "BackIsHidden": true,
        "UniqueBack": false,
        "Type": 0
      }
      deckExport["ObjectStates"][0]["CustomDeck"][card.card_number.toString()]["FaceURL"] = card.picture_url
      let cardToAdd = {
        "GUID": "",
        "Name": "CardCustom",
        "Transform": {
          "posX": 7.48822546,
          "posY": 1.00981486,
          "posZ": -11.2899828,
          "rotX": 1.01114793E-07,
          "rotY": 179.992889,
          "rotZ": -4.55801228E-07,
          "scaleX": 1.36402035,
          "scaleY": 1.0,
          "scaleZ": 1.36402035
        },
        "Nickname": "",
        "Description": "",
        "GMNotes": "",
        "AltLookAngle": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0
        },
        "ColorDiffuse": {
          "r": 0.713235259,
          "g": 0.713235259,
          "b": 0.713235259
        },
        "LayoutGroupSortIndex": 0,
        "Value": 0,
        "Locked": false,
        "Grid": true,
        "Snap": true,
        "IgnoreFoW": false,
        "MeasureMovement": false,
        "DragSelectable": true,
        "Autoraise": true,
        "Sticky": true,
        "Tooltip": true,
        "GridProjection": false,
        "HideWhenFaceDown": true,
        "Hands": true,
        "CardID": 16000,
        "SidewaysCard": false,
        "CustomDeck": {

        },
        "LuaScript": "",
        "LuaScriptState": "",
        "XmlUI": ""
      }
      cardToAdd["GUID"] = card.id.slice(0,6)
      cardToAdd[card.card_number] = {
        "FaceURL": "",
        "BackURL": "https://i.imgur.com/krY25iI.png",
        "NumWidth": 1,
        "NumHeight": 1,
        "BackIsHidden": true,
        "UniqueBack": false,
        "Type": 0
      }
      cardToAdd[card.card_number]["FaceURL"] = card.picture_url
      deckExportContainedObjects.push(cardToAdd)
    }
    deckExport["ObjectStates"]["ContainedObjects"] = deckExportContainedObjects
    console.log(deckExport)

    getDeckIDsPluckList()
    let pluckExport = {
      "ObjectStates": [
        {
          "GUID": "",
          "Name": "Deck",
          "Transform": {
            "posX": 7.48822546,
            "posY": 1.17349243,
            "posZ": -11.2899828,
            "rotX": 6.959348E-08,
            "rotY": 179.992889,
            "rotZ": -1.60653656E-07,
            "scaleX": 1.36402035,
            "scaleY": 1.0,
            "scaleZ": 1.36402035
          },
          "Nickname": `${deck.name} Pluck`,
          "Description": "",
          "GMNotes": "",
          "AltLookAngle": {
            "x": 0.0,
            "y": 0.0,
            "z": 0.0
          },
          "ColorDiffuse": {
            "r": 0.713235259,
            "g": 0.713235259,
            "b": 0.713235259
          },
          "LayoutGroupSortIndex": 0,
          "Value": 0,
          "Locked": false,
          "Grid": true,
          "Snap": true,
          "IgnoreFoW": false,
          "MeasureMovement": false,
          "DragSelectable": true,
          "Autoraise": true,
          "Sticky": true,
          "Tooltip": true,
          "GridProjection": false,
          "HideWhenFaceDown": true,
          "Hands": false,
          "SidewaysCard": false,
          "DeckIDs": [],
          "CustomDeck": {},
          "LuaScript": "",
          "LuaScriptState": "",
          "XmlUI": "",
          "ContainedObjects": []
        }
      ]
    }
  pluckExport["ObjectStates"][0]["GUID"] = deck_id.slice(6,12)
  pluckExport["ObjectStates"][0]["DeckIDs"] = DeckIDsPluckList
  let pluckExportContainedObjects = []
  for (let card of pluck_list){
    pluckExport["ObjectStates"][0]["CustomDeck"][card.card_number.toString()] = {
      "FaceURL": "",
      "BackURL": "https://playmakercards.s3.us-west-1.amazonaws.com/plucks4-1.png",
      "NumWidth": 1,
      "NumHeight": 1,
      "BackIsHidden": true,
      "UniqueBack": false,
      "Type": 0
    }
    pluckExport["ObjectStates"][0]["CustomDeck"][card.card_number.toString()]["FaceURL"] = card.picture_url
    let cardToAdd = {
      "GUID": "",
      "Name": "CardCustom",
      "Transform": {
        "posX": 12.9686184,
        "posY": 0.9735896,
        "posZ": -11.6660242,
        "rotX": 0.000152097622,
        "rotY": 179.995132,
        "rotZ": -0.0010223327,
        "scaleX": 1.36402035,
        "scaleY": 1.0,
        "scaleZ": 1.36402035
      },
      "Nickname": "",
      "Description": "",
      "GMNotes": "",
      "AltLookAngle": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "ColorDiffuse": {
        "r": 0.713235259,
        "g": 0.713235259,
        "b": 0.713235259
      },
      "LayoutGroupSortIndex": 0,
      "Value": 0,
      "Locked": false,
      "Grid": true,
      "Snap": true,
      "IgnoreFoW": false,
      "MeasureMovement": false,
      "DragSelectable": true,
      "Autoraise": true,
      "Sticky": true,
      "Tooltip": true,
      "GridProjection": false,
      "HideWhenFaceDown": true,
      "Hands": true,
      "CardID": 16000,
      "SidewaysCard": false,
      "CustomDeck": {

      },
      "LuaScript": "",
      "LuaScriptState": "",
      "XmlUI": ""
    }
    cardToAdd["GUID"] = card.id.slice(0,7)
    cardToAdd[card.card_number] = {
      "FaceURL": "",
      "BackURL": "https://playmakercards.s3.us-west-1.amazonaws.com/plucks4-1.png",
      "NumWidth": 1,
      "NumHeight": 1,
      "BackIsHidden": true,
      "UniqueBack": false,
      "Type": 0
    }
    cardToAdd[card.card_number]["FaceURL"] = card.picture_url
    pluckExportContainedObjects.push(cardToAdd)
  }
  pluckExport["ObjectStates"]["ContainedObjects"] = pluckExportContainedObjects
  console.log(pluckExport)


  // // Download image for the first card in main_list
  // const mainCardImage = await loadCardImage("main_back.png");
  //   mainCardImage.src = main_list[0].picture_url;
  //   mainCardImage.onload = () => {
  //     const canvas = document.createElement("canvas");
  //     canvas.width = mainCardImage.width;
  //     canvas.height = mainCardImage.height;
  //     const ctx = canvas.getContext("2d");
  //     ctx.drawImage(mainCardImage, 0, 0);
  //     canvas.toBlob((blob) => {
  //       const mainCardLink = document.createElement("a");
  //       mainCardLink.href = URL.createObjectURL(blob);
  //       mainCardLink.download = `${deck.name} Main.png`;
  //       mainCardLink.click();
  //       URL.revokeObjectURL(mainCardLink.href);
  //     }, "image/png");
  //   };


  // // Download image for the first card in pluck_list
  // const pluckCardImage = await loadCardImage("pluck_back.png");
  // pluckCardImage.src = pluck_list[0].picture_url;
  // pluckCardImage.onload = () => {
  //   const canvas = document.createElement("canvas");
  //   canvas.width = 256;
  //   canvas.height = 256;
  //   const ctx = canvas.getContext("2d");
  //   ctx.drawImage(pluckCardImage, 0, 0);
  //   canvas.toBlob((blob) => {
  //     const pluckCardLink = document.createElement("a");
  //     pluckCardLink.href = URL.createObjectURL(blob);
  //     pluckCardLink.download = `${deck.name} Pluck.png`;
  //     pluckCardLink.click();
  //     URL.revokeObjectURL(pluckCardLink.href);
  //   }, "image/png");
  // };


  const deckExportBlob = new Blob([JSON.stringify(deckExport)], { type: "application/json" });
  const deckExportURL = URL.createObjectURL(deckExportBlob);
  const deckExportLink = document.createElement("a");
  deckExportLink.href = deckExportURL;
  deckExportLink.download = `${deck.name} Main.json`;
  deckExportLink.click();
  URL.revokeObjectURL(deckExportURL);

  // Create the pluckExport JSON file
  const pluckExportBlob = new Blob([JSON.stringify(pluckExport)], { type: "application/json" });
  const pluckExportURL = URL.createObjectURL(pluckExportBlob);
  const pluckExportLink = document.createElement("a");
  pluckExportLink.href = pluckExportURL;
  pluckExportLink.download = `${deck.name} Pluck.json`;
  pluckExportLink.click();
  URL.revokeObjectURL(pluckExportURL);
};

  return (
    <div>
      <button
        className="left heightNorm"
        variant="dark"
        style={{marginRight: "10px", marginLeft: "6px" }}
        onClick={exportDeck}
      >
        JSON
      </button>
</div>
);
}


export default DeckExport;
