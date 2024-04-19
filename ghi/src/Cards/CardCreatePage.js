import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';


function CardCreatePage() {
    const [card, setCard] = useState({
        name: "",
        card_class: "",
        hero_id: "",
        series_name: "",
        card_number: "",
        enthusiasm: "",
        effect_text: "",
        second_effect_text: "",
        illustrator: "",
        picture_url: "",
        file_name: "",
        card_type: [],
        extra_effects: [],
        reactions: [],
        card_tags: [],
        created_on: {},
        updated_on: {},
    });

    const [card_type, setCardType] = useState([]);
    const [extra_effects, setExtraEffects] = useState([]);
    const [reactions, setReactions] = useState([]);
    const [card_tags, setCardTags] = useState([]);

    const [cardTypeList, setCardTypeList] = useState([]);
    const [extraEffectList, setExtraEffectList] = useState([]);
    const [reactionList, setReactionList] = useState([]);
    const [cardTagList, setCardTagList] = useState([]);

    const [cardTypeInput, setCardTypeInput] = useState("");
    const [extraEffectInput, setExtraEffectInput] = useState("");
    const [reactionInput, setReactionInput] = useState("");
    const [cardTagInput, setCardTagInput] = useState("");

    const [showComps, setShowComps] = useState(false);
    const {account} = useContext(AuthContext)
    const navigate = useNavigate()

    const getCardTypes = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/card_types/`);
        const cardTypeData = await response.json();

        setCardTypeList(cardTypeData.card_types.sort((a,b) => a.type_number - b.type_number));
    };

    const getExtraEffects = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/extra_effects/`);
        const extraEffectData = await response.json();

        setExtraEffectList(extraEffectData.extra_effects.sort((a,b) => a.effect_number - b.effect_number));
    };

    const getReactions = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/reactions/`);
        const reactionData = await response.json();

        setReactionList(reactionData.reactions.sort((a,b) => a.reaction_number - b.reaction_number));
    };

    const getCardTags = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/tags/`);
        const cardTagData = await response.json();

        setCardTagList(cardTagData.card_tags.sort((a,b) => a.tag_number - b.tag_number));
    };

    useEffect(() => {
        getCardTypes();
        getExtraEffects();
        getReactions();
        getCardTags();
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        document.title = "Card Create - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    const handleChange = (event) => {
        setCard({ ...card, [event.target.name]: event.target.value });
    };

    const handleShowComps = (event) => {
        setShowComps(!showComps);
    };

    const handleAddCardType = () => {
        if (cardTypeInput) {
            setCardType([...card_type, parseInt(cardTypeInput, 10)]);
            setCardTypeInput("");
            console.log(card_type)
        }
    };

    const nameCardType = (cardType) => {
        if (cardType === 1001) {
            return "Fighter";
        } else if (cardType === 1002) {
            return "Aura";
        } else if (cardType === 1003) {
            return "Move";
        } else if (cardType === 1004) {
            return "Ending";
        } else if (cardType === 1005) {
            return "Any Type";
        } else if (cardType === 1006) {
            return "Item";
        } else if (cardType === 1007) {
            return "Event";
        } else if (cardType === 1008) {
            return "Comeback";
        }
    }

    const handleRemoveCardType = (index) => {
        const updatedCardType = [...card_type];
        updatedCardType.splice(index, 1);
        setCardType(updatedCardType);
    };

    const handleAddExtraEffect = () => {
        if (extraEffectInput) {
            setExtraEffects([...extra_effects, parseInt(extraEffectInput, 10)]);
            setExtraEffectInput("");
            console.log(extra_effects)
        }
    };

    const nameExtraEffect = (extra_effect) => {
        if (extra_effect === 1001) {
            return "Trigger";
        } else if (extra_effect === 1002) {
            return "Critical";
        } else if (extra_effect === 1003) {
            return "Limited";
        }
    }

    const handleRemoveExtraEffect = (index) => {
        const updatedExtraEffects = [...extra_effects];
        updatedExtraEffects.splice(index, 1);
        setExtraEffects(updatedExtraEffects);
    };

    const handleAddReaction = () => {
        if (reactionInput) {
            setReactions([...reactions, parseInt(reactionInput, 10)]);
            setReactionInput("");
            console.log(reactions)
        }
    };

    const nameReaction = (reaction) => {
        if (reaction === 1001) {
            return "Block";
        } else if (reaction === 1002) {
            return "Counter";
        } else if (reaction === 1003) {
            return "Endure";
        } else if (reaction === 1004) {
            return "Redirect";
        }
    }

    const handleRemoveReaction = (index) => {
        const updatedReactions = [...reactions];
        updatedReactions.splice(index, 1);
        setReactions(updatedReactions);
    };

    const handleAddCardTag = () => {
        if (cardTagInput) {
            setCardTags([...card_tags, parseInt(cardTagInput, 10)]);
            setCardTagInput("");
            console.log(card_tags)
        }
    };

    const nameCardTag = (cardTag) => {
        if (cardTag === 1001) {
            return "5 HP";
        } else if (cardTag === 1002) {
            return "Focus";
        } else if (cardTag === 1003) {
            return "Auto";
        } else if (cardTag === 1004) {
            return "Stay";
        } else if (cardTag === 1005) {
            return "Max 1";
        } else if (cardTag === 1006) {
            return "Cycle";
        }else if (cardTag === 1000) {
            return "n/a";
        }
    }

    const handleRemoveCardTag = (index) => {
        const updatedCardTags = [...card_tags];
        updatedCardTags.splice(index, 1);
        setCardTags(updatedCardTags);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...card};
        data["card_number"] = parseInt(card["card_number"], 10);
        data["enthusiasm"] = parseInt(card["enthusiasm"], 10);
        console.log(data)
        data["card_type"] = card_type
        data["extra_effects"] = extra_effects
        data["reactions"] = reactions
        data["card_tags"] = card_tags
        const card_number = data["card_number"]

        const cardUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/`;
        const fetchConfig = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(cardUrl, fetchConfig);
        if (response.ok) {
            await response.json();
            setCard({
                name: "",
                card_class: "",
                hero_id: "",
                series_name: "",
                card_number: "",
                enthusiasm: "",
                effect_text: "",
                second_effect_text: "",
                illustrator: "",
                picture_url: "",
                file_name: "",
                card_type: [],
                extra_effects: [],
                reactions: [],
                card_tags: [],
            });
            navigate(`/cards/${card_number}`);
        } else {
            alert("Error in creating card");
        }
    };

    const handleClear = (async (event) => {
        event.preventDefault();
        setCard({
            name: "",
            card_class: "",
            hero_id: "",
            series_name: "",
            card_number: "",
            enthusiasm: "",
            effect_text: "",
            second_effect_text: "",
            illustrator: "",
            picture_url: "",
            file_name: "",
            card_type: [],
            extra_effects: [],
            reactions: [],
            card_tags: [],
        });
        setCardType([]);
        setExtraEffects([]);
        setReactions([]);
        setCardTags([]);
    });

    if (!(account && account.roles.includes("admin"))) {
        setTimeout(function() {
            window.location.href = `${process.env.PUBLIC_URL}/`
        }, 3000);
    }

    return (
        <div>
            { account && account.roles.includes("admin")?
                <div className="white-space">
                    <h1 className='margin-top-40'>Card Create</h1>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <div className="create-section">
                            <div>
                                <h5 className="label">Name </h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Card Name"
                                    onChange={handleChange}
                                    name="name"
                                    value={card.name}>
                                </input>
                            </div>
                            <div>
                                <h5 className="label">Hero ID</h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Hero ID"
                                    onChange={handleChange}
                                    name="hero_id"
                                    value={card.hero_id}>
                                </input>
                            </div>
                            <div>
                                <h5 className="label">Series </h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Series"
                                    onChange={handleChange}
                                    name="series_name"
                                    value={card.series_name}>
                                </input>
                            </div>
                            <div>
                                <h5 className="label">Card Number </h5>
                                <input
                                    className="builder-input"
                                    type="number"
                                    placeholder=" Card Number"
                                    onChange={handleChange}
                                    name="card_number"
                                    value={card.card_number}>
                                </input>
                            </div>
                            <div>
                                <h5 className="label">Illustrator </h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Illustrator"
                                    onChange={handleChange}
                                    name="illustrator"
                                    value={card.illustrator}>
                                </input>
                            </div>
                            <div>
                                <h5 className="label">Picture Url </h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Picture Url"
                                    onChange={handleChange}
                                    name="picture_url"
                                    value={card.picture_url}>
                                </input>
                            </div>
                            <div>
                                <h5 className="label">File Name </h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" File Name"
                                    onChange={handleChange}
                                    name="file_name"
                                    value={card.file_name}>
                                </input>
                            </div>
                        </div>
                        <div className="create-section">
                            <div>
                                <h5 className="label">Card Class </h5>
                                <select
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Class"
                                    onChange={handleChange}
                                    name="card_class"
                                    value={card.card_class}>
                                    <option value="">Class</option>
                                    <option value="Staunch">Staunch</option>
                                    <option value="Power">Power</option>
                                    <option value="Unity">Unity</option>
                                    <option value="Canny">Canny</option>
                                </select>
                            </div>
                            <div>
                                <h5 className="label">Enthusiasm </h5>
                                <input
                                    className="builder-input"
                                    type="number"
                                    placeholder=" Enthusiasm"
                                    onChange={handleChange}
                                    name="enthusiasm"
                                    value={card.enthusiasm}>
                                </input>
                            </div>
                            <div>
                                <h5 className="label">Effect Text </h5>
                                <textarea
                                    className="create-card-text"
                                    type="text"
                                    placeholder=" Effect Text"
                                    onChange={handleChange}
                                    name="effect_text"
                                    value={card.effect_text}>
                                </textarea>
                            </div>
                            <div>
                                <h5 className="label">Second Effect Text </h5>
                                <textarea
                                    className="create-card-text"
                                    type="text"
                                    placeholder=" Second Effect Text"
                                    onChange={handleChange}
                                    name="second_effect_text"
                                    value={card.second_effect_text}>
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className="cardpool margin-top-40" style={{height: "auto"}}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <h2 style={{margin: "1% 0% 1% 2%", fontWeight: "700"}}
                                    >Add/Remove Card Components</h2>
                            { showComps ?
                                <h5 className="left db-main-count" onClick={() => handleShowComps()}>
                                        &nbsp;[Hide]
                                </h5> :
                                <h5 className="left db-main-count" onClick={() => handleShowComps()}>
                                    &nbsp;[Show]
                                </h5>}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div className={showComps ? "create-section" : "hidden2"}>
                                <div>
                                    <h5 className="label">Card Type </h5>
                                    <select
                                        className="builder-input margin-bottom-20"
                                        type="text"
                                        onChange={(e) => setCardTypeInput(e.target.value)}
                                        name="card_type"
                                        value={cardTypeInput}>
                                        <option value="">Card Type</option>
                                        {cardTypeList.map((card_type) => (
                                            <option value={card_type.type_number}>{card_type.name}</option>
                                            ))}
                                    </select>
                                    <button onClick={handleAddCardType}>Add</button>
                                </div>
                                <div>
                                    {card_type.map((item, index) => (
                                        <h5 key={index} className="pointer" onClick={() => handleRemoveCardType(index)}>
                                        {nameCardType(item)}
                                        </h5>
                                    ))}
                                </div>
                                <div>
                                    <h5 className="label">Extra Effect </h5>
                                    <select
                                        className="builder-input margin-bottom-20"
                                        type="text"
                                        onChange={(e) => setExtraEffectInput(e.target.value)}
                                        name="extra_effect"
                                        value={extraEffectInput}>
                                        <option value="">Extra Effect</option>
                                        {extraEffectList.map((extra_effect) => (
                                            <option value={extra_effect.effect_number}>{extra_effect.name}</option>
                                            ))}
                                    </select>
                                    <button onClick={handleAddExtraEffect}>Add</button>
                                </div>
                                <div>
                                    {extra_effects.map((item, index) => (
                                        <h5 key={index} className="pointer" onClick={() => handleRemoveExtraEffect(index)}>
                                            {nameExtraEffect(item)}
                                        </h5>
                                    ))}
                                </div>
                            </div>
                            <div className={showComps ? "create-section" : "hidden2"}>
                                <div>
                                    <h5 className="label">Reaction </h5>
                                    <select
                                        className="builder-input margin-bottom-20"
                                        type="text"
                                        onChange={(e) => setReactionInput(e.target.value)}
                                        name="reaction"
                                        value={reactionInput}>
                                        <option value="">Reaction</option>
                                        {reactionList.map((reaction) => (
                                            <option value={reaction.reaction_number}>{reaction.name}</option>
                                            ))}
                                    </select>
                                    <button onClick={handleAddReaction}>Add</button>
                                </div>
                                <div>
                                    {reactions.map((item, index) => (
                                        <h5 key={index} className="pointer" onClick={() => handleRemoveReaction(index)}>
                                        {nameReaction(item)}
                                        </h5>
                                    ))}
                                </div>
                                <div>
                                    <h5 className="label">Tag </h5>
                                    <select
                                        className="builder-input margin-bottom-20"
                                        type="text"
                                        onChange={(e) => setCardTagInput(e.target.value)}
                                        name="card_tag"
                                        value={cardTagInput}>
                                        <option value="">Tag</option>
                                        {cardTagList.map((card_tag) => (
                                            <option value={card_tag.tag_number}>{card_tag.name}</option>
                                            ))}
                                    </select>
                                    <button onClick={handleAddCardTag}>Add</button>
                                </div>
                                <div>
                                    {card_tags.map((item, index) => (
                                        <h5 key={index} className="pointer" onClick={() => handleRemoveCardTag(index)}>
                                        {nameCardTag(item)}
                                        </h5>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <div>
                            <button
                                className="add-comp-button"
                                variant="dark"
                                onClick={handleSubmit}
                            >
                                Create
                            </button>
                            <button
                                className="add-comp-button red"
                                variant="danger"
                                onClick={handleClear}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>:
                <div className="textwindow">
                    <h1 className="undercontext">This Feature Is For Admins Only</h1>
                    <h3 className="undercontext">Redirecting in 3 Seconds</h3>
                </div>
            }
        </div>
    )
}


export default CardCreatePage;
