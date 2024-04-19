import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { todaysFormattedDate } from "../Helpers";


function ArticleTemplates({
    setArticle,
    author
}) {

    const articleTemplates = {
        "Card Change": {
            "title": "Card change: [Card Name]",
            "subtitle": "",
            "author": author.username,
            "story_date": todaysFormattedDate(),
            "section": "releases",
            "content": "Change in card effects:@@]]//\nGizma]]//\nPrevious: Resolve the main effect of 1 Fighter, Aura or Move in your placed cards, then discard it.//\nNew: Resolve the main effect of 1 card in your placed cards, then discard it.//",
            "images": {},
            "news": true,
            "site_link": ""
        },
        "Card Changes": {
            "title": "Card changes m/d - m/d",
            "subtitle": "",
            "author": author.username,
            "story_date": todaysFormattedDate(),
            "section": "releases",
            "content": "Changes in card effects:@@]]//\nFeza of the Black Winds]]//\nPrevious: <Trigger> When a card in foe's String is resolving, the effect text of that foe's Fighter or Aura becomes the following: ● Discard up to 1 card from your hand; 1 foe whose String has a Magic card(s) discards 1 card in their String.//\nNew: <Trigger> When a card in foe's String is resolving, the effect text of that foe's Fighter or Aura becomes the following: ● Discard 1 card from your hand, then 1 foe whose String has a Magic card(s) discards 1 card in their String.//\nFinal Attack: One Ton Wingbeat!!!]]//\n\"<Trigger> If this card is discarded from your String, deal 2 damage to a foe.\" added.//\nSeries changes:@@]]//\n\"Gimza\", \"Master of Shadows!\", \"Shadow Strike!!\", \"Karmic Crash!!!\", \"Old Collar\" and \"Shadow Clone\" have been added to the Quest series.",
            "images": {},
            "news": true,
            "site_link": ""
        },
        "New Card": {
            "title": "New card: [Card Name]",
            "subtitle": "",
            "author": author.username,
            "story_date": todaysFormattedDate(),
            "section": "releases",
            "content": "Chakras Aligned@@]]//\nHero ID and Card Number:]]//GEN 1127//\nType:]]//Event//\nTag:]]//Max 1//\nSeries]]://Mystic, Quest and Relaxation//\nEffect]]:// Return 8 Mystic cards or pluck with different names from their respective discard piles to the bottom of your Main deck/Pluck deck in any order; all Mystic cards in your play gain damage plus 1 this round (those cards deal 1 additional damage at the end of their resolutions).",
            "images": {},
            "news": true,
            "site_link": ""
        },
        "New Cards": {
            "title": "New cards m/d - m/d",
            "subtitle": "",
            "author": author.username,
            "story_date": todaysFormattedDate(),
            "section": "releases",
            "content": "Chakras Aligned@@]]//\nHero ID and Card Number:]]//GEN 1127//\nType:]]//Event//\nTag:]]//Max 1//\nSeries]]://Mystic, Quest and Relaxation//\nEffect]]:// Return 8 Mystic cards or pluck with different names from their respective discard piles to the bottom of your Main deck/Pluck deck in any order; all Mystic cards in your play gain damage plus 1 this round (those cards deal 1 additional damage at the end of their resolutions).//\n\nLucky Punch@@]]//\nHero ID and Card Number:]]//GEN 1128//\nType:]]//Event//\nTag:]]//Max 1//\nSeries]]://Brawler and Magic//\nEffect]]:// Discard 7 Pluck in your ownership; deal 5 piercing damage to a foe and ignore the reaction(s) of defending Fighter(s). Trigger effects can not be used in response to this Event.//",
            "images": {},
            "news": true,
            "site_link": ""
        },
        "New Key Term": {
            "title": "Key term [term name] introduced",
            "subtitle": "",
            "author": author.username,
            "story_date": todaysFormattedDate(),
            "section": "game",
            "content": "The key term Start Phase has been introduced.//All text referring to the start of the round will be replaced with \"During the Start Phase\".",
            "images": {},
            "news": true,
            "site_link": "",
        },
        "New Key Terms": {
            "title": "New key terms introduced m/d - m/d",
            "subtitle": "",
            "author": author.username,
            "story_date": todaysFormattedDate(),
            "section": "game",
            "content": "The key terms Focus plus X, Focus minus X, Enthusiasm plus X and Enthusiasm minus X have been introduced.//\nAll text \"Add X to your Focus\" will be replaced by \"Focus plus X\".//\nAll text \"Lower the Focus of X foes by Y\" will be replaced by and \"X foes gain Focus minus Y\".//\nAll text \"Add X to your Enthusiasm\" will be replaced by \"Enthusiasm plus X\".//\nAll text \"Lower the Focus of X foes by Y\" will be replaced by and \"X foes gain Enthusiasm minus Y\".//",
            "images": {},
            "news": true,
            "site_link": "",
        }
    }

    const templateTypes = [
        "Card Change",
        "Card Changes",
        "New Card",
        "New Cards",
        "New Key Term",
        "New Key Terms"
    ]

    const handleTemplate = (templateType) => {
        if (templateType) {
            setArticle(articleTemplates[templateType])
        }
    };

    const handleDropDown = (event) => {
        const selectedTemplate = event.target.value;
        handleTemplate(selectedTemplate)
    }

    return (
        <div className="cd-measure margin-auto">
            <h2 className="label">Article Samples</h2>
            <select
                className="builder-input"
                type="text"
                onChange={handleDropDown}>
                <option value="">
                    Select Sample
                </option>
                {templateTypes.map((templateType) => (
                    <option key={templateType} value={templateType}>
                        {templateType}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ArticleTemplates;
