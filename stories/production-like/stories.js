import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import Authenticated from './Authenticated';
import auth from './auth';

import { FulfillerSelect, FulfillerMultiSelect } from '../../src/index';

storiesOf('Production-like', module)
    .addDecorator(withKnobs)
    .add('Fulfiller select', () => {
        return <Authenticated>
            <div className={'card'}>
                <div className={'card-block'}>
                    <div className={'row'}>
                        <div className={'col-md-4'}>
                            <FulfillerSelect
                                accessToken={auth.getAccessToken()}
                                fulfillersFilterFunction={()=> true }
                                includeArchived={boolean('includeArchived', false)}
                                includeId={boolean('includeId', false)}
                                includeInternalId={boolean('includeInternalId', true)}
                                includeName={boolean('includeName', true)}
                                autoSelectMostRecent={boolean('autoSelectMostRecent', true)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>;
    })
    .add('Fulfiller select Multiple', () => {
        return <Authenticated>
            <div className={'card'}>
                <div className={'card-block'}>
                    <div className={'row'}>
                        <div className={'col-md-4'}>
                            <FulfillerMultiSelect
                                accessToken={auth.getAccessToken()}
                                includeArchived={boolean('includeArchived', false)}
                                includeId={boolean('includeId', false)}
                                includeInternalId={boolean('includeInternalId', true)}
                                includeName={boolean('includeName', true)}
                                autoSelectMostRecent={boolean('autoSelectMostRecent', true)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>;
    });
