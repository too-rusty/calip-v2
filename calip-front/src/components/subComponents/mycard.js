import React from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

import "./mycard.css";

let marked = require("marked");

class MyCard extends React.Component {
  //actually contain the buttons
  constructor(props) {
    super(props);
  }
  render() {
    let content = this.props.content;
    if (!content) content = "EMPTY";
    let idx = this.props.idx;
    return (
      <div className="mycards">
        <div
          dangerouslySetInnerHTML={{
            __html: marked(content.substr(0, 5) + "..."),
          }}
        ></div>
        <div className="mybuttons">
          <button className="mybutton" onClick={this.props.deleteCard}>
            <FaTrashAlt />
          </button>
          <button
            className="mybutton"
            onClick={() => this.props.stardEdit(idx)}
          >
            <FaEdit />
          </button>
        </div>

        {/* <div><button onClick={()=>this.props.save(idx)}>save</button></div> */}
      </div>
    );
  }
}

export default MyCard;
