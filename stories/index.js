import React from 'react';
import { storiesOf } from '@storybook/react';
import { FulfillerSelect } from '../src/index'
import { CssLoader } from '@cimpress/react-components'

import fulfillers from './fulfillers'

global.CUSTOMIZR_URL = 'http://localhost:9102';
global.FULFILLER_IDENTITY_URL = 'http://localhost:9102';
global.FULFILLMENT_LOCATION_URL = 'http://localhost:9102';

let wrapInLoader = component => {
  return (
    <CssLoader>
      {component}
    </CssLoader>
  );
};

storiesOf('Fulfiller Selection sourced statically, with access token')
  .add('with everything included', () => wrapInLoader(
    <FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      fulfillers={fulfillers}
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
      includeArchived={false}
      includeInternalId={false}
      includeId={false}
      includeName={false}
    />
  ));

storiesOf('Fulfiller Selection sourced statically, without access token')
  .add('with everything included', () => wrapInLoader(
    <FulfillerSelect
      language={'eng'}
      fulfillers={fulfillers}
      includeArchived={true}
      includeInternalId={true}
      includeId={true}
      includeName={true}
    />
  ));

storiesOf('Fulfiller Selection sourced dynamically', module)
  .add('with everything included', () => wrapInLoader(
    <FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      includeArchived={true}
      includeInternalId={true}
      includeId={true}
      includeName={true}
    />
  ));

