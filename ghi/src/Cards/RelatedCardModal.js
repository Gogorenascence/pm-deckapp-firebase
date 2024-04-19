import { useParams, NavLink, useNavigate} from 'react-router-dom';
import React, { useState, useEffect, useRef, useContext } from 'react'
import { AppContext } from '../Context/AppContext';


function RelatedCardModal() {

    const {card_number} = useParams();
    const {isDark} = useContext(AppContext)
    const navigate = useNavigate()
    const content = useRef(null)

    const [show, setShow] = useState(false);

    useOutsideAlerter(content)

    const handleClose = async() => {
        setShow(false)
        document.body.style.overflow = 'auto';
    };
    const handleShow = async() => {
        setShow(true)
        document.body.style.overflow = 'hidden';
    };

    const [relatedCards, setRelatedCards] = useState([]);

    const getRelatedCards = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/cards/${card_number}/related_cards/`);
        const relatedData = await response.json();

        setRelatedCards(relatedData.cards.sort((a,b) => a.card_number - b.card_number));
    };

    useEffect(() => {
        getRelatedCards();
    // eslint-disable-next-line
    }, [card_number]);


    const selectCard = async(card) =>{
        const cards_number = card.card_number
        navigate(`/cards/${cards_number}`);
        handleClose()
    }

    function useOutsideAlerter(ref) {
        useEffect(() => {
          // Function for click event
            function handleOutsideClick(event) {
                if (ref.current && !ref.current.contains(event.target)
                    && !event.target.closest(".left.button100")) {
                    handleClose();
                }
            }
          // Adding click event listener
            document.addEventListener("click", handleOutsideClick);
                return () => document.removeEventListener("click", handleOutsideClick);
        }, [ref]);
    }

    return (

        <div>
            <button
                className="left button100 heightNorm"
                style={{ textAlign: "center"}}
                    onClick={handleShow}>
                    Show all Cards
            </button>
            {show?
                <div className={!isDark? "large-modal topbar":"large-modal-dark topbar"}>
                    <div className="outScrollable" ref={content}>
                        <h1 className="centered-h1">Related Cards</h1>
                        <div>
                            <div className="cd-inner2 card-pool-fill">
                                {relatedCards.map((relatedCard) => {
                                    return (
                                            <img
                                                className="cd-related-modal-card pointer"
                                                onClick={() => selectCard(relatedCard)}
                                                title={relatedCard.name}
                                                src={relatedCard.picture_url ? relatedCard.picture_url : "logo4p.png"}
                                                alt={relatedCard.name}/>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="cd-inner margin-top-20">
                            <button onClick={handleClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>:null
            }
        </div>
    );
}


export default RelatedCardModal;
