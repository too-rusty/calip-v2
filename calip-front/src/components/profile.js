import React from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import diplayPic from "../images/profilephoto.jpg";
import "./profile.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // token : this.props.match.params.token,
      uname: this.props.match.params.uname,
      name: null,
      username: null,
      email: null,
      about: null,
      drafts: [],
      cards: [],
      bookmarks: [],
      editable: false,
      loggedin: false,
    };
  }
  componentDidMount() {
    // dont know hot to pass it so using cookie for now
    console.log("component mount with this.state.uname", this.state.uname);
    const cookies = new Cookies();
    let tokk = cookies.get("calip_token");
    const config = {
      headers: {
        token: tokk,
      },
    };
    console.log("config", config);
    let url = "http://localhost:8000/profile/" + this.state.uname;
    axios
      .get(url, config)
      .then((res) => {
        console.log("called fetch API and got DATA -> ", res.data);
        if (res.data.username != undefined) {
          this.setState({ ...res.data });
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data.error === "record not found") {
            console.log("no record found");
            this.setState({ username: "NOTFOUND" });
          }
        } else {
          console.log("Show error notification!");
        }
      });
  }

  render() {
    let view;
    if (this.state.username === null) {
      view = <div>Loading ...</div>;
      return view;
    } else if (this.state.username === "NOTFOUND") {
      view = <div>No such user</div>;
      return view;
    }

    let allcards =
      this.state.cards === null
        ? []
        : this.state.cards.map((val, key) => {
            return (
              <div className="card-sc">
                <div className="content">
                  <Card
                    key={key}
                    ccid={val.ccid}
                    title={val.title}
                    about={val.about}
                    tags={val.tags}
                    username={val.username}
                  />
                </div>
              </div>
            );
          });

    let alldrafts = [];
    let ccid = this.props.ccid;
    // let link = "/cc/" + ccid.toString() + "/edit";

    if (this.state.editable === true) {
      alldrafts =
        this.state.drafts === null
          ? []
          : this.state.drafts.map((val, key) => {
              return (
                <div className="draft">
                  <Card
                    key={key}
                    ccid={val.ccid}
                    title={val.title}
                    isDraft={true}
                  />
                  {/* <Link to={link}> */}{" "}
                  {/* let link = <Link to={`/cc?tag=${val}`}>{val}</Link>; */}
                  <Link to={`/cc/${val.ccid}/edit`}>
                    <button className="draft-button">see</button>
                  </Link>
                  {/* </Link> */}
                </div>
              );
            });
    }

    let bookmarks = [];
    if (this.state.loggedin === true) {
      bookmarks =
        this.state.bookmarks === null
          ? []
          : this.state.bookmarks.map((val, key) => {
              return (
                // <div className="section-bookmarks">
                <div className="bookmark">
                  <Card
                    key={key}
                    ccid={val.ccid}
                    title={val.title}
                    about={val.about}
                    tags={val.tags}
                    username={val.username}
                  />
                </div>
              );
              //   return <Card key={key} ccid={val.ccid} title={val.title} />;
            });
    }

    view = (
      <div>
        <div className="hero-profile">
          <h4 style={{ color: "#05299e" }}>Hi {this.state.username}</h4>
          <img className="dp" src={diplayPic} alt="display" />
        </div>

        <div className="section-hero">
          <div className="bookmarks">
            <div
              style={{ color: "#05299e", fontSize: "24" }}
              className="section-heading"
            >
              Bookmarked Cards :
            </div>
            {this.state.bookmarks !== null ? (
              <div class="profile-scrollbar" id="style-1">
                <div class="profile-force-overflow">
                  <div className="section-bookmarks">
                    {bookmarks}
                  </div>
                </div>
              </div>
            ) : (
              <div>No Bookmarks to show</div>
            )}
          </div>
        </div>
        <div className="section-hero">
          <div className="drafts">
            <div
              style={{ color: "#05299e", fontSize: "24" }}
              className="section-heading"
            >
              Drafts :
            </div>
            {this.state.drafts !== null ? (
              <div class="profile-scrollbar" id="style-1">
                <div class="profile-force-overflow">
                  <div className="section-drafts">{alldrafts}</div>
                </div>
              </div>
            ) : (
              <div>No Drafts to show</div>
            )}
          </div>
        </div>
        <div className="section-hero">
          <div className="profilecards">
            <div
              style={{ color: "#05299e", fontSize: "24" }}
              className="section-heading"
            >
              Cards
            </div>
            {this.state.cards !== null ? (
              <div class="profile-scrollbar" id="style-1">
                <div class="profile-force-overflow">
                  <div className="allcards">{allcards}</div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    );

    return <div>{view}</div>;
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let ccid = this.props.ccid;
    let title = this.props.title;
    let isDraft = this.props.isDraft === true;
    let link = "/cc/" + ccid.toString();

    let username = this.props.username;

    let by_user = <Link to={`/profile/${username}`}>{username}</Link>;
    if (isDraft) link += "/edit";
    let view = (
      <div>
        <Link to={link}>
          <div style={{ color: "#fff !important" }}>{ccid}</div>
          <div>{title}</div>
          <div className="user">{by_user}</div>

          {/* <div>
            <div className="sc-heading">{title}</div>
            <div className="user"> {by_user}</div>
          </div> */}
        </Link>
      </div>
    );

    return <div>{view}</div>;
  }
}

export default Profile;
