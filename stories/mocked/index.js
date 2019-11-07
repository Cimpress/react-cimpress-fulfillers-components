import React from 'react';
import { storiesOf, action } from '@storybook/react';
import { FulfillerSelect } from '../../src/index'
import { CssLoader } from '@cimpress/react-components'

import fulfillers from './fulfillers';
import mock from 'xhr-mock';

// NOTE:
// NOTE: This mocks the services for ALL stories. Move it inside stories to achieve more granular approach.
// NOTE:
mock.setup();
mock.get('https://fulfilleridentity.trdlnk.cimpress.io/v1/fulfillers', {
    statusCode: 200,
    body: fulfillers
});

mock.get('https://customizr.at.cimpress.io/v1/resources/https%3A%2F%2Ftrdlnk.cimpress.io/settings', {
    statusCode: 200,
    body: {
        "recentFulfillerIds": ["abcdef3", "abcdef17", "abcdef23", "abcdef66", "notfound"]
    }
});

mock.put('https://customizr.at.cimpress.io/v1/resources/https%3A%2F%2Ftrdlnk.cimpress.io/settings', {
    statusCode: 200,
    body: {
        "recentFulfillerIds": ["abcdef3", "abcdef17", "abcdef23", "notfound"]
    }
});
/// END NOTE ^^^

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
      onChange={action('selected')}
    />
  ))
  .add('with everything included and a selected fulfiller passed', () => wrapInLoader(
    <FulfillerSelect
        accessToken='Bearer bear'
        language={'eng'}
        fulfillers={fulfillers}
        includeArchived={true}
        includeInternalId={true}
        includeId={true}
        includeName={true}
        onChange={action('selected')}
        selectedFulfillerId={'abcdef66'}
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
      onChange={action('selected')}
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
      onChange={action('selected')}
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
      onChange={action('selected')}
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
      onChange={action('selected')}
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
      onChange={action('selected')}
    />
  ));

storiesOf('Fulfiller Selection sourced dynamically', module)
  .add('with everything included', () => wrapInLoader(<FulfillerSelect
      accessToken='Bearer bear'
      language={'eng'}
      includeArchived={true}
      includeInternalId={true}
      includeId={true}
      includeName={true}
      onChange={action('selected')}
    />
  ));

