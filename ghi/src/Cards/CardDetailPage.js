import { useState, useEffect, useContext } from "react";
import { NavLink, useParams, useNavigate} from 'react-router-dom';
import CardEditModal from "./CardEditModal";
import RelatedCardModal from "./RelatedCardModal";
import BackButton from "../Display/BackButton";
import { AuthContext } from "../Context/AuthContext";
import cardQueries from "../QueryObjects/CardQueries";
import cardCategoryQueries from "../QueryObjects/CardCategoryQueries";
import cardTagQueries from "../QueryObjects/CardTagQueries"
import extraEffectQueries from "../QueryObjects/ExtraEffectQueries"
import cardTypeQueries from "../QueryObjects/CardTypeQueries"
import reactionQueries from "../QueryObjects/ReactionQueries"


function CardDetailPage() {
    const {card_number} = useParams();
    const [card, setCard] = useState({
        name: "",
        card_class: "",
        hero_id: "",
        series_name: "",
        seriesNames: [],
        card_number: "",
        enthusiasm: "",
        effect_text: "",
        second_effect_text: "",
        effectText: [],
        secondEffectText: [],
        illustrator: "",
        picture_url: "",
        file_name: "",
        card_type: [],
        extra_effects: [],
        reactions: [],
        card_tags: [],
    });
    const [relatedCards, setRelatedCards] = useState([]);
    const [card_categories, setCardCategories] = useState([])

    const [cards, setCards] = useState([]);
    const [cardType, setCardType] = useState([]);
    const [cardTags, setCardTags] = useState([]);
    const [extraEffects, setExtraEffects] = useState([]);
    const [reactions, setReactions] = useState([]);

    const { account } = useContext(AuthContext)

    const getCard = async() =>{
        const cardData = await cardQueries.getCardData(card_number)

        cardData["seriesNames"] = cardData.series_name.split("//")
        cardData["effectText"] = cardData.effect_text.split("//")
        if (cardData.second_effect_text){
            cardData["secondEffectText"] = cardData.second_effect_text.split("//")
        }
        setCard(cardData);
        console.log(cardData)

        const relatedData = await cardQueries.getRelatedCardData(cardData.hero_id, cardData.card_number)
        setRelatedCards(relatedData);

        const cardTypeData = await cardTypeQueries.getCardTypeDataFromCard(cardData.card_type);
        console.log(cardTypeData)
        setCardType(cardTypeData);

        const cardTagData = await cardTagQueries.getCardTagDataFromCard(cardData.card_tags);
        setCardTags(cardTagData);

        const extraEffectData = await extraEffectQueries.getExtraEffectDataFromCard(cardData.extra_effects);
        setExtraEffects(extraEffectData);

        const reactionData = await reactionQueries.getReactionDataFromCard(cardData.reactions)
        reactionData.map(reaction => reaction["rules"] = reaction["rules"].replace("{count}", reaction["count"].toString()))

        setReactions(reactionData);

    };

    const getCards = async() =>{
        const data = await cardQueries.getCardsData();
        setCards(data.reverse());
    };

    const getCardCategories = async() =>{
        const data = await cardCategoryQueries.getCardCategoriesData();
        const sortedData = [...data].sort((a,b) => a.name.localeCompare(b.name));
        setCardCategories(sortedData);
    };

    const navigate = useNavigate()

    const getRandomCard = async() =>{
        const randomIndex = Math.floor(Math.random() * cards.length);
        const randomCard = cards[randomIndex].card_number;
        navigate(`/cards/${randomCard}`);
    }

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getCard();
        getCards();
        getCardCategories();
    }, [card_number]);

    useEffect(() => {
        document.title = `${card.name} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    }, [card])

    const matchSeries = (line) => {
        const cardCategory = card_categories?.find(category => category.name === line)
        return cardCategory?.id
    };

    const matchClass = (card_class) => {
        const cardCategory = card_categories?.find(category => category.name === card_class)
        return cardCategory?.id
    }

    return (
        <div className="white-space">
            <div className="cd-container between-space">
                <div className="cd-container-child">
                    <div className="cd-inner media-display">
                        <h1 className="hidden2 media-display media-center">{card.name}</h1>
                        <img
                            className="cd-card wide100"
                            src={card.picture_url ? card.picture_url : "https://i.imgur.com/krY25iI.png"}
                            alt={card.name}/>
                    </div>
                    <div className="none" style={{margin: "5% 0%"}}>
                        <h1 className="centered-h1">Related Cards</h1>
                        <div className="cd-inner">
                            <div className="cd-inner card-list3" style={{width: "480px"}}>
                                {relatedCards?.slice(0,6).map((relatedCard) => {
                                    return (
                                        <NavLink to={`/cards/${relatedCard.card_number}`}>
                                                <img
                                                    className="cd-related-card"
                                                    title={relatedCard.name}
                                                    src={relatedCard.picture_url ? relatedCard.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                    alt={relatedCard.name}/>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="cd-inner" style={{marginTop: "6px"}}>
                            <button
                                className="left button100 heightNorm"
                                style={{ textAlign: "center"}}
                                onClick={getRandomCard}
                            >
                                Random Card
                            </button>
                            {relatedCards.length > 6?
                                <RelatedCardModal
                                    relatedCards={relatedCards}
                                />: null
                            }
                            { account && account.roles.includes("admin")?
                                null:
                                <BackButton
                                    className="left button100 heightNorm"
                                    style={{marginLeft: "5%", textAlign: "center"}}
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className="cd-container-child">
                    <div className="cd-inner2 media-display">
                        <h1 className={card.name.length < 25 ? "none cd-title": "none cd-title2"}
                        >{card.name}</h1>
                        <div>
                            <div className="cd-info">
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Type</h4>
                                    {cardType?
                                        <NavLink to={`/cardtypes/${cardType[0]?.id}`} className="nav-link2 glow2">
                                            <h5 title={cardType[0]?.rules} style={{fontWeight: "400", margin: "18px 12px"}}
                                                >{cardType[0]?.name} *</h5>
                                        </NavLink>:
                                        <h5 title={cardType[0]?.rules} style={{fontWeight: "400", margin: "18px 12px"}}
                                        >{cardType[0]?.name} *</h5>
                                    }
                                </div>
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Class</h4>
                                    { card.card_class?
                                        <NavLink to={`/cardcategories/${matchClass(card.card_class)}`} className="nav-link2 glow2">
                                            <h5 style={{fontWeight: "400", margin: "18px 12px"}}>{card.card_class ? `${card.card_class} *` : "n/a"}</h5>
                                        </NavLink>:
                                        <h5 style={{fontWeight: "400", margin: "18px 12px"}}>{card.card_class ? card.card_class : "n/a"}</h5>
                                    }
                                </div>
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Reactions</h4>
                                    {reactions.length ? (
                                        reactions.map((reaction) => (
                                            <NavLink to={`/reactions/${reaction.id}`} className="nav-link2 glow2">
                                                <h5 title={reaction?.rules} style={{fontWeight: "400", margin: "18px 12px"}} key={reaction?.name}>
                                                    {reaction?.name} {reaction?.count} *
                                                </h5>
                                            </NavLink>
                                        ))
                                    ) : (
                                        <h5 style={{fontWeight: "400", margin: "18px 12px"}}>n/a</h5>
                                    )}
                                </div>
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Enthusiasm</h4>
                                        <h5 style={{fontWeight: "400", margin: "18px 12px"}}>{card.enthusiasm ? card.enthusiasm : "n/a"}</h5>
                                </div>
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Tags</h4>
                                    {(cardTags[0]?.tag_number !== 1000)?
                                        <>
                                            {cardTags?.map((card_tag) => {
                                                    return (
                                                        <NavLink to={`/cardtags/${card_tag.id}`} className="nav-link2 glow2">
                                                            <h5 title={card_tag.rules}
                                                                style={{fontWeight: "400", margin: "18px 12px"}}>
                                                                    {card_tag.name} *
                                                            </h5>
                                                        </NavLink>
                                                    );
                                            })}
                                        </>:
                                            <h5 style={{fontWeight: "400", margin: "18px 12px"}}>
                                                n/a
                                            </h5>}
                                </div>
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Series</h4>
                                        {card.seriesNames.map((line) =>
                                            <NavLink to={`/cardcategories/${matchSeries(line)}`} className="nav-link2 glow2">
                                                <h5 style={{fontWeight: "400", margin: "18px 12px"}}>
                                                {line} *</h5>
                                            </NavLink>)}
                                </div>
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Card Number</h4>
                                        <h5 style={{fontWeight: "400", margin: "18px 12px"}}>{card.card_number}</h5>
                                </div>
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Hero ID</h4>
                                        <h5 style={{fontWeight: "400", margin: "18px 12px"}}>{card.hero_id}</h5>
                                </div>
                                <div className={card.card_class ? card.card_class : "NoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "10px 0px 0px 12px"}}>Illustrator</h4>
                                        <h5 style={{fontWeight: "400", margin: "18px 12px"}}>{card.illustrator}</h5>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className={card.card_class ? `big${card.card_class}` : "bigNoClass"}>
                                    <h4 style={{fontWeight: "600", margin: "12px"}}>Card Effect</h4>

                                    {card.effectText.map((line) =>
                                        <h5 style={{fontWeight: "400", margin: "18px 12px"}}>
                                            {line}</h5>)}

                                    {/* <h5 style={{fontWeight: "400", margin: "18px 12px"}}>{card.effect_text}</h5> */}
                                    {card.second_effect_text && (
                                        <div className="borderBlack">

                                        {card.secondEffectText.map((line) =>
                                            <h5 style={{fontWeight: "400", margin: "18px 12px"}}>
                                                {line}</h5>)}

                                            {/* <h5 className="borderBlack"
                                                style={{fontWeight: "600", margin: "18px 10px 18px 10px"}}>{card.second_effect_text}</h5> */}
                                        </div>
                                    )}
                                    {extraEffects.length ? (
                                    <>
                                        <h4 style={{fontWeight: "600", margin: "12px"}}>Extra Effect Types</h4>
                                        <div className="borderBlack" style={{display:"flex"}}>
                                            {extraEffects.map((extra_effect) => (
                                                <NavLink to={`/extraeffects/${extra_effect.id}`} className="nav-link2 glow2">
                                                    <h5 title={extra_effect.rules}
                                                        style={{fontWeight: "400",
                                                            height: "22px",
                                                            margin: "0px 5px 20px 15px"}}>
                                                        {extra_effect.name} *</h5>
                                                </NavLink>
                                            ))}
                                        </div>
                                    </>
                                    ) : null}
                                </div>
                                { account && account.roles.includes("admin")?
                                    <div className="none"
                                        style={{marginTop: "2%", width: "100%"}}
                                        >
                                        <div style={{display: "flex", marginBottom: ".75%"}}>
                                            <CardEditModal/>
                                            <BackButton/>
                                        </div>
                                    </div>:
                                null}
                            </div>
                        </div>
                        <div>
                            <div className="hidden2 media-display" style={{margin: "5% 0%"}}>
                                <h1 className="centered-h1">Related Cards</h1>
                                <div className="cd-inner">
                                    <div className="cd-inner card-pool-fill3">
                                        {relatedCards?.slice(0,6).map((relatedCard) => {
                                            return (
                                                <NavLink to={`/cards/${relatedCard.card_number}`}>
                                                        <img
                                                            className="cd-related-card"
                                                            title={relatedCard.name}
                                                            src={relatedCard.picture_url ? relatedCard.picture_url : "https://i.imgur.com/krY25iI.png"}
                                                            alt={relatedCard.name}/>
                                                </NavLink>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="cd-inner" style={{marginTop: "3%"}}>
                                { account && account.roles.includes("admin")?
                                        <CardEditModal/>:
                                null}
                                    <button
                                        className="left button100 heightNorm"
                                        style={{ textAlign: "center"}}
                                        onClick={getRandomCard}
                                    >
                                        Random Card
                                    </button>
                                    {relatedCards.length > 6?
                                        <RelatedCardModal
                                            relatedCards={relatedCards}
                                        />: null
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardDetailPage;
