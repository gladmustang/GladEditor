import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';


class EditorToolBar extends Component {

    render() {
        return (
            <Toolbar style={{backgroundColor: 'white'}}>
                <ToolbarGroup firstChild={true}>
                    <TextField style={{marginLeft: 50, minWidth: 800}}
                        hintText="Document Title"
                        value={this.props.currentItemName}
                        onChange={this.props.handleChange}
                    />
                </ToolbarGroup>
                <ToolbarGroup>
                    <RaisedButton label="Save Document" primary={true} onClick={()=>{this.props.saveDoc(this.props)}}/>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default EditorToolBar;
