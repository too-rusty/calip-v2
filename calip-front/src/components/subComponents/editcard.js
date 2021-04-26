import React from "react";
import ReactPlayer from "react-player";
import "./editcard.css";

var inputStyle = {
  width: "400px",
  height: "50vh",
  //   marginLeft: "auto",
  //   marginRight: "auto",
  padding: "10px",
};
var outputStyle = {
  width: "400px",
  height: "50vh",
  color: "black !important",
  backgroundColor: "#DCDCDC",
  //   marginLeft: "auto",
  //   marginRight: "auto",
  padding: "10px",
};

let marked = require("marked");

class EditCard extends React.Component {
  constructor(props) {
    super(props);
  }
  updateMarkdown(link, content) {
    // this.setState({ content });
    let isVidCard = this.props.card.link === undefined ? false : true;
    if (!isVidCard) this.props.editCard(content);
    else this.props.editVidCard(link, content);
  }

  componentWillMount() {}
  render() {
    // this.props.card is always non null
    let markdown = this.props.card.content;
    let isVidCard = this.props.card.link === undefined ? false : true;
    let link = this.props.card.link;
    return (
      <div>
        <p>Add your content here</p>
        <div className="edit-cardView">
          <div className="in">
            <textarea
              className="input"
              style={inputStyle}
              value={markdown}
              onChange={(e) => {
                this.updateMarkdown(null, e.target.value);
              }}
            ></textarea>
          </div>

          {/*OUTPUT PREVIEW*/}
          <div className="out">
            <div class="view-scrollbar" id="view-style-1">
              <div class="force-overflow">
                <div
                  style={outputStyle}
                  dangerouslySetInnerHTML={{
                    __html: marked(markdown),
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="vdocard-view">
          {isVidCard ? (
            <div>
              <p> add vdo link here</p>
              <textarea
                style={{ width: 400 }}
                value={link}
                onChange={(e) => {
                  this.updateMarkdown(e.target.value, markdown);
                }}
              />
            </div>
          ) : (
            <div></div>
          )}
          {isVidCard ? (
            <div>
              <ReactPlayer url={link} controls={true} />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
  // render() {
  //     return (<div>edit card here</div>)
  // }
}

export default EditCard;
