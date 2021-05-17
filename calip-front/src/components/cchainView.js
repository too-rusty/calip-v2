import React from "react";
import ReactPlayer from "react-player";
import "./cchainView.css";
import { Scrollbars } from "react-custom-scrollbars";
import { Button, Modal } from "react-bootstrap";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

let marked = require("marked");

var outputStyle = {
  width: "400px",
  height: "50vh",
  backgroundColor: "#DCDCDC",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "10px",
};

class CChainView extends React.Component {
  constructor(props) {
    super(props);
    let startIdx = this.props.startIdx;
    this.state = {
      cc: this.props.chain.content, // the actual card chain content
      cidx: startIdx == 0 ? startIdx : null,
    };
    console.log("cchainview content", this.state.cc);
    let length = this.state.cc.length;
    console.log(length);
  }
  setCard(idx) {
    this.setState({ cidx: idx });
  }
  nextCard(idx) {
    let length = this.state.cc.length;
    if (idx + 1 === length) {
      // alert("This is the last card, No more cards to show");
      this.setState({ cidx: 0 });
    } else {
      this.setState({ cidx: idx + 1 });
    }
  }
  prevCard(idx) {
    if (idx - 1 < 0) {
      // alert("This is the first card, No previous card to show");
      this.setState({ cidx: 0 });
    } else {
      this.setState({ cidx: idx - 1 });
    }
  }
  renderView({}) {
    const customStyle = {
      backgroundColor: `#893168`,
    };
    return customStyle;
  }
  render() {
    if (this.state.cc === null || this.state.cc === undefined) {
      return (
        <div>No cards to view, thats why users should use atleast one card</div>
      );
    }
    // console.log("finallu",this.state)

    let cards = this.state.cc.map((val, key) => {
      return (
        <ShortViewCard
          key={key}
          idx={key}
          content={val.content}
          link={val.link}
          setCard={this.setCard.bind(this)}
        />
      );
    });
    // ok so the above is the short version of all the cards
    let cidx = this.state.cidx;
    return (
      <div>
        <div class="view-section">
          <div className="full-view">
            {cidx !== null ? (
              <div>
                {/* <div><PreviewCard card={this.state.cards[cidx]}/></div> */}
                <div>
                  <DetailViewCard
                    card={this.state.cc[cidx]}
                    nextCard={this.nextCard.bind(this)}
                    prevCard={this.prevCard.bind(this)}
                    idx={cidx}
                  />
                </div>
              </div>
            ) : (
              <div>{cards.length === 0 ? "WOOPS! no card" : ""}</div>
              // CORRECT THIS , WHEN NO CARD

              // <div>
              //   {" "}
              //   <DetailViewCard card={this.state.cc[0]} />
              // </div>
            )}
          </div>
          <div className="chain-view">
            {/* <Scrollbars style={{width:300,height:600,color:"yellow !important" }}
                 > */}
            <div class="scrollbar-chainView" id="style-chainView">
              <div class="force-overflow-chainView">
                <div>{cards}</div>
              </div>
            </div>

            {/* </Scrollbars> */}
          </div>
        </div>
      </div>
    );
  }
}

class DetailViewCard extends React.Component {
  constructor(props) {
    super(props);
    console.log("logging card", this.props);
    this.state = {
      showHide: false,
    };
  }

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide });
  }

  // onClickButton = (e) => {
  //   e.preventDefault();
  //   this.setState({ openModal: true });
  // };

  // onCloseModal = () => {
  //   this.setState({ openModal: false });
  // };
  render() {
    let markdown = this.props.card.content;
    let title = this.props.card.title;
    let idx = this.props.idx;
    let length = this.props.card.length;
    console.log(length);
    let isVidCard = this.props.card.link === "" ? false : true;
    let link = this.props.card.link;

    return (
      <div className="card-details">
        <div className="text-card">
          {/* fbf5f3  */}
          <Scrollbars
            style={{ width: 600, height: 400, backgroundColor: "#fff" }}
          >
            <div
              style={{
                padding: 10,
              }}
              dangerouslySetInnerHTML={{
                __html: marked(markdown),
              }}
            ></div>
          </Scrollbars>
        </div>

        {isVidCard ? (
          <div>
            <div className="buttons-new">
              <button
                class="swipw-btn"
                onClick={() => this.props.prevCard(idx)}
              >
                <FaAngleLeft />
              </button>
              <button onClick={() => this.handleModalShowHide()}>
                Show Video
              </button>
              <button
                class="swipw-btn"
                onClick={() => this.props.nextCard(idx)}
              >
                <FaAngleRight />
              </button>
            </div>
            <Modal show={this.state.showHide}>
              {/* <Modal.Header
                closeButton
                onClick={() => this.handleModalShowHide()}
              >
                <Modal.Title>{title}</Modal.Title>
              </Modal.Header> */}
              <Modal.Body>
                <div className="vdo-card">
                  <ReactPlayer url={link} controls={true} />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  variant="secondary"
                  onClick={() => this.handleModalShowHide()}
                >
                  Close
                </button>
              </Modal.Footer>
            </Modal>
            {}
          </div>
        ) : (
          <div>
            <div className="buttons-new">
              <button
                class="swipw-btn"
                onClick={() => this.props.prevCard(idx)}
              >
                <FaAngleLeft />
              </button>

              <button
                class="swipw-btn"
                onClick={() => this.props.nextCard(idx)}
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class ShortViewCard extends React.Component {
  //actually contain the buttons
  constructor(props) {
    super(props);
  }

  render() {
    let content = this.props.content;
    if (!content) content = "EMPTY";
    let idx = this.props.idx;

    let isVidCard = this.props.link === undefined ? false : true;
    return (
      <div className="cardcolumn">
        <div className="short-card" onClick={() => this.props.setCard(idx)}>
          <box className="inner">#{idx + 1}</box>
          <div
            class="innerhtml"
            dangerouslySetInnerHTML={{
              __html: marked(content.substr(0, 50) + "..."),
            }}
          ></div>
        </div>
      </div>
    );
  }
}

/*

  <div
                dangerouslySetInnerHTML={{
                    __html: marked(content.substr(0,5)+'...'),
                }}
                ></div>
                <div>{isVidCard?<div>YES</div>:<div>NO</div>}</div>
                <div><button onClick = {()=> this.props.setCard(idx)} > Card {idx+1} </button></div>
                {/* <div><button onClick={()=>this.props.save(idx)}>save</button></div> }
the overview is this

there is a main component which contains all the cards in a short view

then there is a single card called the long view

now the component passes the function 




*/

export default CChainView;
