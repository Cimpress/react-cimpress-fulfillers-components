import React from 'react';
import PropTypes from 'prop-types';
import FulfillmentLocationsListItem from './FulfillmentLocationsListItem';
import Alert from '@cimpress/react-components/lib/Alert';
import TextField from '@cimpress/react-components/lib/TextField';

import { getI18nInstance } from './i18n';
import { translate } from 'react-i18next';

class FulfillmentLocationsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchNeedle: this.props.searchString,
            pageToRender: 1
        };
    }

    isLocationMatching(location) {
        if ( !this.state.searchNeedle ) {
            return true;
        }

        const searchFor = this.state.searchNeedle.toLowerCase();
        return (location.FulfillerName.toLowerCase()
            .indexOf(searchFor) !== -1)
            || (location.FulfillmentLocationName.toLowerCase()
                .indexOf(searchFor) !== -1)
            || ((location.FulfillerId + '').indexOf(searchFor) !== -1)
            || ((location.InternalFulfillerId + '').indexOf(searchFor) !== -1)
            || ((location.FulfillmentLocationId + '').indexOf(searchFor) !== -1)
            || ((location.InternalFulfillmentLocationId + '').indexOf(searchFor) !== -1);
    }

    onPageClicked(page) {
        this.setState({
            pageToRender: page
        })
    }

    renderHeader() {
        if ( !this.props.showHeader ) {
            return null;
        }

        return (<thead>
        <tr className="cimpress-fl-list-header">
            <th style={{ whiteSpace: "nowrap" }}>{this.tt('name')}</th>
            {this.props.showFulfillmentLocationId
                ? (<th style={{ whiteSpace: "nowrap" }}>{this.tt('location-id')}</th>)
                : null}
            {this.props.showFulfillerId
                ? (<th style={{ whiteSpace: "nowrap" }}>{this.tt('fulfiller-id')}</th>)
                : null}
            {this.props.additionalColumnTitle
                ? (<th>{this.props.additionalColumnTitle}</th>)
                : null}
        </tr>
        </thead>);
    }

    style(styles) {
        if ( this.props.disableInlineStyles ) {
            return undefined;
        }
        return styles;
    }

    renderLocationsList(locations, recentLocations) {
        const allLocations = recentLocations
            ? recentLocations
                .map(recentLocation => (Object.assign({}, recentLocation, { IsRecent: true })))
                .concat(locations)
            : locations;

        let locationsToRender = allLocations;
        let paging = null;

        const length = recentLocations
            ? recentLocations.length + locations.length
            : locations.length;

        if ( length >= this.props.maxItemsToShowAtOnce ) {
            if ( !this.props.showPartialResult ) {
                // We cannot render "that many" locations
                return this.renderFilteringHelp(allLocations);
            }

            // Ok, we have too many... let's partially render
            let start = (this.state.pageToRender - 1) * this.props.maxItemsToShowAtOnce;
            locationsToRender = allLocations.slice(start, start + this.props.maxItemsToShowAtOnce);
            let hasPrev = start > 0;
            let hasNext = start + this.props.maxItemsToShowAtOnce < allLocations.length;
            if ( hasPrev || hasNext ) {

                let pages = Math.ceil(allLocations.length / this.props.maxItemsToShowAtOnce);
                let pageList = [];
                for (let i = 1; i <= pages; i++) {
                    let className = i == this.state.pageToRender
                        ? "active"
                        : undefined;

                    pageList.push((
                        <li key={i} className={className}>
                            <a onClick={() => this.onPageClicked(i)}>{i}</a>
                        </li>
                    ));
                }

                paging = (
                    <div className="text-center">
                        <ul className="pagination pagination-sm" style={this.style({ margin: "0px" })}>
                            <li className={hasPrev
                                ? undefined
                                : "disabled"}>
                                <a onClick={hasPrev
                                    ? (() => this.onPageClicked(this.state.pageToRender - 1))
                                    : undefined}><i className="fa fa-angle-left"></i></a>
                            </li>
                            {pageList}
                            <li className={hasNext
                                ? undefined
                                : "disabled"}>
                                <a onClick={hasNext
                                    ? (() => this.onPageClicked(this.state.pageToRender + 1))
                                    : undefined}><i className="fa fa-angle-right"></i></a>
                            </li>
                        </ul>
                    </div>
                );
            }
        }

        const renderedLocations = locationsToRender
            .map((location) => (
                <FulfillmentLocationsListItem
                    key={location.FulfillmentLocationId}
                    location={location}
                    highlight={this.props.enableSearchHighlighting
                        ? this.state.searchNeedle
                        : undefined}
                    onClick={this.props.onSelectionClicked}
                    disableInlineStyles={this.props.disableInlineStyles}
                    showInternalIds={this.props.showInternalIds}
                    showFulfillerId={this.props.showFulfillerId}
                    showFulfillmentLocationId={this.props.showFulfillmentLocationId}
                    additionalColumnRenderer={this.props.additionalColumnRenderer}
                    customTitleRenderer={this.props.customTitleRenderer}
                    isRecent={location.IsRecent}
                />
            ));

        return (
            <div>
                {this.props.showPartialResultPagingTop
                    ? (<div style={this.style({ marginBottom: "18px" })}>{paging}</div>)
                    : null}
                <table className="table table-hover cimpress-fl-list">
                    {this.renderHeader()}
                    <tbody>
                    {renderedLocations}
                    </tbody>
                </table>
                {this.props.showPartialResultPagingBottom
                    ? paging
                    : null}
            </div>
        );
    }

    _id(suffix) {
        let baseId = this.props.id
            ? this.props.id
            : 'locations-list';
        return `${baseId}-${suffix}`;
    }

    tt(key) {
        let { t, language } = this.props;
        return t(key, { lng: language });
    }

    renderFiltering() {

        if ( !this.props.enableFiltering ) {
            return null;
        }

        return (
            <TextField
                label={this.tt("search-label")}
                value={this.state.searchNeedle}
                onChange={(v) => this.setState({ searchNeedle: v.target.value, pageToRender: 1 })}
                rightAddon={this.props.showCancelButton
                    ? (<button onClick={this.props.onCancelClicked} className="btn btn-default">
                        {this.props.cancelButtonCaption
                            ? this.props.cancelButtonCaption
                            : this.tt('cancel')}
                    </button>)
                    : undefined}
            />
        )
    }

    renderFilteringHelp(locations) {

        if ( !this.props.enableFiltering ) {
            return (
                <div className="list-group-item">
                    <Alert type="info"
                           message={`${this.tt('too-many-locations-found')} (${locations.length}).`}
                           dismissible={false}/>
                </div>
            )
        }

        return (
            <div className="list-group-item">
                <Alert type="info"
                       message={`${this.tt('too-many-locations-found')} (${locations.length}). ${this.tt('continue-typing-to-filter-more')}`}
                       dismissible={false}/>
                {this.tt('searching-possible-by')}
                <ul style={this.style({ paddingLeft: "inherit" })}>
                    <li>{this.tt('fulfiller-name')}</li>
                    <li>{this.tt('fulfiller-id')}</li>
                    <li>{this.tt('location-name')}</li>
                    <li>{this.tt('location-id')}</li>
                </ul>
            </div>
        )
    }

    render() {

        let filteredLocations = this.props.enableFiltering
            ? this.props.fulfillmentLocations.filter(this.isLocationMatching.bind(this))
            : this.props.fulfillmentLocations;
        if ( this.props.recentFulfillmentLocations ) {
            filteredLocations = filteredLocations
                .filter(location => this.props.recentFulfillmentLocations
                    .filter(recent => recent.FulfillmentLocationId == location.FulfillmentLocationId).length <= 0);
        }

        let filteredRecentLocations = this.props.recentFulfillmentLocations
            ? this.props.enableFiltering
                ? this.props.recentFulfillmentLocations.filter(this.isLocationMatching.bind(this))
                : this.props.recentFulfillmentLocations
            : null;

        return (
            <div id={this._id('list-wrapper')}>
                {this.renderFiltering()}
                {filteredLocations.length == 0 && filteredRecentLocations.length == 0
                    ? <Alert type={"warning"}
                             message={this.tt("no-locations-found")}
                             dismissible={false}/>
                    : this.renderLocationsList(filteredLocations, filteredRecentLocations)}
            </div>
        )
    }
}

