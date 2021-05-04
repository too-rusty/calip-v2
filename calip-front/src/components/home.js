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
            Calip is a data aggregation platform made for students , experts
            upload necessary information which is easily accesible to the
            students
          </div>
          <div className="home-buttons">
            <Link to="/cc">
              {" "}
              <button>Explore</button>{" "}
            </Link>
            <Link to="/Read">
              {" "}
              <button>Read more</button>{" "}
            </Link>
          </div>
        </div>
        <div className="cards">
          <div className="card">
            <img className="display-image" src={content} alt="content" />
            <p>More than</p>
            <h3>500+</h3>
            <p>topics in the form of cards</p>
          </div>
          <div className="card">
            <img className="display-image" src={creators} alt="creators" />
            <p>atleast</p>
            <h3>200+</h3>
            <p>creators across the globe</p>
          </div>
          <div className="card">
            <img className="display-image" src={students} alt="students" />
            <p>More than</p>
            <h3>1000+</h3>
            <p>happy students</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
