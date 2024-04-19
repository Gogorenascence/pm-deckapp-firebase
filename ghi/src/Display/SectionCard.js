import React from "react";
import { Card } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

function SectionCard({link, title, imageSRC}) {

    return (
        <div>
            <NavLink to={link}>
                <Card className="text-white text-center card-list-card3 glow">
                    <div className="card-image-wrapper media-card-image-wrapper">
                        <div className="card-image-clip">
                            <Card.Img
                                src={imageSRC}
                                alt={title}
                                className="card-image2"/>
                        </div>
                    </div>
                    <Card.ImgOverlay className="blackfooter2 mt-auto">
                        <div className="flex">
                            <h1 className="left cd-container-child media-margin-top-10">{title}</h1>
                        </div>
                    </Card.ImgOverlay>
                </Card>
            </NavLink>
        </div>
    )
}

export default SectionCard
