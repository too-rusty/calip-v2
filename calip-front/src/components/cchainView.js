import React from "react";
import ReactPlayer from 'react-player'
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
        super(props)
        this.state={
        cc : this.props.chain.content, // the actual card chain content
        cidx : null
        }
        console.log("cchainview content", this.cc)
    }
    setCard(idx){
        this.setState({cidx:idx})
    }
    render () {
        if(this.state.cc === null || this.state.cc === undefined) {
            return (
                <div>No cards to view, thats why users should use atleast one card</div>
            )
        }
        // console.log("finallu",this.state)

        let cards = this.state.cc.map((val,key)=> {
        return (<ShortViewCard 
        key={key}
        idx={key}
        content={val.content} 
        link={val.link}
        setCard={this.setCard.bind(this)} />)
        });
        // ok so the above is the short version of all the cards
        let cidx = this.state.cidx
        return (
            <div>
            <div>THIS IS THE CCHAINVIEW</div>
            <div>{cards}</div>
            {cidx !== null ?
                <div>
                {/* <div><PreviewCard card={this.state.cards[cidx]}/></div> */}
                <div>
                <DetailViewCard card={this.state.cc[cidx]}/>
                </div>
                </div>
            : <div> NO PREVIEW, click a card to view </div>
            }
            <div>{cards.length===0?"WOOPS! no card":""}</div>
            </div>
        )
    }

}

class DetailViewCard extends React.Component {
    constructor(props){
        super(props)
        console.log("logging card",this.props)
    }
    render() {
        let markdown = this.props.card.content
        
        let isVidCard = this.props.card.link==='' ? false : true
        let link = this.props.card.link
        return (
            <div>
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
}


class ShortViewCard extends React.Component{
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
                <div><button onClick = {()=> this.props.setCard(idx)} > Card {idx+1} </button></div>
                {/* <div><button onClick={()=>this.props.save(idx)}>save</button></div> */}
            </div>
        )
    }
}

/*
the overview is this

there is a main component which contains all the cards in a short view

then there is a single card called the long view

now the component passes the function 




*/


export default CChainView