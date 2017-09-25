
const handleDocNameChange = event => (dispatch, getState) => {
    dispatch({
        type: 'changeCurrentItemName',
        currentItemName: event.target.value
    });
}

export {handleDocNameChange};
