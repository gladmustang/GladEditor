// import {combineReducers} from 'redux';
import {combineReducers } from 'redux-immutable';
// import editorPageReducer from './editorPageReducer'
import richEditorReducer from './richEditorReducer'
import docsTreeReducer from './docsTreeReducer'
import draftEditorReducer from './draftEditorReducer'
var reducer = combineReducers({
    // editorPageReducer,
    richEditorReducer,
    docsTreeReducer,
    draftEditorReducer
})


export default reducer;

