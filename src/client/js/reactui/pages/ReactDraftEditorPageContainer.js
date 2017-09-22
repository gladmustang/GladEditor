import ReactDraftEditorPage from "./ReactDraftEditorPage"
import {connect} from "react-redux"

var mapStateToProps = (state, ownProps)=> {
    return {
        editorState: state.get("draftEditorReducer").get("editorState")
    }
}

var mapDispatchToProps = (dispatch)=>{
    return {
    }
}

var ReactDraftEditorPageContainer = connect (
    mapStateToProps,
    mapDispatchToProps
)(ReactDraftEditorPage);

export default ReactDraftEditorPageContainer;
