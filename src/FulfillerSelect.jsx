import React from 'react';
import PropTypes from 'prop-types';
import VirtualizedSelect from 'react-virtualized-select';
import SelectWrapper from '@cimpress/react-components/lib/SelectWrapper';
import {shapes} from '@cimpress/react-components';
import {getFulfillers} from './apis/fi.api';
import CustomizrClient from './apis/customizr.api';

import '../styles/index.css'

import {getI18nInstance} from './i18n';
import {translate} from 'react-i18next';

let {Spinner} = shapes;

class FulfillerSelect extends React.Component {
    constructor(props) {
        super(props);
        this.fulfillerMap = {};
        (props.fulfillers || []).forEach(f => this.fulfillerMap[f.fulfillerId] = f);

        this.state = {
            fulfillers: undefined,
            selectedFulfillerId: undefined,
            recentFulfillerIds: [],
            fetchingFulfillers: true
        };

        this.customizrClient = new CustomizrClient(global.CUSTOMIZR_URL || null, "https://trdlnk.cimpress.io");

        this.onChange = this.onChange.bind(this);
        this.fulfillerOptionGroupLabelOptionRenderer = this.fulfillerOptionGroupLabelOptionRenderer.bind(this);
        this.fulfillerSingleOptionRenderer = this.fulfillerSingleOptionRenderer.bind(this);
        this.fulfillerValueRenderer = this.fulfillerValueRenderer.bind(this);
        this.fulfillerWarningMessageOptionRenderer = this.fulfillerWarningMessageOptionRenderer.bind(this);
        this.fulfillerSpinnerOptionRenderer = this.fulfillerSpinnerOptionRenderer.bind(this);
    }

    fetchFulfillers(accessToken, includeArchived) {
        this.setState({
            fetchingFulfillers: true
        });

        getFulfillers(accessToken, {archived: !!includeArchived})
            .then(fulfillers => {
                fulfillers.forEach(f => this.fulfillerMap[f.fulfillerId] = f);
                this.setState({
                    fulfillers: fulfillers.sort((a, b) => a.name.localeCompare(b.name)),
                    fetchingFulfillers: false
                })
            })
            .catch(e => {
                this.setState({
                    fulfillers: [{fulfillerId: '-1', internalFulfillerId: -1, name: e.message || e.Message}],
                    fetchingFulfillers: false
                })
            });
    }

    componentWillReceiveProps(newProps) {
        if (this.props.accessToken !== newProps.accessToken) {
            this.fetchFulfillers(newProps.accessToken);
        } else if (newProps.accessToken && this.props.includeArchived !== newProps.includeArchived) {
            this.fetchFulfillers(newProps.accessToken, newProps.includeArchived);
        }
    }

    componentDidMount() {
        if (!this.props.accessToken) {
            return;
        }

        if (!this.props.fulfillers) {
            this.fetchFulfillers(this.props.accessToken);
        }

        this.getRecentFulfillerIds();
    }

    onChange(e) {
        this.setState({
            selectedFulfillerId: e.fulfillerId
        });

        if (this.props.onChange) {
            this.props.onChange({value: this.fulfillerMap[e.fulfillerId]});
        }

        this.updateRecentFulfillerIds(e.fulfillerId);
    }

    async getRecentFulfillerIds() {
        let settings = await this.customizrClient.getSettings(this.props.accessToken);
        let recentFulfillerIds = settings.recentFulfillerIds;
        this.setState({ recentFulfillerIds });
        return recentFulfillerIds;
    }

    async updateRecentFulfillerIds(fulfillerId) {
        let recentFulfillerIds = await this.getRecentFulfillerIds();
        let update = { recentFulfillerIds: [fulfillerId].concat(recentFulfillerIds.filter(id => id !== fulfillerId)) };
        this.setState(update);
        this.customizrClient.putSettings(this.props.accessToken, update);
    }

    getOptions() {
        let fulfillers = this.state.fulfillers || this.props.fulfillers;

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

        let fulfillerOptions = fulfillers.map(f => Object.assign({}, f, {
            optionRenderer: this.fulfillerSingleOptionRenderer,
            value: `${f.fulfillerId} ${f.name}` // 'value' required for search and focus style change functionality
        }));

        let recentFulfillerOptions = this.state.recentFulfillerIds
            .slice(0, 5)
            .map(id => fulfillerOptions.find(f => f.fulfillerId === id))
            .filter(f => f && !f.archived)
            .map((f, index) => Object.assign({}, f, { value: `recent${index}` })); // do not highlight or show in search results

        let recentFulfillersOptionGroupLabelOption = {
            text: "Recently selected fulfillers",
            optionRenderer: this.fulfillerOptionGroupLabelOptionRenderer
        };
        let fulfillersOptionGroupLabelOption = {
            text: "All fulfillers",
            optionRenderer: this.fulfillerOptionGroupLabelOptionRenderer
        };

        return [
            recentFulfillersOptionGroupLabelOption,
            ...recentFulfillerOptions,
            fulfillersOptionGroupLabelOption,
            ...fulfillerOptions
        ];
    }

