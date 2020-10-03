import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'components/FormControls/Button/Button';
import { Input } from 'components/FormControls/Input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { TasksActions } from 'redux/tasks';
import styles from './Column.module.scss';

ColumnNew.propTypes = {
  toggleStartedCreatingColumn: PropTypes.func.isRequired,
  onAddList: PropTypes.func.isRequired,
};

function ColumnNew({ toggleStartedCreatingColumn, onAddList }) {
  const newListTitle = useSelector((state) => state.tasks.newListTitle);
  const isLoadingNewList = useSelector((state) => state.tasks.isLoadingNewList);
  const dispatch = useDispatch();

  function onChangeTitle(e) {
    const { value } = e.target;

    dispatch(TasksActions.onChangeNewListTitle(value));
  }

  function handleAddList(e) {
    e.preventDefault();
    if (!newListTitle.trim().length) return;

    onAddList(newListTitle);
  }

  return (
    <form className={classes(styles.column, styles['column--new'])} onSubmit={handleAddList} >
      <div className={styles.column__header}>
        <Input
          className={styles.column__headerInput}
          value={newListTitle}
          onChange={onChangeTitle}
          autoFocus
          placeholder="Enter list title..."
        />
      </div>
      <div className={styles.column__buttons}>
        <Button
          type='submit'
          className={styles['column__btn--create']}
          loading={isLoadingNewList}
          color="green"
          icon={<FontAwesomeIcon icon={faPlus} size="sm" />}
        >
          Add List
        </Button>
        <Button
          displayType="icon"
          className={styles['column__btn--cancel']}
          onClick={toggleStartedCreatingColumn}
          disabled={isLoadingNewList}
          color="transparent"
          icon={<FontAwesomeIcon icon={faTimes} size="lg" />}
        />
      </div>
    </form>
  );
}

export { ColumnNew };
