import React from "react";

import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import "./home.css";
import * as ReactBootstrap from "react-bootstrap";
import ImgBg from "../images/Imgbg.jpg";
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
            <p>More than</p>
            <h1>500+</h1>
            <p>topics to study</p>
          </div>
          <div className="card">
            <p>More than</p>
            <h1>500+</h1>
            <p>topics to study</p>
          </div>
          <div className="card">
            <p>More than</p>
            <h1>500+</h1>
            <p>topics to study</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
