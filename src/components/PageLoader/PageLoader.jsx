import React from 'react';
import classes from 'classnames';
import PropTypes from 'prop-types';
import styles from './PageLoader.module.scss';

PageLoader.propTypes = {
  isLoading: PropTypes.bool,
};

PageLoader.defaultProps = {
  isLoading: false,
};

function PageLoader({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div
      className={classes(
        styles.box,
        { [styles.loading]: isLoading },
        { [styles.loaded]: !isLoading }
      )}
    >
      <div className={styles.spinner}>
        <span>Loading...</span>
      </div>
    </div>
  );
}

export { PageLoader };
