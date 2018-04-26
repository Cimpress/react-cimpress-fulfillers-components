'use strict';

import React from 'react';
import FulfillmentLocationTitle from '@cimpress/react-fl-fi-components/lib/FulfillmentLocationTitle';
import PropInfo from '../shared/PropInfo';
import ComponentDoc from '../shared/ComponentDoc';

export default class FulfillmentLocationTitleDemo extends React.Component {

    render() {
        let i = 0;
        let propInfos = [
            <PropInfo key={++i} name={"onClick"} type={"function"} default={false}
                      description={"A function to execute on clicking the button or the name of location"}/>,
            <PropInfo key={++i} name={"location"} type={"object"} default={false}
                      description={"An object holding a fulfillment location data"}/>,
            <PropInfo key={++i} name={"showInternalIds"} type={"bool"} default={true}
                      description={"Show or hide internal ids"}/>,
            <PropInfo key={++i} name={"disableInlineStyles"} type={"bool"} default={"false"}
                      description={"Force the component to not hardcode styles"}/>
        ];

        return (
            <ComponentDoc name="FulfillmentLocationTitle" propInfos={propInfos}>
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
                    <div className="col-md-12">
                        <h5>Full size with all ids</h5>
                        <FulfillmentLocationTitle
                            location={location}
                            onClick={() => {
                                alert('You clicked me!')
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h5>Half size without internal ids</h5>
                        <FulfillmentLocationTitle
                            location={location}
                            onClick={() => {
                                alert('You clicked me!')
                            }}
                            showInternalIds={false}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

