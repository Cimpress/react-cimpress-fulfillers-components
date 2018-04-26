import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ComponentDoc extends Component {
    render() {
        const propsTable = (
            <div className="col-md-12">
                <h3>Props</h3>
                <div>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>{this.props.propInfos.map(el => <el.type key={el.props.name} {...el.props} />)}</tbody>
                    </table>
                </div>
            </div>
        );

        return (
            <div>
                <a name={this.props.name} />
                <div className="row" style={{ paddingBottom: '10px' }}>
                    <h2>{this.props.name}</h2>
                    {this.props.propInfos.length ? propsTable : null}
                    <div>{this.props.remarks}</div>
                </div>

                {this.props.children ? (
                    <div className="row" style={{ paddingBottom: '30px' }}>
                        <h3>{this.props.demoName}</h3>
                        {this.props.children}
                    </div>
                ) : null}
            </div>
        );
    }
}

ComponentDoc.propTypes = {
    name: PropTypes.string.isRequired,
    demoName: PropTypes.string,
    propInfos: PropTypes.arrayOf(PropTypes.node),
    remarks: PropTypes.element,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
};

ComponentDoc.defaultProps = {
    propInfos: [],
    demoName: 'Demo'
};
