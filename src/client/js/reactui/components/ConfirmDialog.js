import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class ConfirmDialog extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleCancel = () => {
        this.setState({open: false});
    };

    handleClose = () => {
        this.setState({open: false});
        fetch("./closeApp").then(function(response) {
            return response.json();
        }).then(function(data) {
            if(data.code==0) {
                console.log(data);
            } else {
                console.log(data.error);
            }

        }).catch(function(e) {
            // alert("App stopped, will close the window !");
            console.log("Oops, error");
            window.opener=null;
            window.close();
        });
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleCancel}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                // disabled={true}
                onClick={this.handleClose}
            />,
        ];

        return (
            <div>
                <IconButton iconClassName="fa fa-times" onClick={this.handleOpen} iconStyle={{color: 'white'}}/>
                <Dialog
                    title="Close App"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    Are you sure to close the editor ?
                </Dialog>
            </div>
        );
    }
}
