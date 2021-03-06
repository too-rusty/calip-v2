import React from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import EditCard from "./subComponents/editcard";
import MyCard from "./subComponents/mycard";
import { Redirect } from "react-router";
// import CChainView from "./cchainView"

import "./create.css";

let marked = require("marked");

const cookies = new Cookies();

var inputStyle = {
  width: "400px",
  height: "50vh",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "10px",
};
var outputStyle = {
  width: "400px",
  height: "50vh",
  backgroundColor: "#DCDCDC",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "10px",
};

class EditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ccid_link: this.props.match.params.ccid,
      ccid: null,
      cidx: null,

      title: null,
      about: null,
      username: null,
      draft: null,
      likes: 0,
      editable: null,
      loggedin: null,
      bookmarked: null,
      tag_str: null,

      tags: [],
      cards: [], // these are actually cards
      currentCardIdx: null,
      content: null, // later remove this, only doing for now
    };
  }
  setCard(idx) {
    this.setState({ cidx: idx });
  }

  addCard() {
    let cards = this.state.cards;
    cards.push({ content: "" });
    let n = cards.length;
    this.setState({ cards: cards, cidx: n - 1 });
  }

  addVidCard() {
    let cards = this.state.cards;
    cards.push({ link: "", content: "" });
    let n = cards.length;
    this.setState({ cards: cards, currentCardIdx: n - 1 });
  }

  deleteCard(index) {
    const cards = this.state.cards;
    const newCards = [...cards.slice(0, index), ...cards.slice(index + 1)];
    this.setState({
      cards: newCards,
      cidx: null,
    });
  }

  stardEdit(key) {
    // set the current card to edit
    this.setState({ cidx: key });
  }

  editCard(content) {
    // edit the current non video card, note we are editing the current card index
    let cidx = this.state.cidx;
    let cards = this.state.cards;
    cards[cidx].content = content;
    this.setState({ cards: cards });
  }

  editVidCard(link, content) {
    // edit the video card, note that we are editing the current index
    let cidx = this.state.cidx;
    let cards = this.state.cards;
    if (link !== null) cards[cidx].link = link;
    if (content !== null) cards[cidx].content = content;
    this.setState({ cards: cards });
  }

  formData(isDraft) {
    // draft is bool variable
    let tags;
    if (this.state.tag_str === null) {
      tags = [];
    } else {
      tags = this.state.tag_str
        .split(",", 5)
        .map((val) => val.trim())
        .filter((val) => val !== ""); // derive from tag_str TODO
    }

    let title =
      this.state.title === null ? "EMPTY TITLE" : this.state.title.trim();
    let about =
      this.state.about === null ? "EMPTY about" : this.state.about.trim();
    const data = {
      ccid: this.state.ccid,
      title: title,
      about: about,
      username: this.state.username,
      draft: isDraft,
      likes: this.state.likes,
      editable: this.state.editable,
      loggedin: this.state.loggedin,
      bookmarked: this.state.bookmarked,
      tags: tags,
      content: this.state.cards,
    };
    return data;
  }

  saveChain() {
    //saves as draft

    let data = JSON.stringify(this.formData(true));
    const cookies = new Cookies();
    let token = cookies.get("calip_token");
    console.log("data before sending", data);
    console.log("token before sending", token);
    const config = {
      headers: {
        token: token,
        // 'sameSite': 'None; Secure'
      },
    };
    // MAY RETURN INVALID TOKEN , so handle that too
    axios
      .post("http://localhost:8000/cc/create", data, config)
      .then((res) => {
        console.log("called CREATE API", res.data);
        if (res.data.ccid != undefined) {
          this.setState({ ccid: res.data.ccid });
        }
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ ccid: "NOTFOUND" });
          cookies.set("calip_token", "null", { path: "/" });
          cookies.set("calip_uname", "nullUser", { path: "/" });
          console.log(error.response.data);
        } else {
          console.log("Show error notification!");
        }
      });
  }
  publishChain() {
    // e.preventDefault()
    //publishes the chain
    // after publishing redirect to the main page maybe

    let data = JSON.stringify(this.formData(false));
    const cookies = new Cookies();
    let token = cookies.get("calip_token");
    console.log("data before sending", data);
    console.log("token before sending", token);
    const config = {
      headers: {
        token: token,
        // 'sameSite': 'None; Secure'
      },
    };

    axios
      .post("http://localhost:8000/cc/create", data, config)
      .then((res) => {
        console.log("called CREATE API", res.data);
        if (res.data.ccid != undefined) {
          this.setState({ ccid: res.data.ccid });
        }
        // console.log("USERNAMEEEE",res.data) // only token is being returned
        // // localStorage.setItem('token',res.data.token)
        // ls.set('token',res.data.token)
        // this.props.setUser(res.data.token,true)
      })
      .catch((error) => {
        if (error.response) {
          // token is expired
          this.setState({ ccid: "NOTFOUND" });
          cookies.set("calip_token", "null", { path: "/" });
          cookies.set("calip_uname", "nullUser", { path: "/" });
          console.log(error.response.data);
        } else {
          console.log("Show error notification!");
        }
      });
  }
  changeHandler(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      ...this.state,
      [name]: value,
    });
  }
  componentDidMount() {
    // dont know hot to pass it so using cookie for now
    const cookies = new Cookies();
    let tokk = cookies.get("calip_token");
    const config = {
      headers: {
        token: tokk,
      },
    };

    let url = "http://localhost:8000/cc/" + this.state.ccid_link.toString();
    axios
      .get(url, config)
      .then((res) => {
        console.log("called fetch API and got DATA -> ", res.data);
        if (res.data.ccid !== undefined) {
          res.data.cards = res.data.content;
          res.data.tag_str = res.data.tags.join();
          this.setState({ ...res.data });
          console.log("fetched state", this.state);
        }
      })
      .catch((error) => {
        console.log("tis he");
        if (error.response) {
          if (error.response.data.error === "record not found") {
            this.setState({ ccid: "NOTFOUND" });
          }
        } else {
          console.log("Show error notification!", error);
        }
      });
  }

  render() {
    let view;
    if (this.state.ccid === "NOTFOUND") {
      view = <div>No card , logout then login to view</div>;
      // return <Redirect to={'/'} />
    } else if (parseInt(this.state.ccid).toString() === "NaN") {
      // REDIRECT
      view = <div>invalid card id</div>;
      // return <Redirect to={'/'} />
    } else if (this.state.ccid === null) {
      view = <div>Loading ....</div>;
    } else if (this.state.editable === false) {
      view = <div>No card to edit please logout then login to view</div>;
      // return <Redirect to={'/'} />
    } else {
      let cards = this.state.cards.map((val, key) => {
        return (
          <MyCard
            key={key}
            idx={key}
            content={val.content}
            link={val.link}
            stardEdit={this.stardEdit.bind(this)}
            deleteCard={() => {
              //need to change this state too else render not called
              //since cons initialised once
              this.deleteCard(key);
            }}
          />
        );
      });
      let cidx = this.state.cidx;
      view = (
        // <div>
        //   <div>
        //     <button onClick={this.addCard.bind(this)}>add card</button>
        //   </div>
        //   <div>
        //     <button onClick={this.addVidCard.bind(this)}>add vid card</button>
        //   </div>
        //   <div>
        //     <button onClick={this.saveChain.bind(this)}>save draft</button>
        //   </div>
        //   <div>
        //     <button onClick={this.publishChain.bind(this)}>publish</button>
        //   </div>
        //   <div>
        //     <label>Title</label>
        //     <input
        //       name="title"
        //       type="text"
        //       placeholder="Title"
        //       value={this.state.title}
        //       onChange={this.changeHandler.bind(this)}
        //     />
        //   </div>
        //   <div>
        //     <label>About</label>
        //     <input
        //       name="about"
        //       type="text"
        //       placeholder="About"
        //       value={this.state.about}
        //       onChange={this.changeHandler.bind(this)}
        //     />
        //   </div>
        //   <div>
        //     <label>Tags( enter comma separated values (atmost 5) ) </label>
        //     <input
        //       name="tag_str"
        //       type="text"
        //       placeholder="tags"
        //       value={this.state.tag_str} // TAGs TODO
        //       onChange={this.changeHandler.bind(this)}
        //     />
        //   </div>
        //   <div>The first card will be the about card</div>
        //   <div>All cards</div>
        //   <div> {cards} </div>
        //   {cidx !== null ? (
        //     <div>
        //       {/* <div><PreviewCard card={this.state.cards[cidx]}/></div> */}
        //       <div>
        //         <EditCard
        //           card={this.state.cards[cidx]}
        //           editCard={this.editCard.bind(this)}
        //           editVidCard={this.editVidCard.bind(this)}
        //         />
        //       </div>
        //     </div>
        //   ) : (
        //     <div> NO PREVIEW </div>
        //   )}
        // </div>

        <div className="create-card">
          {/* style this on the side so that users can refer it by going to the ling */}
          <div className="information">
            <div>
              <label>Title:</label>
              <input
                name="title"
                type="text"
                placeholder="Title"
                value={this.state.title}
                onChange={this.changeHandler.bind(this)}
              />
            </div>
            <div>
              <label>About:</label>
              <input
                name="about"
                type="text"
                placeholder="About"
                value={this.state.about}
                onChange={this.changeHandler.bind(this)}
              />
            </div>
            <div>
              <label>Tags: </label>
              <input
                name="tag_str"
                type="text"
                value={this.state.tag_str}
                placeholder="enter comma separated values (atmost 5)"
                onChange={this.changeHandler.bind(this)}
              />
            </div>
            <div>
              {/* <p>
                This site uses markdown to render your ideas, new to markdown?
                check here {markdown_link}
              </p> */}
            </div>{" "}
          </div>
          <div className="buttons">
            <button onClick={this.addCard.bind(this)}>add card</button>
            <div>
              <button onClick={this.addVidCard.bind(this)}>add vid card</button>
            </div>
            <div>
              <button onClick={this.saveChain.bind(this)}>save draft</button>
            </div>
            <div>
              <button onClick={this.publishChain.bind(this)}>publish</button>
            </div>
          </div>
          <div className="cards-create">
            <div>
              <div style={{ color: "#fbf3f5" }}>
                The first card will be the about card
              </div>
              {cidx !== null ? (
                <div>
                  {/* <div><PreviewCard card={this.state.cards[cidx]}/></div> */}
                  <div>
                    <EditCard
                      card={this.state.cards[cidx]}
                      editCard={this.editCard.bind(this)}
                      editVidCard={this.editVidCard.bind(this)}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ color: "#fbf3f5" }}> NO PREVIEW </div>
              )}{" "}
            </div>
            <div>
              <div style={{ color: "#fbf3f5" }}>All cards</div>
              <div class="scrollbar" id="style-1">
                <div class="force-overflow">
                  <div>{cards}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return view;
  }
}

export default EditView;

/*

Edit view of the card, user can edit the card


*/
