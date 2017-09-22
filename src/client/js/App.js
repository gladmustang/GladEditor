// /**
//  * Created by jshen103 on 9/6/2017.
//  */
// import React from 'react'
// import BootNav from './bootcss/BootNav'
// import ReactuiNav from './reactui/ReactuiNav'

// const Nav = ReactuiNav;
//
// const App = (props) => {
//     return  (
//         <div>
//             <Nav/>
//         </div>
//
//     )
// }

import React, {Component} from 'react'
import BootNav from './bootcss/BootNav'
import ReactuiNav from './reactui/ReactuiNav'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Alert from './reactui/components/Alert'

class App extends Component {
    render(){
        const footerStyle = {
            position: 'fixed',
            bottom: 0,
            width: '100%',
            height: 40,
            lineHeight: '40px',
            backgroundColor: 'black',
        };
        const linkStyle={
            color: 'white',
            textDecoration: 'none',
            marginLeft: 50
        }
        var {store} = this.props;
        return (
            <Provider store={store}>
                <Router>
                    <div>
                        <Route  exact path="/gladmustang" component={ReactuiNav} />
                        <Route path="/gladmustang/bootnav" component={BootNav} />
                        <div style={footerStyle}>
                            <Link style={linkStyle} to="/gladmustang/bootnav">Boot CSS</Link>
                            <Link style={linkStyle} to="/gladmustang">React UI</Link>
                        </div>
                        <Alert/>
                    </div>
                </Router>
            </Provider>
        )
    }

}

// const App = ({ store }) => {
//
//
//     return (
//         <Provider store={store}>
//             <Router>
//                 <div>
//                     <Route  exact path="/gladmustang" component={ReactuiNav} />
//                     <Route path="/gladmustang/bootnav" component={BootNav} />
//                     <div style={footerStyle}>
//                         <Link style={linkStyle} to="/gladmustang/bootnav">Boot CSS</Link>
//                         <Link style={linkStyle} to="/gladmustang">React UI</Link>
//                     </div>
//                     <ToastContainer ref="msgTips"
//                                     toastMessageFactory={ToastMessageFactory}
//                                     className="toast-top-right"
//                                     preventDuplicates="true" />
//                 </div>
//             </Router>
//         </Provider>
//     )
// }

App.propTypes = {
    store: PropTypes.object.isRequired
}

export default App;

