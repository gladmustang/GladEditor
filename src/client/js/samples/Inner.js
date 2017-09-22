import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
var fetch = require('isomorphic-fetch');

class Inner extends Component {
    // constructor(props){
    //     super(props);
    // }
    render() {
        console.log(this.context.store.getState().innerReducer.value);
        const {value, innerClick} = this.props;
        return (<h2 onClick={innerClick}>This is inner {value}</h2>)
    }
}

Inner.contextTypes = { //must set contextTypes if you want to get store from redux
    store: PropTypes.object
}

var defaultState = {
    value: 2,
}
const innerReducer = (state= defaultState, action) => {
    switch (action.type) {
        case 'IncreaseInner':
            return {
                value: state.value +2,
            };
        default:
            return state;
    }

};

const mapStateToProps = (state, ownProps) => {
    console.log(state);
    // 1. must return a new state
    // 2. only need to return the state part of current reducer
    // 3. the combined reducer will automatically combine the state
    return {
        value: state.innerReducer.value
    }
}

const mapDispatchToProps = (
    dispatch,
    ownProps ) => {
    return {
        innerClick: () => {
            fetchPosts(dispatch);
        }
    };
}

function fetchPosts(dispatch) {
    fetch('https://api.github.com/')
        .then(response => response.json())
        .then(json => {
            console.log(json);
            dispatch({
                type: 'IncreaseInner'
            })
        });
}


const InnerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Inner);

export default InnerContainer;
export {innerReducer};