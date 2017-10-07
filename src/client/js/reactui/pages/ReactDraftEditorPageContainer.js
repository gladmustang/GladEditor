import ReactDraftEditorPage from "./ReactDraftEditorPage"
import {connect} from "react-redux"
import {success, warning, error} from '../components/Alert'

var mapStateToProps = (state, ownProps)=> {
    return {
        editorState: state.get("draftEditorReducer").get("editorState")
    }
}

var mapDispatchToProps = (dispatch)=>{
    return {
        gitPush: ()=>{
            fetch("./gitOps/gitPush",{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "GET",
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if(data.code==0) {
                    success("Save docs to git success!");
                    console.log(data.msg);
                } else {
                    error(data.error);
                    console.log(data.error);
                }

            }).catch(function(e) {
                console.log(e);
                console.log("Oops, error");
            });
        }
    }
}

var ReactDraftEditorPageContainer = connect (
    mapStateToProps,
    mapDispatchToProps
)(ReactDraftEditorPage);

export default ReactDraftEditorPageContainer;
