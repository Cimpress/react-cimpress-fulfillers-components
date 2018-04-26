import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PropInfo extends Component {
    render() {
        return (
            <tr>
                <td>
                    <code>{this.props.name}</code>
                </td>
                <td>{this.props.type}</td>
                <td>{this.props.default}</td>
                <td>{this.props.description}</td>
            </tr>
        );
    }
}

PropInfo.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    default: PropTypes.string.isRequired,
    description: PropTypes.node
};
