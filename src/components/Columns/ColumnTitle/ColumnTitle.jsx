import React from 'react';
import PropTypes from 'prop-types';
import styles from './ColumnTitle.module.scss';

ColumnTitle.propTypes = {
  children: PropTypes.node,
};

function ColumnTitle({ children }) {
  return <h3 className={styles.title}>{children}</h3>;
}

export { ColumnTitle };
