import React from "react";

import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import "./home.css";

import * as ReactBootstrap from "react-bootstrap";
import ImgBg from "../images/Imgbg.jpg";
import content from "../images/content.svg";
import creators from "../images/creaters.svg";
import students from "../images/students.svg";
class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // if (this.props.user === undefined || this.props.user === '') {
    let view1;
    if (this.props.token === "null") {
      view1 = <div className="intro-heading">Welcome to Calip!</div>;
    } else {
      view1 = <div className="intro-heading"> hi User, Welcome to Calip! </div>;
    }

    return (
      <div className="home">
        <div className="home-hero">
          <div className="home-title">Calip</div>
          <div className="home-about">
            <div>
            Aggregate and bundle your
            ideas from around the web.
            </div>
            <div>
            </div>
            <div>
            Explore great ideas quickly yet effectively.
            </div>
          </div>
          <div className="home-buttons">
            <Link to="/cc">
              {" "}
              <button>Explore</button>{" "}
            </Link>
            <Link to="/About">
              {" "}
              <button>Read more</button>{" "}
            </Link>
          </div>
        </div>
        <div className="cards">
          <div className="card">
            <img className="display-image" src={content} alt="content" />
            <p>More than</p>
            <h3>100+</h3>
            <p>lessons as value packed cards</p>
          </div>
          <div className="card">
            <img className="display-image" src={creators} alt="creators" />
            <p>More than</p>
            <h3>40+</h3>
            <p>creators across the globe</p>
          </div>
          <div className="card">
            <img className="display-image" src={students} alt="students" />
            <p>More than</p>
            <h3>100+</h3>
            <p>happy learners</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
