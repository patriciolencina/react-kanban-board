import React, { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from 'classnames';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TasksActions } from 'redux/tasks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'components/FormControls/Button/Button';
import { Textarea } from 'components/FormControls/Textarea/Textarea';
import { DeleteModal } from 'components/Columns/DeleteModal/DeleteModal';
import { ColumnTitle } from '../ColumnTitle/ColumnTitle';
import { ColumnCards } from '../ColumnCards/ColumnCards';
import styles from './Column.module.scss';

Column.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.object),
  onDeleteList: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
};
Column.defaultProps = {
  cards: [],
};

function Column({
  index,
  id,
  title,
  cards,
  onDeleteList,
  onAddCard,
  onDeleteCard,
}) {
  const column = useSelector(
    (state) => state.tasks.entities[id],
    (prevProp, nextProp) => {
      const isNotChangedCards = prevProp.cards === nextProp.cards;
      const isNotChangedCardsLength =
        prevProp.cards.length === nextProp.cards.length;
      const isNotChangedCreatingFlag =
        prevProp.isCreatingCard === nextProp.isCreatingCard;

      return isNotChangedCards && isNotChangedCardsLength && isNotChangedCreatingFlag;
    }
  );
  const newCardTitle = useSelector(
    (state) => state.tasks.newCardTitles[id],
    (prevProp, nextProp) => prevProp === nextProp
  );
  const [isStartedCreatingCard, setIsStartedCreatingCard] = useState(false);
  const [isStartedDeletingList, setIsStartedDeletingList] = useState(false);
  const dispatch = useDispatch();
  const cardTextareaRef = useRef();
  const columnCardsRef = useRef();

  useEffect(() => {
    const textareaElement = cardTextareaRef.current;

    if (!isStartedCreatingCard || !textareaElement) return;

    textareaElement.addEventListener('keypress', handleTextArea);

    // eslint-disable-next-line
    return () => {
      if (!textareaElement) return;

      textareaElement.removeEventListener('keypress', handleTextArea);
    };
  }, [cardTextareaRef, isStartedCreatingCard, newCardTitle]);

  function handleTextArea(e) {
    if (e && Number(e.which) === 13) {
      e.preventDefault();
      onCreateCard();
    }
  }

  function toggleStartDeletingList(e) {
    e.stopPropagation();

    setIsStartedDeletingList((prevState) => !prevState);
  }

  function toggleStartCreatCard() {
    if (!isStartedCreatingCard) {
      dispatch(
        TasksActions.onChangeNewCardTitle({
          listId: id,
          value: '',
        })
      );
    }

    setIsStartedCreatingCard((prevState) => !prevState);
  }

  function onChangeNewCardValue(e) {
    const { value } = e.target;

    dispatch(
      TasksActions.onChangeNewCardTitle({
        listId: id,
        value,
      })
    );
  }

  function onDelList() {
    onDeleteList(id);
  }

  function onCreateCard() {
    if (!newCardTitle.trim().length) return;
    onAddCard({
      listId: id,
      title: newCardTitle,
    });
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(providedColumns) => (
        <>
          <div
            ref={providedColumns.innerRef}
            className={styles.column}
            {...providedColumns.draggableProps}
          >
            <div
              className={styles.column__header}
              {...providedColumns.dragHandleProps}
            >
              <ColumnTitle>{title}</ColumnTitle>
              <Button
                displayType="icon"
                className={styles['column__delete-list-btn']}
                onClick={toggleStartDeletingList}
                color="red"
                icon={<FontAwesomeIcon icon={faTrashAlt} />}
              />
            </div>

            <div
              ref={columnCardsRef}
              className={classes(
                styles.column__cards,
                `dashboard__column-${id}-cards`
              )}
            >
              <Droppable droppableId={id} type="card">
                {(providedCards) => (
                  <div
                    ref={providedCards.innerRef}
                    className={styles['column__drop-zone']}
                    {...providedCards.droppableProps}
                  >
                    <ColumnCards
                      id={id}
                      cards={cards}
                      onDeleteCard={onDeleteCard}
                    />
                    {providedCards.placeholder}
                  </div>
                )}
              </Droppable>

              {isStartedCreatingCard && (
                <Textarea
                  inputRef={cardTextareaRef}
                  value={newCardTitle}
                  onChange={onChangeNewCardValue}
                  placeholder="Enter a title for this card..."
                  minRows={3}
                  maxRows={7}
                  autoFocus
                />
              )}
            </div>
            <div className={styles.column__buttons}>
              {isStartedCreatingCard && (
                <>
                  <Button
                    className={styles['column__btn--create']}
                    onClick={onCreateCard}
                    loading={column.isCreatingCard}
                    color="green"
                    icon={<FontAwesomeIcon icon={faPlus} size="sm" />}
                  >
                    Add Card
                  </Button>
                  <Button
                    displayType="icon"
                    onClick={toggleStartCreatCard}
                    className={styles['column__btn--cancel']}
                    color="transparent"
                    disabled={column.isCreatingCard}
                    icon={<FontAwesomeIcon icon={faTimes} size="lg" />}
                  />
                </>
              )}
              {!isStartedCreatingCard && (
                <Button
                  onClick={toggleStartCreatCard}
                  className={styles.column__btn}
                  icon={<FontAwesomeIcon icon={faPlus} size="sm" />}
                >
                  Add a card
                </Button>
              )}
            </div>
          </div>

          {isStartedDeletingList && (
            <DeleteModal
              title={title}
              maxWidth={400}
              onDelete={onDelList}
              onCancel={toggleStartDeletingList}
            />
          )}
        </>
      )}
    </Draggable>
  );
}

const memoizedComponent = memo(Column, (oldProps, newProps) => {
  const isNotChangedOrder = oldProps.index === newProps.index;
  const isNotChangedCards = oldProps.cards === newProps.cards;

  return isNotChangedCards && isNotChangedOrder;
});

export { memoizedComponent as Column };
