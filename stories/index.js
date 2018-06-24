import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import FulfillerSelect from '../src/FulfillerSelect'
import { CssLoader } from '@cimpress/react-components'

global.CUSTOMIZR_URL = "http://localhost:9102";

let wrapInLoader = component => {
  return (
    <CssLoader>
      {component}
    </CssLoader>
  );
};

let newComp = props => {
  return (<h1>this.props.text</h1>);
}

let fulfillers = [
  {
    name: "My Test Fulfiller",
    internalFulfillerId: 31337,
    fulfillerId: "deadbeef",
    archived: false
  },
  {
    name: "My Test Fulfiller 2",
    internalFulfillerId: 31338,
    fulfillerId: "deadbef0",
    archived: false
  },
  {
    name: "My Test Fulfiller 3",
    internalFulfillerId: 31339,
    fulfillerId: "deadbef1",
    archived: false
  }
];

storiesOf('Fulfiller Selection', module)
  .add('with everything included', () => wrapInLoader(
    <FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      fulfillers={fulfillers}
      onChange={v => {}}
      includeArchived={true}
      includeId={true}
      includeInternalId={true}
      includeName={true}
    />
  ));
