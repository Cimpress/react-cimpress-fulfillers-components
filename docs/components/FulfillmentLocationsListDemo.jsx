'use strict';

import React from 'react';
import FulfillmentLocationsList from '../../src/FulfillmentLocationsList';
import ComponentDoc from '../shared/ComponentDoc';
import PropInfo from '../shared/PropInfo';

export default class FulfillmentLocationsListDemo extends React.Component {

    render() {

        let i = 0;
        let propInfos = [
            <PropInfo key={++i} name={"fulfillmentLocations"} type={"array"} default={false}
                      description={"List of locations"}/>,
            <PropInfo key={++i} name={"onSelectionClicked"} type={"function"} default={"undefined"}
                      description={"A function to execute when an item is selected. Prototype: function(location) {}"}/>,
            <PropInfo key={++i} name={"maxItemsToShowAtOnce"} type={"number"} default={50}
                      description={"Max elements to show at once"}/>,
            <PropInfo key={++i} name={"enableSearchHighlighting"} type={"bool"} default={"true"}
                      description={"Enable highlighting when searching"}/>,
            <PropInfo key={++i} name={"searchString"} type={"string"} default={""}
                      description={"Pre-populate the filter field with a string"}/>,
            <PropInfo key={++i} name={"enableFiltering"} type={"bool"} default={"true"}
                      description={"Render filtering input"}/>,
            <PropInfo key={++i} name={"showHeader"} type={"bool"} default={"true"}
                      description={"Show list header"}/>,
            <PropInfo key={++i} name={"showPartialResult"} type={"bool"} default={"false"}
                      description={"Show locations with paging even without search string entered"}/>,
            <PropInfo key={++i} name={"showPartialResultPagingTop"} type={"bool"} default={"false"}
                      description={"Show pagination at the top"}/>,
            <PropInfo key={++i} name={"showPartialResultPagingBottom"} type={"bool"} default={"true"}
                      description={"Show pagination at the bottom"}/>,
            <PropInfo key={++i} name={"disableInlineStyles"} type={"bool"} default={"false"}
                      description={"Force the component to not hardcode styles"}/>,
            <PropInfo key={++i} name={"showInternalIds"} type={"bool"} default={"true"}
                      description={"Determines whether to show/hide internal ids"}/>,
            <PropInfo key={++i} name={"showFulfillerId"} type={"bool"} default={"true"}
                      description={"Determines whether to show/hide fulfiller ids"}/>,
            <PropInfo key={++i} name={"showFulfillmentLocationId"} type={"bool"} default={"true"}
                      description={"Determines whether to show/hide location ids"}/>,
            <PropInfo key={++i} name={"additionalColumnTitle"} type={"string"} default={"undefined"}
                      description={"Add a custom column on the right with this time"}/>,
            <PropInfo key={++i} name={"additionalColumnRenderer"} type={"function"} default={"undefined"}
                      description={"A function to render item information for the custom column"}/>,
            <PropInfo key={++i} name={"showCancelButton"} type={"bool"} default={"true"}
                      description={"Show a button as part of the filter field"}/>,
            <PropInfo key={++i} name={"onCancelClicked"} type={"function"} default={"undefined"}
                      description={"A function to execute if the filtering button is clicked"}/>,
            <PropInfo key={++i} name={"cancelButtonCaption"} type={"string"} default={"Cancel"}
                      description={"Caption of the filtering button, if enabled"}/>,
            <PropInfo key={++i} name={"customTitleRenderer"} type={"function"} default={"undefined"}
                      description={"A custom title rendering"}/>,
        ];

        return (
            <ComponentDoc name="FulfillmentLocationsList" propInfos={propInfos}>
                {this.renderDemo()}
            </ComponentDoc>
        );

    }

    renderButton(location) {
        return (
            <button className="btn btn-sm btn-success" onClick={() => alert(location.FulfillmentLocationId)}>
                {location.FulfillmentLocationName}
            </button>
        )
    }

