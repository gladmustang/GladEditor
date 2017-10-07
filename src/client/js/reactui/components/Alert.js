import React, {Component} from 'react'
import {ToastContainer, ToastMessage } from "react-toastr"

var success = (successMsg)=>{
    window.msgContainer.success(
        "",
        successMsg, {
            timeOut: 3000,
            extendedTimeOut: 3000
        });
}


var warning = (warnMsg)=>{
    window.msgContainer.warning(
        "",
        warnMsg, {
            timeOut: 3000,
            extendedTimeOut: 3000
        });
}
var error = (errorMsg)=>{
    window.msgContainer.error(
        "",
        errorMsg, {
            timeOut: 3000,
            extendedTimeOut: 3000
        });
}

var tip = (tipMsg)=>{
    window.tipContainer.success(
        "",
        tipMsg, {
            timeOut: 5000,
            extendedTimeOut: 5000,
            closeButton: true
        });
}

class Alert extends Component {
    render(){
        var ToastMessageFactory = React.createFactory(ToastMessage.animation);
        return (
            <div>
                <ToastContainer  ref={(input) => {window.msgContainer = input;}}
                                 toastMessageFactory={ToastMessageFactory}
                                 className="toast-top-right"
                />
                <ToastContainer  ref={(input) => {window.tipContainer = input;}}
                                 toastMessageFactory={ToastMessageFactory}
                                 className="toast-top-center"
                />
            </div>

        )
    }
}

export default Alert;
export {success, warning, error, tip};


