import React from 'react';
import PropTypes from 'prop-types';
import VirtualizedSelect from 'react-virtualized-select';
import SelectWrapper from '@cimpress/react-components/lib/SelectWrapper';
import { shapes } from '@cimpress/react-components';
import { getFulfillers } from './apis/fi.api';
import { CustomizrClient } from 'cimpress-customizr';

import '../styles/FulfillerSelect.css'

import { getI18nInstance } from './i18n';
import { translate } from 'react-i18next';
import { EnvironmentKey } from "./utils/consts";

let { Spinner } = shapes;

class FulfillerMultiSelect extends React.Component {
    constructor(props) {
        super(props);
        this.fulfillerMap = {};
        (props.fulfillers || []).forEach(f => this.fulfillerMap[f.fulfillerId] = f);

        this.state = {
            fulfillers: undefined,
            selectedFulfillerIds: props.selectedFulfillerIds || [],
            recentFulfillerIds: [],
            fetchingFulfillers: true
        };

        this.customizrClient = new CustomizrClient({
            resource: 'https://trdlnk.cimpress.io'
        });

        this.handleChange = this.handleChange.bind(this);
        this.fulfillerOptionGroupLabelOptionRenderer = this.fulfillerOptionGroupLabelOptionRenderer.bind(this);
        this.fulfillerSingleOptionRenderer = this.fulfillerSingleOptionRenderer.bind(this);
        this.fulfillerValueRenderer = this.fulfillerValueRenderer.bind(this);
        this.fulfillerWarningMessageOptionRenderer = this.fulfillerWarningMessageOptionRenderer.bind(this);
        this.fulfillerSpinnerOptionRenderer = this.fulfillerSpinnerOptionRenderer.bind(this);
        this.onSelectedFulfillerChanged = this.onSelectedFulfillerChanged.bind(this);
        this.mapFulfillerIdsToFulfillers = this.mapFulfillerIdsToFulfillers.bind(this)
    }

    fetchFulfillers(accessToken) {
        this.setState({
            fetchingFulfillers: true
        });

        return getFulfillers(accessToken, this.props.env,{ noCache: true })
            .then(fulfillers => {
                fulfillers.forEach(f => this.fulfillerMap[f.fulfillerId] = f);
                this.setState({
                    fulfillers: fulfillers.sort((a, b) => a.name.localeCompare(b.name)),
                    fetchingFulfillers: false
                });
            })
            .catch(e => {
                this.setState({
                    fulfillers: [{ fulfillerId: '-1', internalFulfillerId: -1, name: e.message || e.Message }],
                    fetchingFulfillers: false
                })
            });
    }

