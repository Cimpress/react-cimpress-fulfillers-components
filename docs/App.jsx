'use strict';

import React from 'react';
import Header from '@cimpress/react-components/lib/Header';
import Footer from '@cimpress/react-components/lib/Footer';
import FulfillmentLocationFieldDemo from './components/FulfillmentLocationFieldDemo';
import FulfillmentLocationTitleDemo from './components/FulfillmentLocationTitleDemo';
import FulfillmentLocationsListDemo from './components/FulfillmentLocationsListDemo';

export default class App extends React.Component {

    render() {
        return (
            <div>
                <Header appTitle="@cimpress/react-fl-fi-components"/>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10">
                            <h2>Introduction</h2>
                            Welcome! This page is intended to get you started using <code>@cimpress/react-fi-fl-components</code>.
                            <hr/>
                            <div className={"card"}>
                                <div className={"card-block"} style={{padding:"40px"}}>
                                    <FulfillmentLocationFieldDemo/>
                                </div>
                            </div>
                            <br/>
                            <div className={"card"}>
                                <div className={"card-block"} style={{padding:"40px"}}>
                                    <FulfillmentLocationTitleDemo/>
                                </div>
                            </div>
                            <br/>
                            <div className={"card"}>
                                <div className={"card-block"} style={{padding:"40px"}}>
                                    <FulfillmentLocationsListDemo/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div style={{position: 'fixed', height: '90vh', paddingLeft: '20px'}}>
                                <h5>Components:</h5>
                                <div>
                                    <a href={`#FulfillmentLocationField`}>FulfillmentLocationField</a>
                                </div>
                                <div>
                                    <a href={`#FulfillmentLocationTitle`}>FulfillmentLocationTitle</a>
                                </div>
                                <div>
                                    <a href={`#FulfillmentLocationsList`}>FulfillmentLocationsList</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer
                    links={(<ul>
                        <li><a href="mailto:TrdelnikSquad@cimpress.com?subject=FI/FL%32components%32question">Contact
                            Us</a></li>
                    </ul>)}
                    releaseInfo="v0.1"/>
            </div>
        )

    }
}

