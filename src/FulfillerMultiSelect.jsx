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
            resource: this.props.multi
                ? 'https://trdlnk.cimpress.io/fulfillerselect/multi'
                : 'https://trdlnk.cimpress.io'
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

        return getFulfillers(accessToken, { noCache: true })
            .then(fulfillers => {
                fulfillers.forEach(f => this.fulfillerMap[f.fulfillerId] = f);
                const sortedFulfillers = fulfillers.sort((a, b) => a.name.localeCompare(b.name));
                this.setState({
                    fetchingFulfillers: false,
                    fulfillers: sortedFulfillers
                });

                return sortedFulfillers;
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
            .then((results) => {
                const fulfillers = results[0];
                const recentFulfillerIds = results[1];
                let selectedFulfillerIds = [];
                if (this.props.selectedFulfillerIds) {
                    selectedFulfillerIds = fulfillers
                        .find(fulfiller => this.props.selectedFulfillerIds.includes(fulfiller.fulfillerId))
                        .map(fulfiller => fulfiller.fulfillerId);
                } else if (recentFulfillerIds.length > 0 && this.props.autoSelectMostRecent) {
                    selectedFulfillerIds = recentFulfillerIds;
                }

                this.setState({
                    recentFulfillerIds,
                    selectedFulfillerIds
                },
                () => {
                    if (this.state.selectedFulfillerIds.length > 0) {
                        this.onSelectedFulfillerChanged(this.state.selectedFulfillerIds);
                    }
                });
            });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.accessToken !== this.props.accessToken) {
            this.refreshComponentData();
        }
    }

    componentDidMount() {
        this.refreshComponentData();
    }

    handleChange(e) {
        if (!e) {
            return;
        }

        const fulfillerIds = this.props.multi
            ? e.map(f => f.fulfiller
                ? f.fulfiller.fulfillerId
                : f.fulfillerId
            )
            : [e.fulfiller.fulfillerId];

        if (fulfillerIds === this.state.selectedFulfillerIds) {
            return;
        }

        // initial, strictly visual client-side update to circumvent a wait on GET Customizr
        this.setState({
            selectedFulfillerIds: fulfillerIds,
            recentFulfillerIds: fulfillerIds.concat((this.state.recentFulfillerIds || []).filter(id => !fulfillerIds.includes(id)))
        });

        this.onSelectedFulfillerChanged(fulfillerIds);
    }

    onSelectedFulfillerChanged(fulfillerIds) {
        if (this.props.onChange) {
            this.props.onChange(this.mapFulfillerIdsToFulfillers(fulfillerIds));
        }

        this.updateRecentFulfillerIds(fulfillerIds);
    }

    async getRecentFulfillerIds() {
        if (this.props.accessToken) {
            let settings = await this.customizrClient.getSettings(this.props.accessToken);
            return settings.recentFulfillerIds || [];
        }
    }

    async updateRecentFulfillerIds(fulfillerIds) {
        if (fulfillerIds.length === 0 || fulfillerIds.every(fulfillerId => this.state.recentFulfillerIds.includes(fulfillerId)) ) {
            return;
        }

        let recentFulfillerIds = (await this.getRecentFulfillerIds()) || [];
        let update = {
            recentFulfillerIds: fulfillerIds.concat((recentFulfillerIds || []).filter(id => !fulfillerIds.includes(id)))
        };
        this.setState(update);
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
        let filteredFulfillers = fulfillers.filter(fulfiller => !this.state.selectedFulfillerIds.includes(fulfiller.fulfillerId));
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
            .slice(0, 5)
            .map(id => fulfillerOptions.find(f => f.fulfiller.fulfillerId === id))
            .filter(f => f)
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

    mapFulfillersToValues(fulfillerIds) {
        return this.mapFulfillerIdsToFulfillers(fulfillerIds)
            .map(fulfiller => ({
                fulfiller: fulfiller,
                value: `${fulfiller.fulfillerId} ${fulfiller.name}`
            }))
    }

    render() {
        console.log('render')
        return (
            <div>
                <SelectWrapper
                    selectedSelect={VirtualizedSelect}
                    label={this.props.label || this.tt('label')}
                    value={this.mapFulfillersToValues(this.state.selectedFulfillerIds)}
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
    accessToken: PropTypes.string.isRequired,
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
    multi: PropTypes.bool
};

FulfillerMultiSelect.defaultProps = {
    language: 'eng',
    includeArchived: false,
    includeId: true,
    includeInternalId: false,
    includeName: true,
    autoSelectMostRecent: true,
    multi: true
};

export default translate('translations', { i18n: getI18nInstance() })(FulfillerMultiSelect);
