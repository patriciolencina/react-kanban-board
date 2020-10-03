import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from 'components/FormControls/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DeleteModal } from 'components/Columns/DeleteModal/DeleteModal';
import styles from './ColumnCard.module.scss';

ColumnCard.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  listId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
};

function ColumnCard({ index, id, listId, title, onDeleteCard }) {
  const [isInitedDelete, setIsInitedDelete] = useState(false);

  function toggleInitDelete() {
    setIsInitedDelete((prevState) => !prevState);
  }

  function onDelete() {
    onDeleteCard(listId, id);
  }

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div
              className={classes(styles.card, {
                [styles['card--is-dragging']]: snapshot.isDragging,
              })}
            >
              {title}
              <Button
                displayType="icon"
                className={styles['card__delete-btn']}
                onClick={toggleInitDelete}
                color="red"
                icon={<FontAwesomeIcon icon={faTimes} size="lg" />}
              />
            </div>
          </div>
        )}
      </Draggable>

      {isInitedDelete && (
        <DeleteModal
          title={title}
          onDelete={onDelete}
          onCancel={toggleInitDelete}
        />
      )}
    </>
  );
}

const memoizedComponent = memo(ColumnCard, (oldProps, newProps) => {
  const isNotChangedOrder = oldProps.index === newProps.index;

  return isNotChangedOrder;
});

export { memoizedComponent as ColumnCard };
