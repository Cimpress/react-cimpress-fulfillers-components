import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import FulfillerSelect from '../src/FulfillerSelect'
import { CssLoader } from '@cimpress/react-components'

import fulfillers from './fulfillers'

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

storiesOf('Fulfiller Selection', module)
  .add('with everything included', () => wrapInLoader(
    <FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      fulfillers={fulfillers}
      onChange={v => {}}
      includeArchived={true}
      includeInternalId={true}
      includeId={true}
      includeName={true}
    />
  ))
  .add('with name, and both IDs included', () => wrapInLoader(
    <FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      fulfillers={fulfillers}
      onChange={v => {}}
      includeArchived={false}
      includeInternalId={true}
      includeId={true}
      includeName={true}
    />
  ))
  .add('with name and ID included', () => wrapInLoader(
    <FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      fulfillers={fulfillers}
      onChange={v => {}}
      includeArchived={false}
      includeInternalId={false}
      includeId={true}
      includeName={true}
    />
  ))
  .add('with name included', () => wrapInLoader(
    <FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      fulfillers={fulfillers}
      onChange={v => {}}
      includeArchived={false}
      includeInternalId={false}
      includeId={false}
      includeName={true}
    />
  ))
  .add('with nothing included', () => wrapInLoader(
    <FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      fulfillers={fulfillers}
      onChange={v => {}}
      includeArchived={false}
      includeInternalId={false}
      includeId={false}
      includeName={false}
    />
  ))
;