    renderDemo() {
        let locations = [{
            FulfillmentLocationName: 'Windsor',
            FulfillmentLocationId: 'windsorid',
            InternalFulfillmentLocationId: 1,
            FulfillerName: 'Vistaprint',
            FulfillerId: "ar7",
            InternalFulfillerId: 1,
        }, {
            FulfillmentLocationName: 'Venlo',
            FulfillmentLocationId: 'venloid',
            InternalFulfillmentLocationId: 2,
            FulfillerName: 'Vistaprint',
            FulfillerId: "ar7",
            InternalFulfillerId: 1,
        }, {
            FulfillmentLocationName: 'DeerPark',
            FulfillmentLocationId: 'dpkid',
            InternalFulfillmentLocationId: 3,
            FulfillerName: 'Vistaprint',
            FulfillerId: "ar7",
            InternalFulfillerId: 1,
        }, {
            FulfillmentLocationName: 'Kisarazu',
            FulfillmentLocationId: 'kisid',
            InternalFulfillmentLocationId: 5,
            FulfillerName: 'Vistaprint',
            FulfillerId: "ar7",
            InternalFulfillerId: 1,
        }];


        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <h6>Filtering disabled</h6>
                        <FulfillmentLocationsList
                            fulfillmentLocations={locations}
                            maxItemsToShowAtOnce={10000}
                            enableFiltering={false}
                            onCancelClicked={() => {
                                alert('You cancelled the selection.');
                            }}
                            onSelectionClicked={(location) => {
                                alert('You clicked on location named: ' + location.FulfillmentLocationName);
                            }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h6>Show partial results</h6>
                        <FulfillmentLocationsList
                            fulfillmentLocations={locations}
                            maxItemsToShowAtOnce={2}
                            showPartialResultPagingTop={true}
                            showPartialResult={true}
                            onCancelClicked={() => {
                                alert('You cancelled the selection.');
                            }}
                            onSelectionClicked={(location) => {
                                alert('You clicked on location named: ' + location.FulfillmentLocationName);
                            }}
                        />
                    </div>
                    <div className="col-md-4">
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        <h6>Too many locations</h6>
                        <FulfillmentLocationsList
                            fulfillmentLocations={locations}
                            maxItemsToShowAtOnce={1}
                            onCancelClicked={() => {
                                alert('You cancelled the selection.');
                            }}
                            onSelectionClicked={(location) => {
                                alert('You clicked on location named: ' + location.FulfillmentLocationName);
                            }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h6>Default case</h6>
                        <FulfillmentLocationsList
                            fulfillmentLocations={locations}
                            onCancelClicked={() => {
                                alert('You cancelled the selection.');
                            }}
                            onSelectionClicked={(location) => {
                                alert('You clicked on location named: ' + location.FulfillmentLocationName);
                            }}
                        />
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        <h6>Already filtered</h6>
                        <FulfillmentLocationsList
                            fulfillmentLocations={locations}
                            searchString={"ven"}
                            onCancelClicked={() => {
                                alert('You cancelled the selection.');
                            }}
                            onSelectionClicked={(location) => {
                                alert('You clicked on location named: ' + location.FulfillmentLocationName);
                            }}
                        />
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-12">
                        <h6>Additional column</h6>
                        <FulfillmentLocationsList
                            fulfillmentLocations={locations}
                            onCancelClicked={() => {
                                alert('You cancelled the selection.');
                            }}
                            onSelectionClicked={(location) => {
                                alert('You clicked on location named: ' + location.FulfillmentLocationName);
                            }}
                            additionalColumnTitle={"Stuff"}
                            additionalColumnRenderer={this.renderButton}
                        />
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-12">
                        <h6>No onSelectionClicked handler for the tile</h6>
                        <FulfillmentLocationsList
                            fulfillmentLocations={locations}
                            onCancelClicked={() => {
                                alert('You cancelled the selection.');
                            }}
                            additionalColumnTitle={"Stuff"}
                            additionalColumnRenderer={this.renderButton}
                        />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <h6>Recent fulfillment locations</h6>
                        <FulfillmentLocationsList 
                            fulfillmentLocations={locations}
                            maxItemsToShowAtOnce={2}
                            showPartialResult={true}
                            recentFulfillmentLocations={[locations[1]]}
                            onCancelClicked={() => {
                                alert('You cancelled the selection.');
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}