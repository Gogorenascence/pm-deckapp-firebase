import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import { HowToQueryContext } from "../../Context/HowToQueryContext";


function HowTosPage() {

    const { account } = useContext(AuthContext)

    const {
        howToQuery,
        setHowToQuery,
        howToSortState,
        setHowToSortState,
        handleResetHowToQuery,
    } = useContext(HowToQueryContext)
    const [howTos, setHowTos] = useState([]);

    const [loading, setLoading] = useState(false)

    const getHowTos = async() =>{
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_FASTAPI_SERVICE_API_HOST}/api/how_tos/`);
        const data = await response.json();

        console.log(data[1])

        setLoading(false)
        setHowTos(data.sort((a,b) => a.how_to_number - b.how_to_number))
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

    useEffect(() => {
        window.scroll(0, 0);
        document.body.style.overflow = 'auto';
        getHowTos();
        document.title = "Rulebooks - PM CardBase"
        return () => {
            document.title = "PlayMaker CardBase"
        };
    // eslint-disable-next-line
    },[]);

    const howToSortMethods = {
        none: {method: (a,b) => a.how_to_number - b.how_to_number},
        newest: {method: (a,b) => b.id.localeCompare(a.id)},
        oldest: {method: (a,b) => a.id.localeCompare(b.id)},
    };

    const handleHowToQuery = (event) => {
        setHowToQuery({ ...howToQuery, [event.target.name]: event.target.value });
    };

    const handleHowToSortState = (event) => {
        setHowToSortState(event.target.value);
    };

    const filteredHowTos = howTos.filter(howTo => howToQuery.game_format? (howToQuery.game_format === howTo.game_format): howTo)
        .filter(howTo => howToQuery.skill_level? (howToQuery.skill_level === howTo.skill_level): howTo)
        .filter(howTo => howToQuery.content? (howTo.content.toLowerCase().includes(howToQuery.content.toLowerCase())): howTo)
        .filter(howTo => howToQuery.title? (howTo.title.toLowerCase().includes(howToQuery.title.toLowerCase())): howTo)
        .sort(howToSortMethods[howToSortState].method)

    return (
        <div className="white-space">
            <span className="media-flex-center">
                <div className="wide400p">
                    <h1 className="left-h1-2">Rulebook Search</h1>
                    <input
                        className="left dcbsearch-x-large"
                        type="text"
                        placeholder=" Title Contains..."
                        name="title"
                        value={howToQuery.title}
                        onChange={handleHowToQuery}>
                    </input>
                    <br/>
                    <input
                        className="left dcbsearch-x-large"
                        type="text"
                        placeholder=" Rulebook Contains..."
                        name="content"
                        value={howToQuery.content}
                        onChange={handleHowToQuery}>
                    </input>
                    <br/>
                    <div className="flex-items">
                        <select
                            className="left dcbsearch-medium"
                            type="text"
                            placeholder=" Game Format"
                            name="game_format"
                            value={howToQuery.game_format}
                            onChange={handleHowToQuery}>
                            <option value="">Game Format</option>
                            <option value="Standard">Standard</option>
                        </select>
                        <select
                            className="left dcbsearch-medium"
                            type="text"
                            placeholder=" Skill Level"
                            name="skill_level"
                            value={howToQuery.skill_level}
                            onChange={handleHowToQuery}>
                            <option value="">Skill Level</option>
                            <option value="beginner">Beginner</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                        <select
                            className="left dcbsearch-medium"
                            type="text"
                            placeholder=" Sorted By"
                            value={howToSortState}
                            onChange={handleHowToSortState}>
                            <option value="none">Sorted By</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                    <br/>
                    <div className="flex">
                        { account && account.roles.includes("admin")?
                            <NavLink to="/howtocreate">
                                <button
                                    className="left red margin-left-13">
                                    Create
                                </button>
                            </NavLink>:
                        null}
                        <button
                            className="left"
                            variant="dark"
                            onClick={handleResetHowToQuery}
                            >
                            Reset Filters
                        </button>
                    </div>
                    {/* { loading ?
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div> :
                        <h4 className="left-h3">Showing Results 1 - {completelyFilteredNews.slice(0, someMoreNews).length} of {completelyFilteredNews.length}</h4>} */}
                    <h4 className="left-h3">Showing Results 1 - {filteredHowTos.length} of {filteredHowTos.length}</h4>
                </div>
            </span>

            <br/>
            <div className="newsPage">
                {filteredHowTos.map((howTo, index) => {
                    return (
                        <>
                            <NavLink className="nav-link no-pad" to={`/rulebooks/${howTo.id}`}>
                                <div
                                    className="flex-items newsItem"
                                    style={{
                                        backgroundColor: howToColors[howTo.skill_level],
                                        borderColor: howToBorders[howTo.skill_level],
                                        marginTop: index === 0 ? "2px" : "10px",
                                        marginBottom: index ===  filteredHowTos.length -1 ? "2px" : "10px"
                                    }}
                                >

                                    <h3 className="newsText no-wrap">{howTo.game_format}</h3>
                                    <img className="skill_level" src={`${howTo.skill_level}.png`} alt={`${howTo.skill_level}.png`}/>
                                    {/* <h4 className="newsText">{story.section}</h4> */}
                                    <h4 className="newsText">{howTo.title}</h4>
                                </div>
                            </NavLink>
                        </>
                    )
                })}
            </div>
            {/* {someMoreNews < completelyFilteredNews.length ?
                <button
                    style={{ width: "100%", marginTop:"2%"}}
                    onClick={handleSomeMoreNews}>
                    Show More HowTos ({completelyFilteredNews.length - someMoreNews} Remaining)
                </button> : null } */}
        </div>
    );
}

export default HowTosPage;
