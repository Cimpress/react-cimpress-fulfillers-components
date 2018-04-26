'use strict';

import React from 'react';
import FulfillmentLocationItem from '@cimpress/react-fl-fi-components/lib/FulfillmentLocationField';
import PropInfo from '../shared/PropInfo';
import ComponentDoc from '../shared/ComponentDoc';

export default class FulfillmentLocationItemDemo extends React.Component {

    render() {
        let i = 0;
        let propInfos = [
            <PropInfo key={++i} name={"onClick"} type={"function"} default={false}
                      description={"A function to execute on clicking the button or the name of location"}/>,
            <PropInfo key={++i} name={"location"} type={"object"} default={false}
                      description={"An object holding a fulfillment location data"}/>,
            <PropInfo key={++i} name={"showInternalIds"} type={"bool"} default={"true"}
                      description={"Determines whether to show/hide internal ids"}/>,
            <PropInfo key={++i} name={"showFulfiller"} type={"bool"} default={"true"}
                      description={"Determines whether to show/hide fulfiller ids"}/>,
            <PropInfo key={++i} name={"showFulfillmentLocation"} type={"bool"} default={"true"}
                      description={"Determines whether to show/hide fulfillment location id"}/>,
            <PropInfo key={++i} name={"buttonCaption"} type={"string"} default={"Change..."}
                      description={"Button caption"}/>
        ];

        return (
            <ComponentDoc name="FulfillmentLocationField" propInfos={propInfos}>
                {this.renderDemo()}
            </ComponentDoc>
        );
    }

    renderDemo() {

        let location = {
            FulfillmentLocationName: 'Windsor',
            FulfillmentLocationId: 'windsorid',
            InternalFulfillmentLocationId: 1,
            FulfillerName: 'Vistaprint',
            FulfillerId: 1,
            InternalFulfillerId: 2,
        };

        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <h6>Default</h6>
                        <FulfillmentLocationItem
                            location={location}
                            onClick={() => {
                                alert('You clicked me!')
                            }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h6>Without fulfiller</h6>
                        <FulfillmentLocationItem
                            location={location}
                            showFulfiller={false}
                            onClick={() => {
                                alert('You clicked me!')
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h6>without location</h6>
                        <FulfillmentLocationItem
                            location={location}
                            showFulfillmentLocation={false}
                            onClick={() => {
                                alert('You clicked me!')
                            }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h6>Without internal ids</h6>
                        <FulfillmentLocationItem
                            location={location}
                            showInternalIds={false}
                            onClick={() => {
                                alert('You clicked me!')
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

