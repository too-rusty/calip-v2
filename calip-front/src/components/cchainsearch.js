import React from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import queryString from "query-string";
import { FaSearch } from "react-icons/fa";

import "./cchainsearch.css";

// const queryString = require('query-string');
// const PAGE_SZ = 1

class CchainSearch extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    const { tag, page } = queryString.parse(this.props.location.search); // can be later extended to user
    console.log("tag page ", tag, page);
    this.state = {
      // summary_default: [], // this is the searched one and the defautl one now, update this
      summary: [], // this is the searched one
      total: 0,
      loggedin: false,
      search_str: null, // for the box to type in dynamic
      search_tag: tag === undefined ? null : tag, // variable changed to this
      prev_tag: tag === undefined ? null : tag, // variable changed to this
      page_no: page === undefined ? 1 : page,
      // query_params : (this.props.location.search) TODO this later
    };
  }

  // type CcSummary struct {
  //     Ccid     uint     `json:"ccid"`
  //     Title    string   `json:"title"`
  //     About    string   `json:"about"`
  //     Tags     []string `json:"tags"`
  //     Username string   `json:"username"`
  // }

  componentDidMount() {
    // console.log("EARCH MOUNTED")
    this._isMounted = true;
    // const cookies = new Cookies();
    // let tokk = cookies.get('calip_token')

    /*
        if this is a tag
        search the db for that tag
        */
    this.apiCall();
  }

  apiCall() {
    console.log("BEFORE API CALL TAG IS ", this.state.search_tag);
    let url = "http://localhost:8000/search";
    if (this.state.search_tag !== null) {
      url += "/tag/" + this.state.search_tag + "?page=" + this.state.page_no;
    } else {
      url += "?page=" + this.state.page_no;
    }
    url += "&page_size=1000";

    const config = {
      headers: {
        token: "null token",
      },
    }; // no token needed

    console.log("URLLLLL", url);
    axios
      .get(url, config)
      .then((res) => {
        if (this._isMounted) {
          // res.data.summary_default = res.data.summary
          // res.data.summary = []
          this.setState({ ...this.state, ...res.data });
          console.log("set home component state", this.state);
        }
      })
      .catch((error) => {
        console.log("error in cchainsearch ", error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate() {
    //called everytime component updated
    if (this.state.prev_tag !== this.state.search_tag) {
      this.setState({ prev_tag: this.state.search_tag });
      this.apiCall();
    }
    // console.log('component updated')
    // console.log('updated state', this.state)
  }

  changeHandler(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      ...this.state,
      [name]: value,
    });
  }
  search() {
    /*
        change some setting so that it is redirected to the page
        */
    //    console.log("search clickeddd", this.state.search_str)
    if (this.state.search_str === null) {
    } else if (this.state.search_str.trim() !== "") {
      this.setState({ search_tag: this.state.search_str });
      //    this.apiCall()
      // also make the api call and populate
    }
  }

  showAll() {
    this.setState({ search_tag: null, search_str: null, prev_tag: null });
    //call api again - no need
  }

  render() {
    let search_bar = (
      <div>
        <label></label>
        <div className="buscar-caja">
          <input
            className="buscar-txt"
            name="search_str"
            type="text"
            placeholder="search by tag"
            onChange={this.changeHandler.bind(this)}
          />
          <Link
            className="buscar-btn"
            onClick={this.search.bind(this)}
            to={`/cc?tag=${
              this.state.search_str === null
                ? this.state.prev_tag
                : this.state.search_str
            }`}
          >
            <FaSearch />
          </Link>
        </div>

        {/* <button onClick={this.search.bind(this)}>search</button> */}
      </div>
    );

    let show_all_button = (
      <div>
        <Link onClick={this.search.bind(this)} to={`/reloadcc`}>
          <button onClick={this.showAll.bind(this)}>show all</button>
        </Link>
      </div>
    );

    let allcards;
    if (this.state.summary === null) {
    } else {
      allcards = this.state.summary.map((val, key) => {
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
    }

    return (
      <div>
        <div className="hero">
          <div className="searchhero">
            <div className="searchbar">
              <div style={{ color: "white" }}>
                Looking for Something? Search now to get the best results
              </div>
              <div>{search_bar}</div>
            </div>
          </div>
          <div className="search-tag">
            {this.state.search_tag !== null ? (
              <div className="categoryTag"> {this.state.search_tag}</div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="allcards">{allcards}</div>
          <div>{show_all_button}</div>
        </div>
      </div>
    );
  }
}

/*
Flow of this component cycle and explanation

observation - link doesn't render the new component
componentDidUpdate is called everytime component gets updated

search_str is the current search str
after search button is clicked, we `Link` to the same component

update the search_tag in the search func ( on searchbutton click )

componentDidupdate, check if the search_tag is different than the prev_tag
update the prev and recall the api
component is rerendered 

CURRENTLY unable to IMPLEMENT any PAGINATION , so need to do that

*/

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let ccid = this.props.ccid;
    let title = this.props.title;
    let about = this.props.about;
    let tags = this.props.tags.map((val, key) => {
      return (
        <div className="categoryTag">
          <Tag val={val} key={key} />
        </div>
      );
    });

    let tag_group_component = <TagGroupComponent tag_array={this.props.tag} />;
    // MOSTLY USE THE ABOVE

    let username = this.props.username;

    let by_user = <Link to={`/profile/${username}`}>{username}</Link>;

    let view = (
      <Link to={"/cc/" + ccid.toString()}>
        <div>
          <div className="main-heading">
            <div className="card-text">
              <div className="sc-heading">{title}</div>
              <div className="sc-user">-- {by_user}</div>
            </div>
            <div> {tags}</div> {/* use TAG group here maybe */}
          </div>
        </div>
      </Link>
    );

    return <div>{view}</div>;
  }
}

class Tag extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let tag = this.props.val;
    return (
      <div className="searched-tag">{tag}</div> // better if this is in a small box or something
    );
  }
}

class TagGroupComponent extends React.Component {
  //group all the tags in a div and then inside this component,
  // now we have the aray of tags
  // put them in a Tag component
  // and then group them togehter somehow side to side ....
  constructor(props) {
    super(props);
  }
  render() {
    return <div></div>;
  }
}

export default CchainSearch;
