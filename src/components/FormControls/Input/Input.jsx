import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import styles from './Input.module.scss';

Input.propTypes = {
  className: PropTypes.string,
};

function Input({ className, ...props }) {
  return <input className={classes(className, styles.input)} {...props} />;
}

export { Input };
