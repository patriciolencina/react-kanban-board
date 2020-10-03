import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'components/FormControls/Button/Button';
import styles from './Column.module.scss';

ColumnCreate.propTypes = {
  onStartCreateColumn: PropTypes.func.isRequired,
  isCreatingColumn: PropTypes.bool.isRequired,
};

function ColumnCreate({ isCreatingColumn, onStartCreateColumn }) {
  return (
    <div className={classes(styles.column, styles['column--create'])}>
      <div className={styles.column__buttons}>
        <Button
          className={styles.column__btn}
          onClick={onStartCreateColumn}
          disabled={isCreatingColumn}
          icon={<FontAwesomeIcon icon={faPlus} size="sm" />}
        >
          Add another list
        </Button>
      </div>
    </div>
  );
}

export { ColumnCreate };
