import {
    Card,
} from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { NavLink } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext";
import FavoriteDeck from "../Accounts/FavoriteDeck";


function SimulatorRow() {
    return(
        <div className="white-space">
            <NavLink className="sim-row-link glow3" to="/simulator">
                <div className="sim-back-wrapper">
                    <div className="sim-back flex-full">
                        <h1 className="navlink sim-row-text">Simulator</h1>
                    </div>
                </div>
            </NavLink>
        </div>
    );
}

export default SimulatorRow;

    //          <div className="margin-top-40 margin-bottom-50">
    //         <NavLink className="nav-link" to="/simulator">
    //         <div className="card-image-wrapper3 flex-full">
    //             <h1 className="navlink hugeFont">Simulator</h1>
    //             <div className="card-image-clip4">
    //                  <img
    //                     src="main_back.png"
    //                     alt="Simulator"
    //                 className="card-image2"/>
    //             </div>
    //         </div>
    //          <Card.ImgOverlay className="blackfooter2 mt-auto flex-full">
    //         </Card.ImgOverlay>
    //     </NavLink>
    // </div>
