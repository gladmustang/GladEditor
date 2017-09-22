import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux';
import App from './App';
import { Provider } from 'react-redux'
import reducer from "./reducers/reduxReducerRegistry"
import "font-awesome/css/font-awesome.min.css"
import "../css/index.css"
import "../css/animate.css"
import "../css/toastr2.1.3..min.css"


const store = createStore(reducer);

const render = () => {
    ReactDOM.render(
        <App  store={store} />,
        document.getElementById('root')
    );
};
render();

if (module.hot) {
   module.hot.accept();
}
