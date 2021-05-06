import React from "react";
import axios from 'axios';
import {Link} from "react-router-dom";


/*
hard coded categories fetched from the database so that the user can explore the tags
*/

class Categories extends React.Component{
    //actually contain the buttons
    constructor(props){
      super(props)
      this.state = {
        data : []
      }
    }

    componentDidMount() {
        axios.get(`http://${process.env.REACT_APP_SERVER_URL}/category`)
        .then(
            res => {
                console.log("called category API", res.data)
                this.setState({data : res.data})
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
    
    render(){
        let data = this.state.data
        console.log(data)
        let component_tags = data.map((val, key) => {
            return (
                <CategoryCard
                key={key}
                data={val}
                />
            )
        })
        return (
            <div>
                <div>
                    Some tags on the most common categories, more to be added soon.
                </div>
                <div>
                Categories
                {component_tags}
                </div>
            </div>
        )
    }
}


class CategoryCard extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        let category_title = this.props.data.category
        let tags = this.props.data.tags.map((val, key)=>{
            let link = (
            <Link to={`/cc?tag=${val}`}>
                {val}
            </Link>
            )

            return (
                <div>{link}</div>
            )
        })

        return (
            <div>
                <div>CATEGORY : {category_title} </div>
                <div>TAGs : {tags}</div>
            </div>
        )
    }
}

export default Categories

