import React from 'react';
import PropTypes from 'prop-types';
import FulfillerMultiSelect from './FulfillerMultiSelect';

import '../styles/FulfillerSelect.css'

import { getI18nInstance } from './i18n';
import { translate } from 'react-i18next';
import { EnvironmentKey } from "./utils/consts";

class FulfillerSelect extends React.Component {

    render() {
        return (
            <div>
                <FulfillerMultiSelect
                    accessToken={this.props.accessToken}
                    fulfillers={this.props.fulfillers}
                    autoSelectMostRecent={this.props.autoSelectMostRecent}
                    fulfillersFilterFunction={this.props.fulfillersFilterFunction}
                    i18n={this.props.i18n}
                    includeArchived={this.props.includeArchived}
                    includeId={this.props.includeId}
                    includeInternalId={this.props.includeInternalId}
                    includeName={this.props.includeName}
                    label={this.props.label}
                    language={this.props.language}
                    onChange={this.props.onChange}
                    t={this.props.t}

                    selectedFulfillerIds={
                        this.props.selectedFulfillerId
                            ? [this.props.selectedFulfillerId]
                            : undefined
                    }
                    multi={false}
                />
            </div>
        )
    }
}

FulfillerSelect.propTypes = {
    // silence eslint
    t: PropTypes.any,
    i18n: PropTypes.any,

    // Either access token OR a list of fulfillers to display
    accessToken: PropTypes.string,
    fulfillers: PropTypes.array,
    fulfillersFilterFunction: PropTypes.func,
    selectedFulfillerId: PropTypes.string,

    // functions and buttons
    onChange: PropTypes.func,

    // display
    language: PropTypes.string,
    label: PropTypes.string,
    includeArchived: PropTypes.bool,
    includeId: PropTypes.bool,
    includeInternalId: PropTypes.bool,
    includeName: PropTypes.bool,
    autoSelectMostRecent: PropTypes.bool,
    env: PropTypes.string
};

FulfillerSelect.defaultProps = {
    language: 'eng',
    includeArchived: false,
    includeId: true,
    includeInternalId: false,
    includeName: true,
    autoSelectMostRecent: true,
    env: EnvironmentKey.Production
};

export default translate('translations', { i18n: getI18nInstance() })(FulfillerSelect);
