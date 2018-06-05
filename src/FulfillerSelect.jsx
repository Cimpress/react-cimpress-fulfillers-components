import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-virtualized-select';
import SelectWrapper from '@cimpress/react-components/lib/SelectWrapper';
import {shapes} from '@cimpress/react-components';
import {getFulfillers} from './apis/fi.api';

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
            selectedFulfillerId: undefined
        };
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
        if ( this.props.accessToken !== newProps.accessToken ) {
            this.fetchFulfillers(newProps.accessToken);
        } else if ( newProps.accessToken && this.props.includeArchived !== newProps.includeArchived ) {
            this.fetchFulfillers(newProps.accessToken, newProps.includeArchived);
        }
    }

    componentDidMount() {
        if ( this.props.accessToken && !this.props.fulfillers ) {
            this.fetchFulfillers(this.props.accessToken);
        }
    }

    getTitle(f) {
        let content = this.tt('misconfigured');

        if ( this.props.includeName ) {
            if ( this.props.includeId && this.props.includeInternalId ) {
                content = <span>{f.name} ({this.tt('id')}: {f.fulfillerId} / <span
                    className={"text-muted"}>{f.internalFulfillerId}</span>)</span>;
            } else if ( this.props.includeId || this.props.includeInternalId ) {
                content = <span>{f.name} ({this.tt('id')}: {f.fulfillerId || f.internalFulfillerId})</span>;
            } else {
                content = f.name;
            }
        } else {
            if ( this.props.includeId && this.props.includeInternalId ) {
                content = <span>{this.tt('id')}: {f.fulfillerId} / <span className={"text-muted"}>{f.internalFulfillerId}</span></span>;
            } else if ( this.props.includeId || this.props.includeInternalId ) {
                content = <span>{this.tt('id')}: {f.fulfillerId || f.internalFulfillerId}</span>;
            }
        }

        return (f.archived)
            ? <span className="text-muted">{content}</span>
            : content;
    }

    getOptions(fulfillers) {

        if ( !fulfillers ) {
            if ( this.state.fetchingFulfillers ) {
                return [{
                    value: null,
                    label: <span><span style={{display: "inline"}}><Spinner
                        size={20}/></span>&nbsp;{this.tt('loading')}</span>
                }];
            }

            return [
                {value: null, label: <span>{this.tt('no-data')}</span>}
            ];
        }

        return fulfillers.map(f => {
            let v = `${f.fulfillerId} ${f.internalFulfillerId} ${f.name}`;
            this.fulfillerMap[v] = f;
            return {
                value: v,
                label: this.getTitle(f)
            }
        });
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {

        let fulfillers = this.state.fulfillers || this.props.fulfillers;

        return (
            <div className="filfiller-select-wrapper">
                <SelectWrapper
                    selectedSelect={Select}
                    label={this.props.label || this.tt('label')}
                    value={this.state.selectedFulfillerId}
                    options={this.getOptions(fulfillers)}
                    noResultsText={this.tt('no-results-found')}
                    clearable={false}
                    onChange={(v) => {
                        this.setState({
                            selectedFulfillerId: v.value
                        });
                        if ( this.props.onChange ) {
                            this.props.onChange({value: this.fulfillerMap[v.value]});
                        }
                    }}
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
    includeInternalId: true,
    includeName: true
};

export default translate('translations', {i18n: getI18nInstance()})(FulfillerSelect);