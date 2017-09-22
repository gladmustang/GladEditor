import {EditorState} from 'draft-js';
import { Map } from 'immutable';

// var defaultState = {
//     editorState: EditorState.createEmpty()
// }
const defaultState = Map({
    editorState: EditorState.createEmpty()
});
const richEditorReducer = (state= defaultState, action) => {
    switch (action.type) {
        case 'change':
            // return {
            //     editorState: action.editorState
            // };
            return state.set("editorState", action.editorState);
        default:
            return state;
    }

};
export default richEditorReducer;
