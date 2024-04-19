import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext";
import ArticleImageCreate from "./ArticleImageCreate";
import { todaysFormattedDate } from "../Helpers";


function ArticleEditPage() {

    const { account } = useContext(AuthContext)
    const { article_id } = useParams();

    const [article, setArticle] = useState({
        title: "",
        subtitle: "",
        author: "",
        story_date: todaysFormattedDate(),
        section: "",
        content: "",
        images: "",
        news: false,
        site_link: "",
    });

    const getArticle = async() =>{
        const articleResponse = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/articles/${article_id}/`);
        const article_data = await articleResponse.json();
        setArticle(article_data);

        const processedImages = []
        for (let keyName of Object.keys(article_data.images)) {
            for (let order of Object.keys(article_data.images[keyName])) {
                console.log(article_data.images[keyName][order].src)
                const image = {
                    keyName: keyName,
                    src: article_data.images[keyName][order].src??null,
                    alt_text: article_data.images[keyName][order].alt_text??null,
                    caption: article_data.images[keyName][order].caption??null,
                    order: order,
                    link: article_data.images[keyName][order].link??null,
                }
                processedImages.push(image)
            }
        }
        setImages(processedImages)
    };

    const [images, setImages] = useState([])
    const [stayHere, setStayHere] = useState(false)

    const handleArticleChange = (event) => {
        setArticle({
            ...article,
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

    const handleArticleCheck = (event) => {
        setArticle({...article, news: !article.news});
    };

    const handleStayCheck = (event) => {
        setStayHere(!stayHere);
    };

    useEffect(() => {
        getArticle();
        document.title = "Article Edit - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...article};
        data["updated"] = todaysFormattedDate()
        data["images"] = {}
        for (let image of images) {
            console.log(typeof image.keyName)
            if (data["images"][image.keyName]) {
                const articleImage = {
                    src: image.src,
                    caption: image.caption,
                    link: image.link,
                    order: image.order,
                    alt_text: image.alt_text,
                }
                data["images"][image.keyName].push(articleImage)
            } else {
                data["images"][image.keyName] = []
                const articleImage = {
                    src: image.src,
                    caption: image.caption,
                    link: image.link,
                    order: image.order,
                    alt_text: image.alt_text,
                }
                data["images"][image.keyName].push(articleImage)
            }
        }
        console.log(data)
        const articleUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/articles/${article_id}`;
        const fetchConfig = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(articleUrl, fetchConfig);
        if (response.ok) {
            const responseData = await response.json();
            const article_id = responseData.id;
            setArticle({
                title: "",
                subtitle: "",
                author: "",
                story_date: "",
                section: "",
                content: "",
                images: "",
                news: false,
                site_link: "",
            });
            setImages([])
            if (!stayHere) {navigate(`/articles/article_id`)}
            navigate(`/articles/${article_id}`)
            console.log("Success")
        } else {
            alert("Error in editing news");
        }
    }

    // if (!(account && account.roles.includes("admin"))) {
    //     setTimeout(function() {
    //         window.location.href = `${process.env.PUBLIC_URL}/`
    //     }, 3000);
    // }

    return (
        <div>
            { account && account.roles.includes("admin")?
                <div className="white-space">
                    <h1 className="margin-top-40">Article Edit</h1>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div style={{width: "50%", display: "flex", justifyContent: "center"}}>
                            <div
                                id="create-article-page">
                                <h2 className="left">Article Details</h2>
                                <h5 className="label">Title </h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Title"
                                    onChange={handleArticleChange}
                                    name="title"
                                    value={article.title}>
                                </input>
                                <br/>
                                <h5 className="label">Subtitle </h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Subtitle"
                                    onChange={handleArticleChange}
                                    name="subtitle"
                                    value={article.subtitle}>
                                </input>
                                <br/>
                                <h5 className="label">Section </h5>
                                <select
                                    className="builder-input"
                                    type="text"
                                    value={article.section}
                                    name="section"
                                    onChange={handleArticleChange}>
                                    <option value="">Section</option>
                                    <option value="guide">Guide</option>
                                    <option value="lore">Lore</option>
                                    <option value="releases">Card Releases</option>
                                    <option value="game">Game Play and Mechanics</option>
                                    <option value="design">Game Design</option>
                                    <option value="site">Site</option>
                                    <option value="social">Social Media</option>
                                    <option value="events">Events</option>
                                    <option value="simulator">Simulator</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <br/>
                                <h5 className="label">Date</h5>
                                <input
                                    className="builder-input"
                                    type="date"
                                    placeholder=" Date"
                                    max={todaysFormattedDate()}
                                    onChange={handleArticleChange}
                                    name="story_date"
                                    value={article.story_date}>
                                </input>
                                <br/>
                                <h5 className="label">Site Link</h5>
                                <input
                                    className="builder-input"
                                    type="text"
                                    placeholder=" Site Link"
                                    onChange={handleArticleChange}
                                    name="site_link"
                                    value={article.site_link}>
                                </input>
                                <br/>
                                <div className="flex builder-input">
                                    <div className="flex-full">
                                        <input
                                            style={{margin: "2px 5px 0 0", height:"10px"}}
                                            type="checkbox"
                                            onChange={handleArticleCheck}
                                            name="news"
                                            checked={article.news}
                                            >
                                        </input>
                                        <label for="news"
                                            className="bold"
                                        >
                                            News Article
                                        </label>
                                    </div>
                                    <div className="flex-full margin-left">
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
                                            Save Article
                                        </button>
                                        <button
                                            className="left"
                                            onClick={() => handleAddImage()}
                                        >
                                            Add Image
                                        </button>
                                        <button
                                            className="left"
                                            onClick={getArticle}
                                        >
                                            Reset Article
                                        </button>
                                    </div>:null
                                }
                                <br/>
                                { !account?
                                    <h6 className="error">You must be logged in to save an article</h6>:
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
                    <h2 className="label">Article Content</h2>
                    <textarea
                        className="large-article"
                        type="text"
                        placeholder=" Article Content"
                        onChange={handleArticleChange}
                        name="content"
                        value={article.content}>
                    </textarea>
                    <br/>
                    {images?.map((image, index) =>
                        <ArticleImageCreate
                            key={index}
                            image={image}
                            imagesIndex={index}
                            handleImageChange={handleImageChange}
                            content={article.content}
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

export default ArticleEditPage;
