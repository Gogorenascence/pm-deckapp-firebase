import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import { Card } from "react-bootstrap";

function HowToPage() {

    const { how_to_id } = useParams()
    const { account } = useContext(AuthContext)

    const [howTo, setHowTo] = useState({
        title: "",
        game_format: "",
        skill_level: "",
        content: "",
        how_to_number: 0,
        images: "",
        updated: "",
    });

    const [prevHowTo, setPrevHowTo] = useState("")
    const [nextHowTo, setNextHowTo] = useState("")

    const [images, setImages] = useState([])

    const getHowTo = async() =>{
        const howTosResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/how_tos/`);
        const howTosData = await howTosResponse.json();
        const howToData = howTosData.find(howToItem => howToItem.id === how_to_id)

        const sortedHowTos = howTosData.sort((a,b) => a.how_to_number - b.how_to_number)
        const howToIndexes = sortedHowTos.map((howToItem) => howToItem.id)
        const prevHowToItem = sortedHowTos[howToIndexes.indexOf(how_to_id) - 1] ?? ""
        const nextHowToItem = sortedHowTos[howToIndexes.indexOf(how_to_id) + 1] ?? ""
        setHowTo(howToData);
        setPrevHowTo(prevHowToItem)
        setNextHowTo(nextHowToItem)

        console.log(prevHowToItem, howToData, nextHowToItem)
        const processedImages = []
        for (let keyName of Object.keys(howToData.images)) {
            for (let order of Object.keys(howToData.images[keyName])) {
                const image = {
                    keyName: keyName,
                    src: howToData.images[keyName][order].src??null,
                    alt_text: howToData.images[keyName][order].alt_text??null,
                    caption: howToData.images[keyName][order].caption??null,
                    order: order,
                    link: howToData.images[keyName][order].link??null,
                }
                processedImages.push(image)
            }
        }
        setImages(processedImages)
    };

    useEffect(() => {
        // window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getHowTo();
    // eslint-disable-next-line
    },[how_to_id]);

    useEffect(() => {
        document.title = `${howTo.title} - PM CardBase`
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[howTo]);

    const processedText = (text) => {
        return text?.split("//");
    };

    const processedBoldLine = (line) => {
        return line?.replace("]]", "");
    };

    const processedBigLine = (line) => {
        return line?.replace("@@", "");
    };

    const formatDate = (date) => {
        const month = date.slice(5,7);
        const day = date.slice(8);
        const year = date.slice(0,4);
        return `${month}-${day}-${year}`
    }

    const getLink = (link) => {
        let newLink = ""
        link.includes("https://www.jothplaymaker.com/")?
            newLink = link.replace("https://www.jothplaymaker.com", `${process.env.PUBLIC_URL}`):
            newLink = link
        return newLink
    }

    const howToColors = {
        beginner: "rgba(42, 168, 115, 0.70)",
        advanced: "rgba(192, 145, 17, 0.87)",
        expert: "rgba(124, 19, 33, 0.70)",
    }

    const howToBorders = {
        beginner: "rgb(54, 184, 129)",
        advanced: "#f0be1c",
        expert: "rgb(255, 0, 43)",
    }

    const howToSkills = {
        beginner: "https://i.imgur.com/ziEZp16.png",
        advanced: "https://i.imgur.com/SJV0t8k.png",
        expert: "https://i.imgur.com/SgtaTVa.png",
    }


    return (
        <div className="white-space">
            <Card className="text-white text-center card-list-card3" style={{margin: "2% 0%" }}>
                <div className="card-image-wrapper">
                    <div className="card-image-clip2">
                        <Card.Img
                            src="https://i.imgur.com/8wqd1sD.png"
                            alt={images[0]? images[0].alt_text : "howTo's first image"}
                            className="card-image2"
                            variant="bottom"/>
                    </div>
                </div>
                <Card.ImgOverlay className="blackfooter2 mt-auto">
                    <div className="flex">
                        <h1 className="left margin-top-10 ellipsis">{howTo.title}</h1>
                        {/* {account?
                            <FavoriteDeck deck={deck}/>:null
                        } */}
                        { account && account.roles.includes("admin")?
                            <NavLink className="nav-link" to={`/rulebooks/${howTo.id}/edit`}>
                                <h5>[Edit]</h5>
                            </NavLink>
                        :null}
                    </div>
                    <div className=" flex wide100-3">
                        <h4
                            className="left justify-content-end"
                            style={{margin: '13px 0px 5px 5px', fontWeight: "600", textAlign: "left"}}
                        >
                            {howTo.game_format} &nbsp;
                        </h4>
                        <img className="newsSection" src={`/${howTo.skill_level}.png`} alt={howTo.skill_level}/>
                    </div>
                    <div className="flex">
                        { howTo.updated ?
                            <>
                                <img className="logo3" src="https://i.imgur.com/QLa1ciW.png" alt="updated on"/>
                                <h6
                                className="left justify-content-end"
                                    style={{margin: '5px 0px 5px 5px', fontWeight: "600", textAlign: "left"}}
                                >
                                    {formatDate(howTo.updated)} &nbsp; &nbsp;
                                </h6>
                            </>:null
                        }
                    </div>
                </Card.ImgOverlay>
            </Card>
            {/* <h1>{howTo.subtitle}</h1> */}
            <div className="newsSection2">
                {
                    processedText(howTo.content)?.map((line, index) => {
                        return (
                            <>
                                {line.includes("]]")?
                                    <p className={`${line.includes("@@")? "newsText4" :"newsText5"} bolder margin-bottom-0 margin-top-20`} key={index}>
                                        { line.includes("@@")? processedBigLine(processedBoldLine(line)): processedBoldLine(line)}
                                    </p>
                                :
                                    <p className="newsText2 margin-bottom-0">{line}</p>
                                }
                                <div className={howTo.images[index.toString()]?.length > 1? "newsImageContainer":"newsImageContainer2"}>
                                    {howTo.images[index.toString()] ?
                                        howTo.images[index.toString()].sort((a,b) => a.order - b.order).map(image => {
                                            return (
                                                image.link?
                                                <a href={getLink(image.link)}>
                                                    <div className="flex-items-down-10-10"
                                                    >
                                                        <img className="newsImage"
                                                            src={image.src}
                                                            title={image.alt_text}
                                                            alt={image.alt_text}
                                                        />
                                                        {image.caption? <p className="newsText3">{image.caption}</p>: null}
                                                    </div>
                                                </a>
                                                :
                                                <div className="flex-items-down-10-10">
                                                    <img className="newsImage"
                                                        src={image.src}
                                                        title={image.alt_text}
                                                        alt={image.alt_text}
                                                    />

                                                    {image.caption? <p className="newsText3">{image.caption}</p>: null}
                                                </div>
                                            )}
                                        ):null
                                    }
                                </div>
                            </>
                        )
                    })
                }
                <div className="margin-top-30">
                    {prevHowTo && prevHowTo.game_format === howTo.game_format?
                        // <NavLink className="nav-link" to={`/rulebooks/${prevHowTo.id}`}>
                        //     <h1 className="ellipsis">Prev: {prevHowTo.title}</h1>
                        // </NavLink>:null
                        <NavLink className="nav-link no-pad" to={`/rulebooks/${prevHowTo.id}`}>
                            <div
                                className="flex-items newsItem"
                                style={{
                                    backgroundColor: howToColors[prevHowTo.skill_level],
                                    borderColor: howToBorders[prevHowTo.skill_level],
                                    // marginTop: "40px",
                                    // marginBottom: "-15px"
                                }}
                            >
                                <h3 className="newsText no-wrap">Prev: </h3>
                                <img className="skill_level" src={howToSkills[prevHowTo.skill_level]} alt={prevHowTo.skill_level}/>
                                <h4 className="newsText">{prevHowTo.title}</h4>
                            </div>
                        </NavLink>:null
                    }
                    {/* <br/> */}
                    {nextHowTo && nextHowTo.game_format === howTo.game_format?
                        // <NavLink className="nav-link" to={`/rulebooks/${nextHowTo.id}`}>
                        //     <h1 className="ellipsis">Next: {nextHowTo.title}</h1>
                        // </NavLink>:null
                        <NavLink className="nav-link no-pad" to={`/rulebooks/${nextHowTo.id}`}>
                            <div
                                className="flex-items newsItem"
                                style={{
                                    backgroundColor: howToColors[nextHowTo.skill_level],
                                    borderColor: howToBorders[nextHowTo.skill_level],
                                    // marginTop: "0px",
                                    // marginBottom: "10px"
                                }}
                            >
                                <h3 className="newsText no-wrap">Next: </h3>
                                <img className="skill_level" src={howToSkills[nextHowTo.skill_level]} alt={nextHowTo.skill_level}/>
                                {/* <h4 className="newsText">{story.section}</h4> */}
                                <h4 className="newsText">{nextHowTo.title}</h4>
                            </div>
                        </NavLink>:null
                    }
                </div>
                <NavLink className="nav-link no-pad" to={"/rulebooks"} style={{ marginTop: "25px" }}>
                    <button
                        style={{ width: "100%" }}>
                        Back to Rulebooks
                    </button>
                </NavLink>
            </div>
        </div>
    );
}

export default HowToPage;
