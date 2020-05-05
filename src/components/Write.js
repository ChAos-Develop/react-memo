import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

class Write extends Component {

    static defaultProps = {
        onPost: (contents) => {
            console.error('post function not defined');
        }
    }

    static propTypes = {
        onPost: PropTypes.func
    }

    state = {
        contents: ''
    };

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    handleChange(e) {
        this.setState({
            contents: e.target.value
        });
    }

    handlePost() {
        //const contents = this.state.contents;
        const contents = this.editorRef.getInstance().getHtml();

        this.props.onPost(contents).then(() => {
            this.editorRef.getInstance().reset();
            this.setState({
                contents: ''
            });
        });
    }

    render() {
        return(
            <div className="container write">
                <div className="card">
                    <div className="card-content">
                        <Editor
                            previewStyle="vertical"
                            height="250px"
                            initialEditType="wysiwyg"
                            placeholder="Write down your memo"
                            ref={ ref => { this.editorRef = ref } }
                        />
                        {/* <textarea className="materialize-textarea"
                            placeholder="Write down your memo"
                            value={this.state.contents}
                            onChange={this.handleChange}></textarea> */}
                    </div>
                    <div className="card-action">
                        <a onClick={this.handlePost}>Post</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Write;