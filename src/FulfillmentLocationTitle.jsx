import React from 'react';
import PropTypes from 'prop-types';

export default class FulfillmentLocationTitle extends React.Component {

    style(styles) {
        if (this.props.disableInlineStyles) {
            return undefined;
        }
        return styles;
    }

    render() {

        let loc = this.props.location;

        return (
            <div className="cmpr-fl-title">
                <div className="clearfix" style={this.style({position: "relative", marginBottom: "10px"})}>
                    <div className="pull-left">
                        <div className="cmpr-fl-title-caption">Fulfiller</div>
                        <h3 className="card-title" style={this.style({display: "inline"})}>
                            {loc.FulfillerName}
                        </h3>
                    </div>
                    <div className="pull-left">
                        <div className="cmpr-fl-title-caption">&nbsp;</div>
                        <h3 style={this.style({display: "inline"})}>
                            &nbsp;
                            &bull;
                            &nbsp;
                        </h3>
                    </div>
                    <div className="pull-left">
                        <div className="cmpr-fl-title-caption">Location</div>
                        <h3 style={this.style({display: "inline"})}>
                            {loc.FulfillmentLocationName}
                        </h3>
                    </div>
                    <div className="pull-right cmpr-fr-title-ids"
                         style={this.style({position: "absolute", right: "0px", bottom: "4px"})}>
                        <div>
                            <span className="cmpr-fl-title-caption">Fulfiller:&nbsp;</span>
                            {loc.FulfillerId}
                            {this.props.showInternalIds
                                ? <span
                                    className="text-muted">&nbsp;/&nbsp;{loc.InternalFulfillerId}</span>
                                : null}
                        </div>
                        <div>
                            <span className="cmpr-fl-title-caption">Location:&nbsp;</span>
                            {loc.FulfillmentLocationId}
                            {this.props.showInternalIds
                                ? <span
                                    className="text-muted">&nbsp;/&nbsp;{loc.InternalFulfillmentLocationId}</span>
                                : null}
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        )
    }
}

FulfillmentLocationTitle.propTypes = {
    onClick: PropTypes.func,
    location: PropTypes.object.isRequired,
    showInternalIds: PropTypes.bool,
    disableInlineStyles: PropTypes.bool
};

FulfillmentLocationTitle.defaultProps = {
    showInternalIds: true,
    disableInlineStyles: false
};
