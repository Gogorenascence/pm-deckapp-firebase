import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


function FavoriteDeck(props) {
    const {
        account,
    } =  useContext(AuthContext)

    const [accountInfo, setAccountInfo] = useState([])
    const [favorites, setFavorites] = useState([])
    const {deck} = props;

    const getAccountInfo = async() => {
        if (account) {
            const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/accounts/${account.id}`);
            const accountData = await response.json();
            setAccountInfo(accountData)
            setFavorites(accountData.favorited_decks? accountData.favorited_decks: [])
        } else {
            const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/token/`, {
                credentials: "include",
            })
            const tokenData = await response.json();
            setAccountInfo(tokenData.account)
            setFavorites(tokenData.favorited_decks? tokenData.favorited_decks: [])
        }
    }

    useEffect(() => {
        getAccountInfo()
    },[account]);

    const favorite = async (event) => {
        const data = {...accountInfo}
        const favorited_decks = favorites
        if (!favorited_decks.includes(deck.id)) {
            favorited_decks.push(deck.id)
        } else {
            console.log("deck is already favorited")
        }
        data["favorited_decks"] = favorited_decks
        const url = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/accounts/${account.id}/without`
        const response = await fetch(url, {
            method: "put",
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json",
            },
        })
        if (response.ok) {
            getAccountInfo()
        }
    };

    const unfavorite = async (event) => {
        const data = {...accountInfo}
        if (favorites.includes(deck.id)) {
            const deckIndex = favorites.indexOf(deck.id)
            const favorited_decks = [...favorites]
            favorited_decks.splice(deckIndex, 1)
            data["favorited_decks"] = favorited_decks
        }
        const url = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/accounts/${account.id}/without`
        const response = await fetch(url, {
            method: "put",
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json",
            },
        })
        if (response.ok) {
            getAccountInfo()
        }
    };


    return(
        <div style={{display: "flex", flexGrow: "20", justifyContent: "end"}}>
            {favorites.includes(deck.id)?
                <img className="logo5 pointer"
                    src="https://i.imgur.com/9fuxfxy.png"
                    alt="unfavorited"
                    onClick={unfavorite}
                />
                :
                <img className="logo5 pointer"
                    src="https://i.imgur.com/cecWS0L.png"
                    alt="favorited"
                    onClick={favorite}
                    title="Favorited"
                />
            }
        </div>
    )
}

export default FavoriteDeck;
