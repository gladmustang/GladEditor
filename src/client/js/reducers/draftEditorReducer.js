import { Map } from 'immutable';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

const defaultState = Map({
    editorState: EditorState.createEmpty()
});
const draftEditorReducer = (state= defaultState, action) => {
    switch (action.type) {
        case 'onEditorStateChange':
            return state.set('editorState', action.editorState);
        default:
            return state;
    }

};
export default draftEditorReducer;
