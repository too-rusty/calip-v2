import React from "react";
import { Redirect } from "react-router";
import axios from 'axios'
import ReactPlayer from 'react-player'


let marked = require("marked");



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

class Create extends React.Component {
    
    // render() {
    //     console.log(this.props.user)
    //     if (this.props.user !== null) {
    //         return (
    //             <div> you are in, create now! </div>
    //         )
    //     } else {
    //         // return <Redirect to={'/'} />
    //         return (
    //             <div>Create</div>
    //         )
    //     }
    // }

// save this template at regular intervals to save to db
// fetch the ccid when this happens for the first time

    constructor(props) {
        super(props)
        console.log()
        this.state = {
            ccid : null,
            title : null,
            about : null,
            username : null,
            draft : null,
            likes : 0,
            editable : null,
            loggedin : null,
            bookmarked : null,
            tag_str:null,


            tags : [],
            cards : [], // these are actually cards
            currentCardIdx : null,
            content : null // later remove this, only doing for now
        }
    }



    addCard(){
        let cards = this.state.cards
        cards.push( { content : '' } )
        let n = cards.length
        this.setState( { cards : cards , currentCardIdx : n-1 } )
    }
    
    addVidCard(){
        let cards = this.state.cards
        cards.push( { link : '' , content : '' } )
        let n = cards.length
        this.setState( { cards : cards , currentCardIdx : n-1 } )
    }

    deleteCard(index) {
        const cards = this.state.cards;
        const newCards = [
            ...cards.slice(0, index),
            ...cards.slice(index + 1)
        ];
        this.setState({
            cards: newCards,
            currentCardIdx : null
        });
    }

    stardEdit(key){
        // set the current card to edit
        this.setState({currentCardIdx:key})
    }

    editCard(content){
        // edit the current non video card, note we are editing the current card index
        let cidx = this.state.currentCardIdx
        let cards = this.state.cards
        cards[cidx].content= content
        this.setState( { cards : cards } )
    }

    editVidCard(link, content){
        // edit the video card, note that we are editing the current index
        let cidx = this.state.currentCardIdx
        let cards = this.state.cards
        if(link!==null)cards[cidx].link= link
        if(content!==null)cards[cidx].content= content
        this.setState( { cards : cards } )
    }

    formData(isDraft) {
        // draft is bool variable
        let tags
        if(this.state.tag_str===null) {
            tags = []
        } else {
            tags = this.state.tag_str.split(",",5).map(val=>val.trim()).filter(val=>val!=="") // derive from tag_str TODO
        }

        let title = this.state.title===null?"EMPTY TITLE":this.state.title.trim();
        let about = this.state.about===null?"EMPTY about":this.state.about.trim();
        const data = {
            ccid : this.state.ccid,
            title : title,
            about : about,
            username : this.state.username,
            draft : isDraft,
            likes : this.state.likes,
            editable : this.state.editable,
            loggedin : this.state.loggedin,
            bookmarked : this.state.bookmarked,
            tags : tags,
            content : this.state.cards
        }
        return data
    }

