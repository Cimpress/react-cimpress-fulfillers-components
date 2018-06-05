import React from 'react';
import PropTypes from 'prop-types';

import {getI18nInstance} from './i18n';
import {translate} from 'react-i18next';

class FulfillmentLocationField extends React.Component {

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
            <span>{this.tt('fulfiller-id')}:&nbsp;<strong>{loc.FulfillerId}</strong>
                &nbsp;{this.renderInternal(loc.InternalFulfillerId)}</span>
        )
    }

    renderFulfillmentLocationId(loc) {
        if ( !this.props.showFulfillmentLocation ) {
            return null;
        }

        return (
            <span>{this.tt('location-id')}:&nbsp;<strong>{loc.FulfillmentLocationId}</strong>
                &nbsp;{this.renderInternal(loc.InternalFulfillmentLocationId)}
                </span>
        )
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
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
                            <i className="fa fa-map-marker"></i>&nbsp;{this.props.buttonCaption
                            ? this.props.buttonCaption
                            : this.tt('field-btn-caption')}
                        </button>
                    </span>
                </span>
            </div>
        )
    }
}

FulfillmentLocationField.propTypes = {
    onClick: PropTypes.func,
    language: PropTypes.string,
    location: PropTypes.object.isRequired,
    buttonCaption: PropTypes.string,
    showInternalIds: PropTypes.bool,
    showFulfiller: PropTypes.bool,
    showFulfillmentLocation: PropTypes.bool
};

FulfillmentLocationField.defaultProps = {
    language: 'eng',
    showInternalIds: true,
    showFulfiller: true,
    showFulfillmentLocation: true
};

export default translate('translations', {i18n: getI18nInstance()})(FulfillmentLocationField);