/**
 * Created by jshen103 on 9/6/2017.
 */
import React from 'react'
import { connect } from 'react-redux'
import InnerContainer from './Inner'


const Counter = (props) => {
    const {value, onIncrement} = props;
    return  (
        <div>
            <h1 onClick={onIncrement}>{value}</h1>
            <InnerContainer/>
        </div>

    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        value: state.countReducer.value
    }
}

const mapDispatchToProps = (
    dispatch,
    ownProps ) => {
    return {
        onIncrement: () => {
            dispatch({
                type: 'Increase'
            });
        }
    };
}

var defaultState = {
    value: -1,
}
const countReducer = (state= defaultState, action) => {
    switch (action.type) {
        case 'Increase':
            return {
                value: state.value +2,
            };
        default:
            return state;
    }

};

const CounterContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)

export {CounterContainer, countReducer};
