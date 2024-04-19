import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext.js";


function StoryCreate() {

    const maxDate = new Date().toISOString().split("T")[0];
    const [story, setStory ] = useState({
        section: "",
        headline: "",
        content: "",
        account: "",
        story_date: maxDate,
        site_link: "",
    });

    const { account } = useContext(AuthContext)
    const [stayHere, setStayHere] = useState(false)

    // const [stories, setStories ] = useState([]);

    // const getStories = async() =>{
    //     const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/stories/`);
    //     const data = await response.json();
    //     const sortedData = [...data].sort((a,b) => a.name.localeCompare(b.name));
    //     setStories(sortedData);
    // };


    useEffect(() => {
        window.scroll(0, 0);
        // getStories();
        document.body.style.overflow = 'auto';
        document.title = "News Create - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    const handleChange = (event) => {
        setStory({ ...story, [event.target.name]: event.target.value });
        console.log(story)
    };

    const handleCheck = (event) => {
        setStayHere(!stayHere);
    };

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...story};
        data["account"] = account.id
        console.log(data)
        const storyUrl = `${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/stories/`;
        const fetchConfig = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(storyUrl, fetchConfig);
        if (response.ok) {
            setStory({
                section: "",
                headline: "",
                content: "",
                account: "",
                story_date: "",
                site_link: "",
            });
            if (!stayHere) {navigate(`/news`)}
            console.log("Success")
        } else {
            alert("Error in creating news");
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
                    <h1 className="margin-top-40">News Create</h1>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{width: "50%", display: "flex", justifyContent: "center"}}>
                                <div>
                                    <h2 className="left">News Details</h2>
                                    <h5 className="label">Headline</h5>
                                    <input
                                        className="builder-input"
                                        type="text"
                                        placeholder=" Headline"
                                        onChange={handleChange}
                                        name="headline"
                                        value={story.headline}>
                                    </input>
                                    <br/>
                                    <h5 className="label">Section</h5>
                                    <select
                                        className="builder-input"
                                        type="text"
                                        placeholder=" Section"
                                        name="section"
                                        value={story.section}
                                        onChange={handleChange}>
                                        <option value="">Section</option>
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
                                        max={maxDate}
                                        onChange={handleChange}
                                        name="story_date"
                                        value={story.story_date}>
                                    </input>
                                    <br/>
                                    <h5 className="label">Image</h5>
                                    <input
                                        className="builder-input"
                                        type="text"
                                        placeholder=" Image"
                                        onChange={handleChange}
                                        name="image"
                                        value={story.image}>
                                    </input>
                                    <br/>
                                    <h5 className="label">Site Link</h5>
                                    <input
                                        className="builder-input"
                                        type="text"
                                        placeholder=" Site Link"
                                        onChange={handleChange}
                                        name="site_link"
                                        value={story.site_link}>
                                    </input>
                                    <br/>
                                    <h5 className="label">Content</h5>
                                    <textarea
                                        className="builder-text"
                                        type="text"
                                        placeholder=" Content"
                                        onChange={handleChange}
                                        name="content"
                                        value={story.content}>
                                    </textarea>
                                    <br/>

                                    <input
                                        style={{margin: "20px 5px 9px 5px", height:"10px"}}
                                        id="stayHere"
                                        type="checkbox"
                                        onChange={handleCheck}
                                        name="stayHere"
                                        checked={stayHere}>
                                    </input>
                                    <label for="stayHere"
                                        className="bold"
                                    >
                                        Keep me here
                                    </label>

                                    <br/>
                                    {account?
                                        <button
                                            className="left"
                                            onClick={handleSubmit}
                                        >
                                            Create Story
                                        </button>:null
                                    }
                                    <br/>
                                    { !account?
                                        <h6 className="error">You must be logged in to create a story</h6>:
                                    null
                                    }
                                </div>
                            </div>
                        </div>
                </div>:
                <div className="textwindow">
                    <h1 className="undercontext">This Feature Is For Admins Only</h1>
                    <h3 className="undercontext">Redirecting in 3 Seconds</h3>
                </div>
            }
        </div>
    );
}

export default StoryCreate;
