import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Memo } from 'components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class MemoList extends Component {

    static defaultProps = {
        data: [],
        currentUser: '',
        onEdit: (id, index, contents) => { console.error('edit function not defined') },
        onRemove: (id, index) => { console.error('remove function not defined') },
        onStar: (id, index) => { console.error('star function not defined') }
    }

    static propTypes = {
        data: PropTypes.oneOfType([
            PropTypes.instanceOf(Array),
            PropTypes.instanceOf(Immutable.Iterable)
        ]),
        currentUser: PropTypes.string,
        onEdit: PropTypes.func,
        onRemove: PropTypes.func,
        onStar: PropTypes.func
    }

    shouldComponentUpdate(nextProps, nextState) {
        const update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
        return update;
    }

    render() {

        console.log('MemoList render method executed');

        const mapToComponents = (data) => {
            return data.map((memo, i) => {
                return (
                    <CSSTransition
                        key={memo._id}
                        classNames="memo"
                        timeout={
                            { enter: 2000, exit: 1000 }
                        }
                    >
                        <Memo data={memo}
                            ownership={(memo.writer === this.props.currentUser)}
                            key={memo._id}
                            index={i}
                            currentUser={this.props.currentUser}
                            onEdit={this.props.onEdit}
                            onRemove={this.props.onRemove}
                            onStar={this.props.onStar}
                        />
                    </CSSTransition>
                );
            });
        }

        return (
            <div>
                <TransitionGroup>
                    { mapToComponents(this.props.data) }
                </TransitionGroup>
            </div>
        );
    }
}

export default MemoList;