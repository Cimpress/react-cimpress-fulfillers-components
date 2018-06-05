import React from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';
import Tooltip from '@cimpress/react-components/lib/Tooltip';

import {getI18nInstance} from './i18n';
import {translate} from 'react-i18next';

class FulfillmentLocationsListItem extends React.Component {

    constructor(props) {
        super(props);
    }

    onSelected() {
        if (this.props.onClick) {
            this.props.onClick(this.props.location)
        }
    }

    highlight(target) {
        if (!this.props.highlight) {
            return target;
        }

        return (
            <Highlighter
                highlightClassName={"highlight"}
                highlightStyle={this.style({backgroundColor: "yellow", padding: "0px", color: "black"})}
                searchWords={[this.props.highlight]}
                textToHighlight={target + ''}
            />
        );
    }

    style(styles) {
        if (this.props.disableInlineStyles) {
            return undefined;
        }
        return styles;
    }

    renderInternalId(id) {
        if (!this.props.showInternalIds) {
            return null;
        }
        return (<em className="text-muted">({this.highlight(id)})</em>)
    }

    renderTitle(loc, hasFulfiller) {
        if (this.props.customTitleRenderer) {
            return this.props.customTitleRenderer(loc);
        }

        if (!this.props.onClick) {
            return (
                <h5 style={this.style({verticalAlign: "middle"})}>
                    {this.props.isRecent 
                        ? <Tooltip contents={this.tt("recent-location")} direction={"top"}><i className="fa fa-clock-o"></i></Tooltip>
                        : <i className="fa fa-map-marker"></i>}
                    <span>&nbsp;</span>
                    {hasFulfiller
                        ? <span>{this.highlight(loc.FulfillerName)}&nbsp;&bull;&nbsp;</span>
                        : null}
                    <strong>{this.highlight(loc.FulfillmentLocationName)}</strong>
                </h5>
            );
        }

        return (
            <h5 onClick={this.onSelected.bind(this)}
                style={this.style({cursor: "pointer", verticalAlign: "middle"})}>
                {this.props.isRecent 
                    ? <Tooltip contents={this.tt("recent-location")} direction={"top"}><i className="fa fa-clock-o"></i></Tooltip>
                    : <i className="fa fa-map-marker"></i>}
                <span>&nbsp;</span>
                <a>
                    {hasFulfiller
                        ? <span>{this.highlight(loc.FulfillerName)}&nbsp;&bull;&nbsp;</span>
                        : null}
                    <strong>{this.highlight(loc.FulfillmentLocationName)}</strong>
                </a>
            </h5>
        )
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {

        let loc = this.props.location;
        let hasFulfiller = loc.FulfillerId && (loc.FulfillerId != -1);
        let hasFulfillmentLocation = loc.FulfillmentLocationId && (loc.FulfillmentLocationId != -1);

        return (
            <tr className="cimpress-fl-list-item">
                <td width="100%">
                    {this.renderTitle(loc, hasFulfiller)}
                </td>
                {this.props.showFulfillmentLocationId
                    ? (
                        <td style={this.style({color: "#333943", verticalAlign: "middle"})}>
                            {hasFulfillmentLocation
                                ? (<span>{this.highlight(loc.FulfillmentLocationId)}&nbsp;
                                    {this.renderInternalId(loc.InternalFulfillmentLocationId)}</span>)
                                : <span>&nbsp;</span>}
                        </td>
                    )
                    : null}
                {this.props.showFulfillerId
                    ? (
                        <td style={this.style({color: "#333943", verticalAlign: "middle"})}>
                            {hasFulfiller
                                ? (<span>{this.highlight(loc.FulfillerId)}&nbsp;
                                    {this.renderInternalId(loc.InternalFulfillerId)}</span>)
                                : <span>&nbsp;</span>}
                        </td>
                    )
                    : null}
                {this.props.additionalColumnRenderer
                    ? (
                        <td style={this.style({color: "#333943", verticalAlign: "middle", textAlign: "center"})}>
                            {this.props.additionalColumnRenderer(loc)}
                        </td>
                    )
                    : null}
            </tr>
        )
    }
}

FulfillmentLocationsListItem.propTypes = {
    onClick: PropTypes.func,
    highlight: PropTypes.string,
    location: PropTypes.object.isRequired,
    disableInlineStyles: PropTypes.bool,
    showInternalIds: PropTypes.bool,
    showFulfillerId: PropTypes.bool,
    showFulfillmentLocationId: PropTypes.bool,
    additionalColumnRenderer: PropTypes.func,
    customTitleRenderer: PropTypes.func,
    isRecent: PropTypes.bool,
    language: PropTypes.string,
};

FulfillmentLocationsListItem.defaultProps = {
    disableInlineStyles: false,
    showInternalIds: true,
    showFulfillerId: true,
    showFulfillmentLocationId: true,
    additionalColumnRenderer: undefined,
    customTitleRenderer: undefined,
    isRecent: false,
    language: 'eng'
};

export default translate('translations', {i18n: getI18nInstance()})(FulfillmentLocationsListItem);