    saveChain() {
        //saves as draft

        let data = JSON.stringify(this.formData(true))
        let token = this.props.token
        console.log("data before sending",data)
        console.log("token before sending",token)
        const config = {
            headers : {
                "token" : token,
                // 'sameSite': 'None; Secure'
            }
        }
        // MAY RETURN INVALID TOKEN , so handle that too
        axios.post('http://localhost:8000/cc/create',data,config)
        .then(
            res => {
                console.log("called CREATE API", res.data)
                if(res.data.ccid != undefined) {
                    this.setState({ccid:res.data.ccid})
                }
            }
        ).catch(
            (error) => {
                if (error.response) {
                    console.log(error.response.data)
                } else {
                    console.log('Show error notification!')
                }
            }
        )

    }
    publishChain() {
        // e.preventDefault()
        //publishes the chain
        // after publishing redirect to the main page maybe

        let data = JSON.stringify(this.formData(false))
        let token = this.props.token
        console.log("data before sending",data)
        console.log("token before sending",token)
        const config = {
            headers : {
                "token" : token
                // 'sameSite': 'None; Secure'
            }
        }

        axios.post('http://localhost:8000/cc/create',data,config)
        .then(
            res => {
                console.log("called CREATE API", res.data)
                if(res.data.ccid != undefined) {
                    this.setState({ccid:res.data.ccid})
                }
                // console.log("USERNAMEEEE",res.data) // only token is being returned
                // // localStorage.setItem('token',res.data.token)
                // ls.set('token',res.data.token)
                // this.props.setUser(res.data.token,true)
            }
        ).catch(
            error => {
                if (error.response) {
                    // token is expired
                    this.props.setToken("null","nullUser")
                    console.log(error.response.data)
                } else {
                    console.log('Show error notification!')
                }
            }
        )
    }
    changeHandler(event) {
        let name = event.target.name
        let value = event.target.value
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    render() {
        // if logout then redirect
        if (this.props.token === "null") {
            return <Redirect to={'/login'} />
        }

        let cards = this.state.cards.map((val,key)=> {
            return (<MyCard 
            key={key}
            idx={key}
            content={val.content} 
            link={val.link}
            stardEdit={this.stardEdit.bind(this)}
            deleteCard={ ()=>{
                //need to change this state too else render not called
                //since cons initialised once
                    this.deleteCard(key)
                }
            }
             />
            );
        });

        let cidx = this.state.currentCardIdx

        return (
            <div>
            <div><button onClick={this.addCard.bind(this)}>add card</button></div>
            <div><button onClick={this.addVidCard.bind(this)}>add vid card</button></div>
            <div><button onClick={this.saveChain.bind(this)}>save draft</button></div>
            <div><button onClick={this.publishChain.bind(this)}>publish</button></div>
            <div>
                <label>Title</label>
                <input name="title" type="text" placeholder="Title"
                onChange = { this.changeHandler.bind(this) } />
            </div>
            <div>
                <label>About</label>
                <input name="about" type="text" placeholder="About"
                onChange = { this.changeHandler.bind(this) } />
            </div>
            <div>
                <label>Tags( enter comma separated values (atmost 5) ) </label>
                <input name="tag_str" type="text" placeholder="tags"
                onChange = { this.changeHandler.bind(this) } />
            </div>
            <div>The first card will be the about card</div>
            <div>All cards</div>
             <div> {cards} </div>
             {cidx !== null ?
                 <div>
                    {/* <div><PreviewCard card={this.state.cards[cidx]}/></div> */}
                    <div><EditCard card={this.state.cards[cidx]} 
                          editCard={this.editCard.bind(this)}
                          editVidCard={this.editVidCard.bind(this)}/>
                    </div>
                 </div>
                : <div> NO PREVIEW </div>
             }
            </div>
        );
    }
}


class EditCard extends React.Component {
    constructor(props){
        super(props)
    }
    updateMarkdown(link,content) {
        // this.setState({ content });
        let isVidCard = this.props.card.link === undefined ? false : true
        if (!isVidCard)this.props.editCard(content)
        else this.props.editVidCard(link,content)
    }

    componentWillMount(){
    }
    render(){
        // this.props.card is always non null
        let markdown = this.props.card.content
        let isVidCard = this.props.card.link===undefined ? false : true
        let link = this.props.card.link
        return (
        <div>

            {isVidCard ? 
            <div>
            <textarea value={link} onChange={ (e)=>{this.updateMarkdown(e.target.value,null)} } />
            </div>
            :<div></div>
            }

            <div className="input" style={inputStyle}>
                <textarea
                className="input"
                style={inputStyle}
                value={markdown}
                onChange={(e) => {
                    this.updateMarkdown(null,e.target.value);
                }}
                >
                </textarea>
            </div>

                {/*OUTPUT PREVIEW*/}

            <div
            style={outputStyle}
            dangerouslySetInnerHTML={{
                __html: marked(markdown),
            }}
            ></div>
            {isVidCard?
            <div><ReactPlayer url={link} controls={true} /></div>
            :<div></div>}
        </div>
        )
    }
    // render() {
    //     return (<div>edit card here</div>)
    // }
}


class MyCard extends React.Component{
    //actually contain the buttons
    constructor(props){
      super(props)
    }
    render(){
        let content = this.props.content
        if(!content)content='EMPTY'
        let idx = this.props.idx
        let isVidCard=this.props.link===undefined?false:true
        return (
            <div>
                <div
                dangerouslySetInnerHTML={{
                    __html: marked(content.substr(0,5)+'...'),
                }}
                ></div>
                <div>{isVidCard?<div>YES</div>:<div>NO</div>}</div>
                <div><button onClick={this.props.deleteCard}>delete</button></div>
                <div><button onClick={()=>this.props.stardEdit(idx)}>edit</button></div>
                {/* <div><button onClick={()=>this.props.save(idx)}>save</button></div> */}
            </div>
        )
    }
}


export default Create