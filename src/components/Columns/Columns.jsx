import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ColumnCreate } from './Column/ColumnCreate';
import { ColumnNew } from './Column/ColumnNew';
import { Column } from './Column/Column';
import styles from './Columns.module.scss';

Columns.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  onAddList: PropTypes.func.isRequired,
  onDeleteList: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
  onChangeCardOrder: PropTypes.func.isRequired,
  onChangeListOrder: PropTypes.func.isRequired,
};
Columns.defaultProps = {
  columns: [],
};

function Columns({
  columns,
  onAddList,
  onDeleteList,
  onAddCard,
  onDeleteCard,
  onChangeCardOrder,
  onChangeListOrder,
}) {
  const [isStartedCreatingColumn, setIsStartedCreatingColumn] = useState(false);

  function toggleStartedCreatingColumn() {
    setIsStartedCreatingColumn((prevState) => !prevState);
  }

  function onDragEnd(result) {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'list') {
      onDragListEnd(result);
    }

    if (type === 'card') {
      onDragCardEnd(result);
    }
  }

  function onDragListEnd(result) {
    const { destination, source, draggableId } = result;

    const toOrder = destination.index;
    const fromOrder = source.index;

    onChangeListOrder({
      listId: draggableId,
      toOrder,
      fromOrder,
    });
  }

  function onDragCardEnd(result) {
    const { destination, source, draggableId } = result;

    const toListId = destination.droppableId;
    const fromListId = source.droppableId;
    const toOrder = destination.index;
    const fromOrder = source.index;

    onChangeCardOrder({
      cardId: draggableId,
      toListId,
      fromListId,
      toOrder,
      fromOrder,
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" direction="horizontal" type="list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            className={styles.columns}
            {...provided.droppableProps}
          >
            {columns.map((column, index) => (
              <Column
                index={index}
                key={column.id}
                id={column.id}
                cards={column.cards}
                title={column.title}
                onAddCard={onAddCard}
                onDeleteList={onDeleteList}
                onDeleteCard={onDeleteCard}
              />
            ))}
            {provided.placeholder}
            {isStartedCreatingColumn && (
              <ColumnNew
                onAddList={onAddList}
                toggleStartedCreatingColumn={toggleStartedCreatingColumn}
              />
            )}
            <ColumnCreate
              isCreatingColumn={isStartedCreatingColumn}
              onStartCreateColumn={toggleStartedCreatingColumn}
            />
            <div className={styles['columns__demy-column']} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export { Columns };
