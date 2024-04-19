import {
    Card,
} from "react-bootstrap";
import { Link } from 'react-router-dom';

function TopRow() {
  return (
    <div className="white-space">
      <div className="cards-page-card-list5 top-row-card-list2">
          <div>
            <Link to="/deckbuilder">
              <Card className=" text-white text-center card-list-card3 glow3 top-row">
                <div className="media-card-image-wrapper2">
                  <div className="media-card-image-clip2">
                    <Card.Img className="media-card-image2" src="1g303Bone Whisper4.png" alt="Card image" variant="bottom"/>
                  </div>
                </div>
                <Card.ImgOverlay className="blackfooter mt-auto zindex-0">
                  <Card.Title className="card-img-overlay d-flex flex-column justify-content-end">Deck Builder</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </Link>
          </div>
          <div>
            <Link to="/decks">
              <Card className=" text-white text-center card-list-card3 glow3 top-row">
                <div className="media-card-image-wrapper2">
                  <div className="media-card-image-clip2">
                    <Card.Img className="media-card-image2" src="1b109Jet and Climber2.png" alt="Card image" variant="bottom"/>
                  </div>
                </div>
                <Card.ImgOverlay className="blackfooter mt-auto zindex-0">
                  <Card.Title className="card-img-overlay d-flex flex-column justify-content-end">Decks</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </Link>
          </div>
          <div>
            <Link to="/cards">
              <Card className=" text-white text-center card-list-card3 glow3 top-row">
                <div className="media-card-image-wrapper2">
                  <div className="media-card-image-clip2">
                    <Card.Img className="media-card-image2" src="mv2.png"alt="Card image" variant="bottom"/>
                  </div>
                </div>
                <Card.ImgOverlay className="blackfooter mt-auto zindex-0">
                  <Card.Title className="card-img-overlay d-flex flex-column justify-content-end">Cards</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </Link>
          </div>
          <div>
            <Link to="/gameplay">
              <Card className=" text-white text-center card-list-card3 glow3 top-row">
                <div className="media-card-image-wrapper2">
                  <div className="media-card-image-clip2">
                    <Card.Img className="media-card-image2" src="gcb17.png" alt="Card image" variant="bottom"/>
                  </div>
                </div>
                <Card.ImgOverlay className="blackfooter mt-auto zindex-0">
                  <Card.Title className="card-img-overlay d-flex flex-column justify-content-end">Game Play</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </Link>
          </div>
          <div>
            <Link to="/articles">
              <Card className=" text-white text-center card-list-card3 glow3 top-row">
                <div className="media-card-image-wrapper2">
                  <div className="media-card-image-clip2">
                    <Card.Img className="media-card-image2" src="gcb20.png" alt="Card image" variant="bottom"/>
                  </div>
                </div>
                <Card.ImgOverlay className="blackfooter mt-auto zindex-0">
                  <Card.Title className="card-img-overlay d-flex flex-column justify-content-end">Articles</Card.Title>
                </Card.ImgOverlay>
              </Card>
            </Link>
          </div>
      </div>
    </div>
  );
}

export default TopRow;
