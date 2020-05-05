import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import koLanguage from 'react-timeago/lib/language-strings/ko'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import sanitizer from 'sanitizer';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import Parser from 'html-react-parser';

class Memo extends Component {

    constructor(props) {
        super(props);

        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleStar = this.handleStar.bind(this);
    }

    state = {
        memoState: Map({
            editMode: false,
            value: this.props.data.contents
        })
    }

    static defaultProps = {
        data: {
            _id: 'id1234567890',
            writer: 'Writer',
            contents: 'Contents',
            is_edited: false,
            date: {
                edited: new Date(),
                created: new Date()
            },
            starred: []
        },
        ownership: true,
        index: -1,
        currentUser: '',
        onEdit: (id, index, contents) => { console.error('edit function is not defined'); },
        onRemove: (id, index) => { console.error('remove function is not defined'); },
        onStar: (id, index) => { console.error('star function is not defined'); }
    }

    static propTypes = {
        data: PropTypes.object,
        ownership: PropTypes.bool,
        index: PropTypes.number,
        currentUser: PropTypes.string,
        onEdit: PropTypes.func,
        onRemove: PropTypes.func,
        onStar: PropTypes.func
    }

    toggleEdit() {
        const { data, index } = this.props;
        const { memoState } = this.state;
        
        if (memoState.get('editMode')) {
            const id = data._id;
            //const contents = memoState.get('value');
            const contents = this.editorRef.getInstance().getHtml();

            this.props.onEdit(id, index, contents)
                .then(() => {
                    this.setState({
                        memoState: memoState.set('editMode', !memoState.get('editMode'))
                    });
                })
        } else {
            this.setState({
                memoState: memoState.set('editMode', !memoState.get('editMode'))
            });
        }
        
    }

    handleChange(e) {
        const { memoState } = this.state;
        this.setState({
            memoState: memoState.set('value', e.target.value)
        });
    }

    handleRemove() {
        const id = this.props.data._id;
        const index = this.props.index;
        this.props.onRemove(id, index);
    }

    handleStar() {
        const id = this.props.data._id;
        const index = this.props.index;
        this.props.onStar(id, index);
    }

    componentDidUpdate() {
        // WHEN COMPONENT UPDATE INITIALIZE DROPDOWN
        // TRIGGERED WHEN LOGGED IN
        $('#dropdown-button-' + this.props.data._id).dropdown({
            belowOrigin: true // Displays dropdown below the button
        });

        const { memoState } = this.state;

        // if(memoState.get('editMode')) {
        //     // Trigger key up event to the edit input so that it auto-resizes (Materializecss Feature)
        //     $(this.input).keyup();
        // }
    }

    componentDidMount() {
        // WHEN COMPONENT MOUNT, INITIALIZE DROPDOWN
        // TRIGGERED WHEN LOGGED IN
        $('#dropdown-button-' + this.props.data._id).dropdown({
            belowOrigin: true // Displays dropdown below the button
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const current = {
            props: this.props,
            state: this.state
        };

        const next = {
            props: nextProps,
            state: nextState
        };

        const update = JSON.stringify(current) !== JSON.stringify(next);
        return update
    }

    render() {
        console.log('memo rerender');

        const { data, ownership, currentUser } = this.props;
        const { memoState } = this.state;
        const contents = sanitizer.unescapeEntities(data.contents);

        const dropDownMenu = (
            <div className="option-button">
                <a className="dropdown-button"
                    id={`dropdown-button-${data._id}`}
                    data-activates={`dropdown-${data._id}`}>
                    <i className="material-icons icon-button">more_vert</i>
                </a>
                <ul id={`dropdown-${this.props.data._id}`} className="dropdown-content">
                    <li><a onClick={this.toggleEdit}>Edit</a></li>
                    <li><a onClick={this.handleRemove}>Remove</a></li>
                </ul>
            </div>
        );

        const editedInfo = (
            <span style={{color: '#AAB5BC'}}> · Edited <TimeAgo date={this.props.data.date.edited} live={true} formatter={buildFormatter(koLanguage)} /></span>
        );

        // IF IT IS STARRED ( CHECKS WHETHER THE NICKNAME EXISTS IN THE ARRAY )
        // RETURN STYLE THAT HAS A YELLOW COLOR
        const starStyle = (data.starred.indexOf(currentUser) > -1) ? { color: '#ff9980' } : {} ;

        const memoView = (
            <div className="card">
                <div className="info">
                    <Link to={`/wall/${data.writer}`} className="username">{data.writer}</Link> wrote a · <TimeAgo date={data.date.created} formatter={buildFormatter(koLanguage)} />
                    { data.is_edited ? editedInfo : undefined }
                    { ownership ? dropDownMenu : undefined }
                </div>
                <div className="card-content">
                    {/* { Parser(contents) } */}

                    <Viewer
                        previewStyle="vertical"
                        height="400px"
                        initialEditType='wysiwyg'
                        initialValue={contents}
                    />
                </div>
                <div className="footer">
                    <i className="material-icons log-footer-icon star icon-button"
                        style={starStyle}
                        onClick={this.handleStar} >
                        star
                    </i>
                    <span className="star-count">{data.starred.length}</span>
                </div>
            </div>
        );

        const editView = (
            <div className="write">
                <div className="card">
                    <div className="card-content">
                        <Editor
                            ref={ ref => { this.editorRef = ref } }
                            previewStyle="vertical"
                            height="400px"
                            initialEditType="wysiwyg"
                            initialValue={contents}
                            //events={{load: () => {}}}
                        />
                        {/* <textarea
                            ref={ ref => { this.input = ref }}
                            className="materialize-textarea"
                            onChange={this.handleChange}
                            value={memoState.get('value')}></textarea> */}
                    </div>
                    <div className="card-action">
                        <a onClick={this.toggleEdit}>OK</a>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="container memo">
                { memoState.get('editMode') ? editView : memoView }
            </div>
        );
    }
}

export default Memo;