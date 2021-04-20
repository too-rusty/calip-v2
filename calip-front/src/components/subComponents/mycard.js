import React from "react";

let marked = require("marked");

class MyCard extends React.Component{
    //actually contain the buttons
    constructor(props){
      super(props)
    }
    render(){
        let content = this.props.content
        if(!content)content='EMPTY'
        let idx = this.props.idx
        let isVidCard=this.props.link===undefined || this.props.link===""?false:true
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

export default MyCard

