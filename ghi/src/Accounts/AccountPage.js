import {
    Card,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { DeckQueryContext } from "../Context/DeckQueryContext";
import { AuthContext } from "../Context/AuthContext";
import AccountDecks from "./AccountDecks";
import AccountFavoriteDecks from "./AccountFavoriteDecks";
import ImageUpload from "./ImageUpload";

function AccountPage() {
    const {
        account,
        users,
        getAccountData,
    } = useContext(AuthContext)

    const [option, setOption] = useState("profile")
    const navigate = useNavigate()

        useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getAccountData();
        document.title = "Account Info - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    }, []);

    const handleOption = (item) => {
        setOption(item);
    };

    if (!account) {
        setTimeout(function() {
            window.location.href = `${process.env.PUBLIC_URL}/`
        }, 3000);
    }

    return (
        <div>
            {account?
                <div className="white-space">
                    <div className="account-split">
                        <div className="account-info-container">
                            <h1 className="left-h1">Account Page</h1>
                            <h4 className="left">Welcome back, {account.username}!</h4>

                            <div className={option === "profile"? "bigStaunch3 selected2 pointer glow2" : "bigStaunch3 pointer glow2 half"}
                                onClick={() => handleOption("profile")}
                            >
                                <h4 style={{fontWeight: "600", margin: "12px"}}>Profile</h4>
                            </div>
                            <div className={option === "security"? "bigPower3 selected2 pointer glow2" : "bigPower3 pointer glow2 half"}
                                onClick={() => handleOption("security")}
                            >
                                <h4 style={{fontWeight: "600", margin: "12px"}}>Security</h4>
                            </div>
                            <div className={option === "myDecks"? "bigUnity3 selected2 pointer glow2" : "bigUnity3 pointer glow2 half"}
                                onClick={() => handleOption("myDecks")}
                            >
                                <h4 style={{fontWeight: "600", margin: "12px"}}>My Uploaded Decks</h4>
                            </div>
                            <div className={option === "favoriteDecks"? "bigCanny3 selected2 pointer glow2" : "bigCanny3 pointer glow2 half"}
                                onClick={() => handleOption("favoriteDecks")}
                            >
                                <h4 style={{fontWeight: "600", margin: "12px"}}>My Favorited Decks</h4>
                            </div>
                            <div className={option === "collection"? "bigNoClass3 selected2 pointer glow2" : "bigNoClass3 pointer glow2 half"}
                                onClick={() => handleOption("collection")}
                            >
                                <h4 style={{fontWeight: "600", margin: "12px"}}>My Collection</h4>
                            </div>
                            <div className={option === "wishList"? "bigFaith selected2 pointer glow2" : "bigFaith pointer glow2 half"}
                                onClick={() => handleOption("wishList")}
                            >
                                <h4 style={{fontWeight: "600", margin: "12px"}}>My Wishlist</h4>
                            </div>
                        </div>
                        <div className="account-options-container">
                            {/* <ImageUpload/> */}
                            <AccountDecks option={option}/>
                            <AccountFavoriteDecks option={option}/>
                        </div>
                    </div>
                </div>:
                <div className="textwindow">
                    <h1 className="undercontext">This Feature Is For Users Only</h1>
                    <h3 className="undercontext">Redirecting in 3 Seconds</h3>
                </div>
            }
        </div>
    );
}

export default AccountPage;
