import React , {Component} from 'React'

var Ckeditor = require('react-ckeditor-wrapper');

class CKEditor  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'content',
        }
    }

    updateContent(value) {
        this.setState({content:value})
    }

    render() {
        return (<Ckeditor
            value={this.state.content}
            onChange={this.updateContent.bind(this)} />)
    }
}

export default CKEditor;
