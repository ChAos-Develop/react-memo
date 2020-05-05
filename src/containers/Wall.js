import React, { Component } from 'react';
import { Home } from 'containers';

class Wall extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Home username={this.props.match.params.username} />
        );
    }
    
}

export default Wall;