import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "./categories.css";

/*
hard coded categories fetched from the database so that the user can explore the tags
*/

class Categories extends React.Component {
  //actually contain the buttons
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios
      .get(`http://${process.env.REACT_APP_SERVER_URL}/category`)
      .then((res) => {
        console.log("called category API", res.data);
        this.setState({ data: res.data });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log("Show error notification!");
        }
      });
  }

  render() {
    let data = this.state.data;
    console.log(data);
    let component_tags = data.map((val, key) => {
      return <CategoryCard key={key} data={val} />;
    });
    return (
      <div className="categoryhead">
        <div className="categoryhero">
          <div className="head">
            <h5>CATEGORIES</h5>
            Some tags on the most common categories, more to be added soon.
          </div>
        </div>
        <div className="category">{component_tags}</div>
      </div>
    );
  }
}

class CategoryCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let category_title = this.props.data.category;
    let tags = this.props.data.tags.map((val, key) => {
      let link = <Link to={`/cc?tag=${val}`}>{val}</Link>;

      return <div className="categoryTag">{link}</div>;
    });

    return (
      <div>
        <div style={{ color: "#29395a" }}> {category_title}: </div>
        <div className="categoryTags"> {tags}</div>
      </div>
    );
  }
}

export default Categories;
