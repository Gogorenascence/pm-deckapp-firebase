import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import ArticleImageCreate from "../../Articles/ArticleImageCreate";



function HowToCreatePage() {

    const { account } = useContext(AuthContext)

    const [howTo, setHowTo ] = useState({
        title: "",
        game_format: "",
        skill_level: "",
        content: "",
        how_to_number: 0,
        images: "",
    });

    const [images, setImages] = useState([])
    const [stayHere, setStayHere] = useState(false)

    const handleHowToChange = (event) => {
        console.log(howTo)
        setHowTo({
            ...howTo,
            [event.target.name]: event.target.value})
    }

    const handleImageChange = (imagesIndex, updatedImage) => {
        setImages((prevImages) => {
            const newImages = [...prevImages]
            newImages[imagesIndex] = updatedImage
            return newImages
        })
    }

    const handleAddImage = () => {
        const newImages = [...images]
        newImages.push({})
        setImages(newImages)
    }

    const handleRemoveImage = (index) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
    }

    const handleStayCheck = (event) => {
        setStayHere(!stayHere);
    };

    useEffect(() => {
        document.title = "Rulebook Create - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...howTo};
        data["images"] = {}
        for (let image of images) {
            console.log(typeof image.keyName)
            if (data["images"][image.keyName]) {
                const howToImage = {
                    src: image.src,
                    caption: image.caption,
                    link: image.link,
                    order: image.order,
                    alt_text: image.alt_text,
                }
                data["images"][image.keyName].push(howToImage)
            } else {
                data["images"][image.keyName] = []
                const howToImage = {
                    src: image.src,
                    caption: image.caption,
                    link: image.link,
                    order: image.order,
                    alt_text: image.alt_text,
                }
                data["images"][image.keyName].push(howToImage)
            }
        }
        console.log(data)
        const howToUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/how_tos/`;
        const fetchConfig = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(howToUrl, fetchConfig);
        if (response.ok) {
            const responseData = await response.json();
            const how_to_id = responseData.id;
            setHowTo({
                title: "",
                game_format: "",
                skill_level: "",
                content: "",
                how_to_number: 0,
                images: "",
            });
            setImages([])
            if (!stayHere) {navigate(`/rulebooks/${how_to_id}`)}
            console.log("Success")
        } else {
            alert("Error in creating rulebook");
        }
    }

    if (!(account && account.roles.includes("admin"))) {
        setTimeout(function() {
            window.location.href = `${process.env.PUBLIC_URL}/`
        }, 3000);
    }

    return (
        <div>
            { account && account.roles.includes("admin")?
                <div className="white-space">
                    <h1 className="margin-top-40">Rulebook Create</h1>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div style={{width: "50%", display: "flex", justifyContent: "center"}}>
                            <div
                                id="create-howTo-page">
                                <h2 className="left">Rulebook Details</h2>
                                <h5 className="label">Title </h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Title"
                                    onChange={handleHowToChange}
                                    name="title"
                                    value={howTo.title}>
                                </input>
                                <br/>
                                <h5 className="label">Rulebook Number </h5>
                                <input
                                    className="builder-input"
                                    type="number"
                                    placeholder=" Rulebook Number"
                                    onChange={handleHowToChange}
                                    name="how_to_number"
                                    value={howTo.how_to_number}>
                                </input>
                                <br/>
                                <h5 className="label">Game Format </h5>
                                <select
                                    className="builder-input"
                                    type="text"
                                    value={howTo.game_format}
                                    name="game_format"
                                    onChange={handleHowToChange}>
                                    <option value="">Game Format</option>
                                    <option value="Standard">Standard</option>
                                </select>
                                <br/>
                                <h5 className="label">Skill Level </h5>
                                <select
                                    className="builder-input"
                                    type="text"
                                    value={howTo.skill_level}
                                    name="skill_level"
                                    onChange={handleHowToChange}>
                                    <option value="">Skill Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                                <br/>
                                <div className="flex builder-input">
                                    <div className="flex-full">
                                        <input
                                            style={{margin: "2px 5px 0 0", height:"10px"}}
                                            id="stayHere"
                                            type="checkbox"
                                            onChange={handleStayCheck}
                                            name="stayHere"
                                            checked={stayHere}
                                            >
                                        </input>
                                        <label for="stayHere"
                                            className="bold"
                                        >
                                            Keep me here
                                        </label>
                                    </div>
                                </div>
                                {account?
                                    <div className="flex-items">
                                        <button
                                            className="left"
                                            onClick={handleSubmit}
                                        >
                                            Create Rulebook
                                        </button>
                                        <button
                                            className="left"
                                            onClick={() => handleAddImage()}
                                        >
                                            Add Image
                                        </button>
                                    </div>:null
                                }
                                <br/>
                                { !account?
                                    <h6 className="error">You must be logged in to create a Rulebook</h6>:
                                null
                                }
                                <div className="margin-left-13">
                                    <p>Add "//" to make a new line</p>
                                    <p>Add "]]" to make a line bold</p>
                                    <p className="margin-bottom-0">Add "@@" to make a line larger</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <h2 className="label">Rulebook Content</h2>
                    <textarea
                        className="large-article"
                        type="text"
                        placeholder=" Rulebook Content"
                        onChange={handleHowToChange}
                        name="content"
                        value={howTo.content}>
                    </textarea>
                    <br/>
                    {images?.map((image, index) =>
                        <ArticleImageCreate
                            key={index}
                            image={image}
                            imagesIndex={index}
                            handleImageChange={handleImageChange}
                            content={howTo.content}
                            handleRemoveImage={handleRemoveImage}
                        />
                    )}
                </div>:
                <div className="textwindow">
                    <h1 className="undercontext">This Feature Is For Admins Only</h1>
                    <h3 className="undercontext">Redirecting in 3 Seconds</h3>
                </div>
            }
        </div>
    );
}

export default HowToCreatePage;
