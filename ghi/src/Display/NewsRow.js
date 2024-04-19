import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { NewsQueryContext } from "../Context/NewsQueryContext";
import { NavLink, useNavigate } from 'react-router-dom';
import ImageWithoutRightClick from "./ImageWithoutRightClick";


function NewsRow() {

    const { account } = useContext(AuthContext)
    const { newsQuery, setNewsQuery } = useContext(NewsQueryContext)
    const navigate = useNavigate()
    const [stories, setStories] = useState([]);

    const getStories = async() =>{
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/articles/`);
        const data = await response.json();

        setStories(
            data.articles.sort((a,b) => {
                let comparedArticles = new Date(b.story_date) - new Date(a.story_date)
                if (comparedArticles === 0) {
                    comparedArticles = b.id.localeCompare(a.id)
                }
                return comparedArticles
            })
        );
    };

    const formatDate = (date) => {
        const month = date.slice(5,7);
        const day = date.slice(8);
        const year = date.slice(0,4);
        return `${month}-${day}-${year}`
    }

    const goToNews = () => {
        setNewsQuery({...newsQuery, news: true})
        navigate("/articles")
    }

    const filteredStories = account && account.roles.includes("admin")?
        stories.slice(0,20):
        stories.filter(story => story.section !== "admin").slice(0,20)

    const newsColors = {
        releases: "rgba(192, 145, 17, 0.87)",
        game: "rgba(42, 168, 115, 0.70)",
        design: "rgba(124, 19, 33, 0.70)",
        site: "rgba(77, 71, 94, 0.50)",
        social: "rgba(82, 96, 194, 0.70)",
        events: "rgba(101, 56, 131, 0.70)",
        admin: "rgba(77, 71, 94, 0.50)",
        simulator: "rgba(232, 82, 230, 0.70)"
    }

    const newsBorders = {
        releases: "#f0be1c",
        game: "rgb(54, 184, 129)",
        design: "rgb(255, 0, 43)",
        site: "#4D475E",
        social: "rgb(88, 129, 253)",
        events: "rgb(104, 20, 172)",
        admin: "#4D475E",
        simulator: "rgba(232, 82, 230, 0.70)"
    }

    useEffect(() => {
        getStories();
    }, [account]);


    return(
        <div className="white-space">
            { filteredStories.length > 0 ?
                <>
                    <div className="newsRow">
                        {filteredStories.map((story, index) => {
                            return (
                                <>
                                {story.content ||(account && account.roles.includes("admin"))?
                                    <NavLink className="nav-link no-pad" to={`/articles/${story.id}`}>
                                        <div
                                            className="flex-items newsItem"
                                            style={{
                                                backgroundColor: newsColors[story.section],
                                                borderColor: newsBorders[story.section],
                                                marginTop: index === 0 ? "2px" : "10px",
                                                marginBottom: index ===  filteredStories.length -1 ? "2px" : "10px"
                                            }}
                                        >

                                            <h3 className="newsText no-wrap">{formatDate(story.story_date)}</h3>
                                            <img className="newsSection" src={`${story.section}.png`} alt={story.section}/>
                                            {/* <h4 className="newsText">{story.section}</h4> */}
                                            <h4 className="newsText">{story.title}</h4>
                                        </div>
                                    </NavLink>
                                :
                                    <div
                                        className="flex-items newsItem"
                                        style={{
                                            backgroundColor: newsColors[story.section],
                                            borderColor: newsBorders[story.section],
                                            marginTop: index === 0 ? "2px" : "10px",
                                            marginBottom: index ===  filteredStories.length -1 ? "2px" : "10px"
                                        }}
                                    >

                                        <h3 className="newsText no-wrap">{formatDate(story.story_date)}</h3>
                                        <img className="newsSection" src={`${story.section}.png`} alt={story.section}/>
                                        {/* <h4 className="newsText">{story.section}</h4> */}
                                        <h4 className="newsText">{story.title}</h4>
                                    </div>
                                }
                                </>
                            )
                        })}
                    </div>
                    <br/>
                        <button
                            style={{ width: "100%" }}
                            className="pointer"
                            onClick={goToNews}
                        >
                            Browse All News and Articles
                        </button>
                </>: null
            }
        </div>
    );
}

export default NewsRow;
