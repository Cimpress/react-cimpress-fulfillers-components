'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class FulfillmentLocationField extends React.Component {

    renderInternal(id) {
        if ( !this.props.showInternalIds ) {
            return null;
        }
        return (<span>
            <span className="text-muted">({id})</span>&nbsp;
            </span>
        )
    }

    renderFulfillerId(loc) {
        if ( !this.props.showFulfiller ) {
            return null;
        }

        return (
            <span>Fulfiller ID:&nbsp;<strong>{loc.FulfillerId}</strong>
                &nbsp;{this.renderInternal(loc.InternalFulfillerId)}</span>
        )
    }

    renderFulfillmentLocationId(loc) {
        if ( !this.props.showFulfillmentLocation ) {
            return null;
        }

        return (
            <span>Location ID:&nbsp;<strong>{loc.FulfillmentLocationId}</strong>
                &nbsp;{this.renderInternal(loc.InternalFulfillmentLocationId)}
                </span>
        )
    }

    render() {

        let loc = this.props.location;
        let title = loc.FulfillerName + " \u2022 " + loc.FulfillmentLocationName;
        if ( this.props.showFulfiller || this.props.showFulfillmentLocation ) {
            if ( !this.props.showFulfiller ) {
                title = loc.FulfillmentLocationName;
            }
            if ( !this.props.showFulfillmentLocation ) {
                title = loc.FulfillerName;
            }
        } else {
            title = '!misconfigured!';
        }

        return (
            <div className="form-group form-group-active cimpress-fl-item">
                <span className="input-group" style={{cursor: "pointer"}}>
                    <label className="control-label" htmlFor="disabledInput" style={{cursor: "pointer"}}>
                        {this.renderFulfillerId(loc)}
                        {this.props.showFulfiller && this.props.showFulfillmentLocation
                            ? <span>&nbsp;&bull;&nbsp;</span>
                            : null}
                        {this.renderFulfillmentLocationId(loc)}
                    </label>
                    <input onClick={this.props.onClick} className="form-control" id="disabledInput" type="text"
                           style={{cursor: "pointer"}}
                           readOnly={true} value={title}/>
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-default" onClick={this.props.onClick}>
                            <i className="fa fa-map-marker"></i>&nbsp;{this.props.buttonCaption}
                        </button>
                    </span>
                </span>
            </div>
        )
    }
}

FulfillmentLocationField.propTypes = {
    onClick: PropTypes.func,
    location: PropTypes.object.isRequired,
    buttonCaption: PropTypes.string,
    showInternalIds: PropTypes.bool,
    showFulfiller: PropTypes.bool,
    showFulfillmentLocation: PropTypes.bool
};

FulfillmentLocationField.defaultProps = {
    buttonCaption: 'Change...',
    showInternalIds: true,
    showFulfiller: true,
    showFulfillmentLocation: true
};