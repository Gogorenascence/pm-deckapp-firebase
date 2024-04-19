import React, { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';


function PopUp({
action,
message,
setPopUpAction,
}) {

    document.body.style.overflow = 'hidden';

    const {isDark} = useContext(AppContext)
    const content = useRef(null)

    useOutsideAlerter(content)

    function useOutsideAlerter(ref) {
        useEffect(() => {
          // Function for click event
            function handleOutsideClick(event) {
                if (ref.current && !ref.current.contains(event.target)
                    && !event.target.closest(".red")
                    && !event.target.closest(".left")) {
                    handleClose();
                }
            }
          // Adding click event listener
            document.addEventListener("click", handleOutsideClick);
                return () => document.removeEventListener("click", handleOutsideClick);
        }, [ref]);
    }

    const handleConfirm = (event) => {
        action(event)
        handleClose()
    }

    const handleClose = () => {
        setPopUpAction({
            action: "",
            message: "",
            show: false
        })
        document.body.style.overflow = 'auto';
    };


    return(
        <>
            <div className={!isDark? "small-modal" :"small-modal-dark"}
                ref={content}>
                <p>{message}</p>
                {action && action !== "loading"?<>
                    <button className="back-button" onClick={handleConfirm}>Yes</button>
                    <button className="back-button" onClick={handleClose}>No</button>
                </>:null}
                {action === "loading"?
                    <div className="loading-spinner"></div>:null
                }
            </div>
            <div className="blackSpace"></div>
        </>
    )
}

export default PopUp
