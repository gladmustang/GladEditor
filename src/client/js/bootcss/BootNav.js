import React, {Component} from 'react'
import {
    Route,
    Link
} from 'react-router-dom'

import RichEditor from "../samples/RichEditor"
import "bootstrap/dist/css/bootstrap.min.css"

class BootNav extends Component {
    constructor(props) {
        super(props);
        this.clickItem = this.clickItem.bind(this);
        this.state={
            activeUrl: "/"
        };
    }
    clickItem (url) {
        if(this.state.activeUrl!=url) {
            this.setState({activeUrl:url});
        }

    }
    render() {
        return (
                <div>
                    <nav className="navbar navbar-inverse">
                        <div className="container">
                            <ul className="nav nav-pills">
                                <li role="presentation" className={this.state.activeUrl=="/"?"active":""} onClick={(e)=> this.clickItem('/')}>
                                    <Link to={`${this.props.match.url}/`}>Editor</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div id="content">
                        <Route path={`${this.props.match.url}/`} component={RichEditor}/>
                    </div>

                </div>
        );
    }
}

export default BootNav;
