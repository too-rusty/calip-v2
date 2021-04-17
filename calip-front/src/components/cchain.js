import React from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Redirect } from "react-router";
import CChainView from "./cchainView"

class Cchain extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ccid : this.props.match.params.ccid,
            cardchain : null,
            editmode : false,
        }
        console.log("STATE CC", this.state.ccid)
    }


    bookmarkFUNC(){
        const cookies = new Cookies();
        let tokk = cookies.get('calip_token')
        const config = {
            headers : {
                'token' : tokk
            }
        }
        let uname = cookies.get('calip_uname')
        console.log('uname isssss',uname)
        let data = {
            "username" : uname,
            "ccid" : this.state.cardchain.ccid,
            "save": this.state.cardchain.bookmarked
        }
        let url = 'http://localhost:8000/bookmark/createORremove'
        axios.post(url, JSON.stringify(data), config)
        .then(
            res => {
                console.log('calling bookmark api')
                console.log("returned",res.data)
            }
        ).catch(
            error => {
                console.log('tis he')
                if (error.response) {
                    console.log("error bookmark", error.response)
                } else {
                    console.log('Show error notification!')
                }
            }
        )
    }


    // _isMounted = true
    componentDidMount(){
        this._isMounted = true
        const data = {}
        // dont know hot to pass it so using cookie for now
        const cookies = new Cookies();
        let tokk = cookies.get('calip_token')
        const config = {
            headers : {
                'token' : tokk
            }
        }
        console.log("config",config)
        let url = 'http://localhost:8000/cc/' + this.state.ccid.toString()
        axios.get(url, config)
        .then(
            res => {
                console.log("called fetch API and got DATA -> ", res.data)
                if(res.data.ccid != undefined) {
                    if (res.data.draft === true ) this.setState({cardchain:"NOTFOUND"})
                    else {
                        this.setState({cardchain:res.data})
                    }
                }
            }
        ).catch(
            error => {
                console.log('tis he')
                if (error.response) {
                    if(error.response.data.error === "record not found") {
                        // console.log("YOOOO record not found")
                        this.setState({cardchain:"NOTFOUND"})
                    }
                    // console.log(error.response.data)
                    // cookies.set('calip_token', 'null', { path: '/' }) // whyyyy , not needed
                } else {
                    console.log('Show error notification!')
                }
            }
        )

        





    }
    componentWillUnmount() {
        this._isMounted = false
    }

    edit() {
        this.setState({edit:true})
    }
    toggleBookmark(e) {
        e.preventDefault()
        let ccc = this.state.cardchain
        ccc.bookmarked = !ccc.bookmarked
        this.setState({cardchain:ccc})
        this.bookmarkFUNC()
    }

    render() {
        if(this.state.edit) { // TODO change here to edit view component or link
            return <Redirect to={'/cc/'+this.state.ccid.toString()+'/edit'} />
        }
        let view
        if (parseInt(this.state.ccid).toString() === "NaN") {
            // REDIRECT
            view = <div>NOT a number in the url, invalid</div>
        } else if (this.state.cardchain === null ) {
            view = <div>Loading ....</div>
        } else if (this.state.cardchain === "NOTFOUND" ){
            view = <div>No card</div>
        } else {

            let cc = this.state.cardchain
            view = (
            <div>
                <div>Title : {cc.title}</div>
                <div>About : {cc.about}</div>
                <div>Likes : {cc.likes}</div>
                <div>By : {cc.username}</div>
                {/* book mark or not */}
                <div>{cc.loggedin ? 
                        <div>
                        {<Bookmark yes={cc.bookmarked} toggleBookmark={this.toggleBookmark.bind(this)} /> }
                        </div> : <div></div> }
                </div>
                {/* Editable or not */}
                <div>
                {cc.editable ? 
                        <div>
                        {<button onClick = {() => this.edit() }>Edit</button> }
                        </div> : <div></div> }
                </div>

                <div><CChainView chain={this.state.cardchain}/></div>
            </div>
            )
        }
        return (
            <div>{view}</div>
        )
    }

}

class Bookmark extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <button onClick={e=>this.props.toggleBookmark(e)}>
                <div>Bookmarked : </div>
                {this.props.yes ? <div>YES</div> : <div>NO</div>}
            </button>
        )
    }
}

class CchainSub extends React.Component {
    constructor(props) {
        super(props)
    }
}



export default Cchain

/*

Bookmark option if user logged in
Edit option if the user requesting the card is the same as the user logged in
Card chain with buttons to navigate in between them -- ON IT

*/