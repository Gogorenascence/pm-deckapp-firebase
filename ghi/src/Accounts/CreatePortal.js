import SectionCard from "../Display/SectionCard";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


function CreatePortal() {

    const { account } = useContext(AuthContext)

    if (!(account && account.roles.includes("admin"))) {
        setTimeout(function() {
            window.location.href = `${process.env.PUBLIC_URL}/`
        }, 3000);
    }

    return (
        <div>
            {account && account.roles.includes("admin")?
                <div className="white-space">
                    <h1 className="left-h1">Admin Create Portal</h1>
                    <h2 className="left">Select an Item to Create</h2>
                    <div className="decks-page-card-list2">
                        <SectionCard
                            link="/cardcreate"
                            title="Card Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/howtocreate"
                            title="Rulebook Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/cardsetcreate"
                            title="Card Set Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/articlecreate"
                            title="Article Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/categorycreate"
                            title="Category Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/cardtypecreate"
                            title="Card Type Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/cardtagcreate"
                            title="Tag Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/extraeffectcreate"
                            title="Extra Effect Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/reactioncreate"
                            title="Reaction Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
                        <SectionCard
                            link="/termcreate"
                            title="Term Create"
                            imageSRC="https://i.imgur.com/8wqd1sD.png"
                        />
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

export default CreatePortal;