FulfillmentLocationsList.propTypes = {
    id: PropTypes.string,

    // locations
    fulfillmentLocations: PropTypes.array.isRequired,
    recentFulfillmentLocations: PropTypes.array,

    // functions and buttons
    onSelectionClicked: PropTypes.func,
    showCancelButton: PropTypes.bool,
    onCancelClicked: PropTypes.func,
    cancelButtonCaption: PropTypes.string,

    // search
    maxItemsToShowAtOnce: PropTypes.number,
    enableSearchHighlighting: PropTypes.bool,
    searchString: PropTypes.string,
    enableFiltering: PropTypes.bool,
    showPartialResult: PropTypes.bool,
    showPartialResultPagingTop: PropTypes.bool,
    showPartialResultPagingBottom: PropTypes.bool,

    // display
    showHeader: PropTypes.bool,
    disableInlineStyles: PropTypes.bool,
    showInternalIds: PropTypes.bool,
    showFulfillerId: PropTypes.bool,
    showFulfillmentLocationId: PropTypes.bool,

    // additional columns
    additionalColumnTitle: PropTypes.string,
    additionalColumnRenderer: PropTypes.any,
    customTitleRenderer: PropTypes.func,

    //
    language: PropTypes.string,

    // silence eslint
    t: PropTypes.any,
    i18n: PropTypes.any
};

FulfillmentLocationsList.defaultProps = {
    maxItemsToShowAtOnce: 50,
    enableSearchHighlighting: true,
    enableFiltering: true,
    showHeader: true,
    showPartialResult: false,
    showPartialResultPagingTop: false,
    showPartialResultPagingBottom: true,
    disableInlineStyles: false,
    showInternalIds: true,
    showFulfillerId: true,
    showFulfillmentLocationId: true,
    additionalColumnTitle: undefined,
    additionalColumnRenderer: undefined,
    showCancelButton: true,
    customTitleRenderer: undefined,
    language: 'eng'
};

export default translate('translations', { i18n: getI18nInstance() })(FulfillmentLocationsList);