    refreshComponentData() {
        return Promise.all([
            !this.props.fulfillers
                ? this.fetchFulfillers(this.props.accessToken)
                : Promise.resolve(),
            this.getRecentFulfillerIds()
        ])
            .then(results => {
                if (!results[1]) {
                    return;
                }

                const { recentFulfillerIds, recentFulfillerIdsMulti } = results[1];
                let fulfillerIdsToSelect = [];
                if (this.props.selectedFulfillerIds) {
                    fulfillerIdsToSelect = this.props.selectedFulfillerIds
                } else if (recentFulfillerIds.length > 0 && this.props.autoSelectMostRecent) {
                    fulfillerIdsToSelect = this.props.multi
                        ? recentFulfillerIdsMulti
                        : recentFulfillerIds.slice(0, 1);
                }

                const selectedFulfillerIds = fulfillerIdsToSelect
                    .map(fulfillerId => (
                        this.fulfillerMap[fulfillerId] && this.fulfillerMap[fulfillerId].fulfillerId
                    ))
                    .filter(fulfillerId => fulfillerId);

                this.setState({
                    recentFulfillerIds,
                    selectedFulfillerIds
                },
                () => {
                    if (this.state.selectedFulfillerIds.length > 0 || this.props.multi) {
                        const updateCustomizrSettings = !!this.props.selectedFulfillerIds;
                        this.onSelectedFulfillerChanged(this.state.selectedFulfillerIds, updateCustomizrSettings);
                    }
                });
            });
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.accessToken !== this.props.accessToken) || (prevProps.env !== this.props.env) ) {
            this.refreshComponentData();
        }
    }

    componentDidMount() {
        if (!this.props.accessToken) {
            return;
        }

        this.refreshComponentData();
    }

    handleChange(e) {
        if (!e) {
            return;
        }

        const fulfillerIds = this.props.multi
            ? e.map(f => f.fulfiller.fulfillerId)
            : [e.fulfiller.fulfillerId];

        this.setState({
            selectedFulfillerIds: fulfillerIds
        });

        this.onSelectedFulfillerChanged(fulfillerIds);
    }

    onSelectedFulfillerChanged(fulfillerIds, updateCustomizrSettings = true) {
        if (this.props.onChange) {
            this.props.onChange(this.mapFulfillerIdsToFulfillers(fulfillerIds));
        }

        if (updateCustomizrSettings) {
            this.updateRecentFulfillerIds(fulfillerIds);
        }
    }

    async getRecentFulfillerIds() {
        if (this.props.accessToken) {
            let settings = await this.customizrClient.getSettings(this.props.accessToken);
            return {
                recentFulfillerIds: settings.recentFulfillerIds || [],
                recentFulfillerIdsMulti: settings.recentFulfillerIdsMulti || []
            };
        }
    }

    async updateRecentFulfillerIds(fulfillerIds) {
        if (!this.props.multi
            && (fulfillerIds.length === 0 || fulfillerIds[0] === this.state.recentFulfillerIds[0])
        ) {
            return;
        }

        // Latest fulfiller ID is the most recent
        const orderedFulfillerIds = fulfillerIds
            .slice()
            .reverse();

        // initial, strictly visual client-side update to circumvent a wait on GET Customizr
        this.setState({
            recentFulfillerIds: orderedFulfillerIds
                .concat((this.state.recentFulfillerIds || [])
                .filter(id => !fulfillerIds.includes(id)))
        });

        let { recentFulfillerIds, recentFulfillerIdsMulti } = (await this.getRecentFulfillerIds()) || [];
        let update = {
            recentFulfillerIds: orderedFulfillerIds
                .concat((recentFulfillerIds)
                .filter(id => !fulfillerIds.includes(id))),
            recentFulfillerIdsMulti
        };
        this.setState(update);

        if (this.props.multi) {
            update.recentFulfillerIdsMulti = fulfillerIds; // store the last multi-select selection every time
        }

        this.customizrClient.putSettings(this.props.accessToken, update);
    }

    getOptions() {
        let fulfillers = this.state.fulfillers || this.props.fulfillers || [];

        if (!fulfillers) {
            if (this.state.fetchingFulfillers) {
                return [{
                    text: this.tt('loading'),
                    optionRenderer: this.fulfillerSpinnerOptionRenderer
                }];
            }

            return [{
                text: this.tt('no-data'),
                optionRenderer: this.fulfillerWarningMessageOptionRenderer
            }];
        }
        let filteredFulfillers = this.props.multi
            ? fulfillers.filter(fulfiller => !this.state.selectedFulfillerIds.includes(fulfiller.fulfillerId))
            : fulfillers;

        if (this.props.fulfillersFilterFunction) {
            filteredFulfillers = filteredFulfillers.filter(this.props.fulfillersFilterFunction);
        }

        let fulfillerOptions = filteredFulfillers
            .filter(fulfiller => this.props.includeArchived || !fulfiller.archived)
            .map(fulfiller => ({
                fulfiller,
                value: `${fulfiller.fulfillerId} ${fulfiller.name}`, // 'value' required for search and focus style change functionality
                optionRenderer: this.fulfillerSingleOptionRenderer
            }));

        let recentFulfillerOptions = this.state.recentFulfillerIds
            .map(id => fulfillerOptions.find(f => f.fulfiller.fulfillerId === id))
            .filter(f => f)
            .slice(0, 5)
            .map((f, index) => Object.assign({}, f, { value: `recent-${index}` })); // do not highlight or show in search results

        let recentFulfillersOptionGroupLabelOption = {
            text: this.tt('recent-fulfillers'),
            optionRenderer: this.fulfillerOptionGroupLabelOptionRenderer
        };

        let fulfillersOptionGroupLabelOption = {
            text: this.tt('all-fulfillers'),
            optionRenderer: this.fulfillerOptionGroupLabelOptionRenderer
        };

        let allOptions = [
            fulfillersOptionGroupLabelOption,
            ...fulfillerOptions
        ];

        if (recentFulfillerOptions.length) {
            allOptions = [
                recentFulfillersOptionGroupLabelOption,
                ...recentFulfillerOptions
            ].concat(allOptions);
        }

        return allOptions;
    }

    variableOptionRenderer(options) {
        return options.option.optionRenderer(options);
    }

    fulfillerSpinnerOptionRenderer({ option, key, style }) {
        return (
            <div
                className='VirtualizedSelectOption VirtualizedSelectDisabledOption'
                style={style}
                key={key}>
                <span className='FulfillerSelect-vertical-center'>
                    <Spinner className='FulfillerSelect-Spinner-20' size={20}/>
                    <span className='FulfillerSelect-Spinner-text'>
                        {option.text}
                    </span>
                </span>
            </div>
        );
    }

    fulfillerWarningMessageOptionRenderer({ option, key, style }) {
        return (
            <div
                className='VirtualizedSelectOption VirtualizedSelectDisabledOption'
                style={style}
                key={key}>
                <span>
                    {option.text}
                </span>
            </div>
        );
    }

    fulfillerOptionGroupLabelOptionRenderer({ option, key, style }) {
        return (
            <div
                className='VirtualizedSelectOption FulfillerSelect-option-group-label'
                style={style}
                key={key}>
                <strong>{option.text}</strong>
            </div>
        );
    }

    fulfillerSingleOptionRenderer ({ focusedOption, focusOption, key, option, selectValue, style, valueArray }) {
        let className = ['VirtualizedSelectOption'];
        let content = this.formatTitle(option.fulfiller) || this.tt('misconfigured');

        if (option.fulfiller.archived) {
            className.push('VirtualizedSelectDisabledOption');
        }

        if (focusedOption && focusedOption.fulfiller && option.fulfiller.fulfillerId === focusedOption.fulfiller.fulfillerId) {
            className.push('VirtualizedSelectFocusedOption')
        }

        if (valueArray && valueArray.find(value => value.fulfillerId === option.fulfiller.fulfillerId)) {
            className.push('VirtualizedSelectSelectedOption')
        }

        const events = {
            onClick: () => {
                return selectValue(option);
            },
            onMouseEnter: () => focusOption(option)
        };

        return (
            <div
                className={className.join(' ')}
                key={key}
                title={option.fulfiller.fulfillerId}
                style={style}
                {...events}>
                {content}
            </div>
        )
    }

    fulfillerValueRenderer (option) {
        return this.formatTitle(option.fulfiller) || this.tt('misconfigured');
    }

    formatTitle(fulfiller) {
        let content = null;

        if (this.props.includeName) {
            if (this.props.includeId && this.props.includeInternalId) {
                content = <span>
                    {fulfiller.name} ({fulfiller.fulfillerId} / <span
                    className={'text-muted'}>{fulfiller.internalFulfillerId}</span>)
                </span>;
            } else if (this.props.includeId) {
                content = <span>{fulfiller.name} ({fulfiller.fulfillerId})</span>;
            } else if (this.props.includeInternalId) {
                content = <span>{fulfiller.name} (<span className={'text-muted'}>{fulfiller.internalFulfillerId}</span>)</span>;
            } else {
                content = fulfiller.name;
            }
        } else {
            if (this.props.includeId && this.props.includeInternalId) {
                content = <span>{fulfiller.fulfillerId} / <span className={'text-muted'}>{fulfiller.internalFulfillerId}</span></span>;
            } else if (this.props.includeId) {
                content = <span>{fulfiller.fulfillerId}</span>;
            } else if (this.props.includeInternalId) {
                content = <span className={'text-muted'}>{fulfiller.internalFulfillerId}</span>;
            }
        }

        return content;
    }

    tt(key) {
        let { t, language } = this.props;
        return t(key, { lng: language });
    }

    mapFulfillerIdsToFulfillers(fulfillerIds) {
        const fulfillers = fulfillerIds.map(f => (this.fulfillerMap[f]));

        return this.props.multi
            ? fulfillers
            : fulfillers[0];
    }

    mapFulfillerIdsToValues(fulfillerIds) {
        const values = fulfillerIds.map(fulfillerId => {
            const fulfiller = this.fulfillerMap[fulfillerId];
            return {
                fulfiller: fulfiller,
                value: `${fulfiller.fulfillerId} ${fulfiller.name}`
            }
        });

        return this.props.multi
            ? values
            : values[0];
    }

    render() {
        return (
            <div>
                <SelectWrapper
                    selectedSelect={VirtualizedSelect}
                    label={this.props.label || this.tt('label')}
                    value={this.mapFulfillerIdsToValues(this.state.selectedFulfillerIds)}
                    options={this.getOptions()}
                    noResultsText={this.tt('no-results-found')}
                    clearable={this.props.multi}
                    onChange={this.handleChange}
                    optionRenderer={this.variableOptionRenderer}
                    valueRenderer={this.fulfillerValueRenderer}
                    multi={this.props.multi}
                    tether
                />
            </div>
        )
    }
}

FulfillerMultiSelect.propTypes = {
    // silence eslint
    t: PropTypes.any,
    i18n: PropTypes.any,

    // Either access token OR a list of fulfillers to display
    accessToken: PropTypes.string,
    fulfillers: PropTypes.array,
    fulfillersFilterFunction: PropTypes.func,
    selectedFulfillerIds: PropTypes.array,

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
    multi: PropTypes.bool,
    env: PropTypes.string
};

FulfillerMultiSelect.defaultProps = {
    language: 'en',
    includeArchived: false,
    includeId: false,
    includeInternalId: false,
    includeName: true,
    autoSelectMostRecent: true,
    multi: true,
    env: EnvironmentKey.Production
};

export default translate('translations', { i18n: getI18nInstance() })(FulfillerMultiSelect);