    variableOptionRenderer(options) {
        return options.option.optionRenderer(options);
    }

    fulfillerSpinnerOptionRenderer({ option, key, style }) {
        return (
            <div
                className="VirtualizedSelectOption VirtualizedSelectDisabledOption"
                style={style}
                key={key}>
                <span className="FulfillerSelect-vertical-center">
                    <Spinner className="FulfillerSelect-Spinner-20" size={20}/>
                    <span className="FulfillerSelect-Spinner-text">
                        {options.option.text}
                    </span>
                </span>
            </div>
        );
    }

    fulfillerWarningMessageOptionRenderer({ option, key, style }) {
        return (
            <div
                className="VirtualizedSelectOption VirtualizedSelectDisabledOption"
                style={style}
                key={key}>
                <span>
                    {options.option.text}
                </span>
            </div>
        );
    }

    fulfillerOptionGroupLabelOptionRenderer({ option, key, style }) {
        return (
            <div
                className="VirtualizedSelectOption FulfillerSelect-option-group-label"
                style={style}
                key={key}>
            <strong>{option.text}</strong>
        </div>
        );
    }

    fulfillerSingleOptionRenderer ({ focusedOption, focusOption, key, option, selectValue, style, valueArray }) {
        let className = ["VirtualizedSelectOption"];
        let content = this.formatTitle(option) || this.tt('misconfigured');

        if (option.archived) {
            className.push("VirtualizedSelectDisabledOption");
        }

        if (option.fulfillerId === focusedOption.fulfillerId) {
          className.push('VirtualizedSelectFocusedOption')
        }

        if (valueArray && valueArray.find(value => value.fulfillerId === option.fulfillerId)) {
          className.push('VirtualizedSelectSelectedOption')
        }

        const events = { 
            onClick: () => selectValue(option),
            onMouseEnter: () => focusOption(option)
        };

        return (
          <div
            className={className.join(' ')}
            key={key}
            title={option.fulfillerId}
            style={style}
            {...events}>
            {content}
          </div>
        )
    }

    fulfillerValueRenderer (option) {
        return this.formatTitle(option) || this.tt('misconfigured');
    }

    formatTitle(fulfiller) {
        let content = null;

        if (this.props.includeName) {
            if (this.props.includeId && this.props.includeInternalId) {
                content = <span>{fulfiller.name} ({fulfiller.fulfillerId} / <span
                    className={"text-muted"}>{fulfiller.internalFulfillerId}</span>)</span>;
            } else if (this.props.includeId) {
                content = <span>{fulfiller.name} ({fulfiller.fulfillerId})</span>;
            } else if (this.props.includeInternalId) {
                content = <span>{fulfiller.name} (<span className={"text-muted"}>{fulfiller.internalFulfillerId}</span>)</span>;
            } else {
                content = fulfiller.name;
            }
        } else {
            if (this.props.includeId && this.props.includeInternalId) {
                content = <span>{fulfiller.fulfillerId} / <span className={"text-muted"}>{fulfiller.internalFulfillerId}</span></span>;
            } else if (this.props.includeId) {
                content = <span>{fulfiller.fulfillerId}</span>;
            } else if (this.props.includeInternalId) {
                content = <span className={"text-muted"}>{fulfiller.internalFulfillerId}</span>;
            }
        }

        return content;
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {
        return (
            <div className="filfiller-select-wrapper">
                <SelectWrapper
                    selectedSelect={VirtualizedSelect}
                    label={this.props.label || this.tt('label')}
                    value={this.fulfillerMap[this.state.selectedFulfillerId]}
                    options={this.getOptions()}
                    noResultsText={this.tt('no-results-found')}
                    clearable={false}
                    onChange={this.onChange}
                    optionRenderer={this.variableOptionRenderer}
                    valueRenderer={this.fulfillerValueRenderer}
                    tether/>
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

    // functions and buttons
    onChange: PropTypes.func,

    // display
    language: PropTypes.string,
    label: PropTypes.string,
    includeArchived: PropTypes.bool,
    includeId: PropTypes.bool,
    includeInternalId: PropTypes.bool,
    includeName: PropTypes.bool
};

FulfillerSelect.defaultProps = {
    language: 'eng',
    includeArchived: false,
    includeId: true,
    includeInternalId: false,
    includeName: true
};

export default translate('translations', {i18n: getI18nInstance()})(FulfillerSelect);
