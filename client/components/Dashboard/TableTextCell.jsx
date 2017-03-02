import React, { Component } from 'react';
import TableCell from './TableCell';

class TableTextCell extends Component {
  render() {
    const children = (typeof this.props.children === 'undefined') ? '' : this.props.children;
    if (this.props.onClick) {
      return <TableCell>
        <a href="#" onClick={() => this.props.onClick()} title={ children }>{ children }</a>
      </TableCell>;
    }

    return <TableCell>
      <span title={ children }>{ children }</span>
    </TableCell>;
  }
}

TableTextCell.propTypes = {
  onClick: React.PropTypes.func
};

export default TableTextCell;
