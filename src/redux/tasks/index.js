/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const tasksAdapter = createEntityAdapter({});

const initialState = {
  newListTitle: '',
  newCardTitles: {},
  isTasksLoading: false,
  isLoadingNewList: false,
  isDeletingCard: false,
  isDeletingList: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState(initialState),
  reducers: {
    getTasks(state) {
      state.isTasksLoading = true;
    },
    tasksReceived(state, action) {
      state.isTasksLoading = false;
      tasksAdapter.setAll(state, action.payload);
    },
    tasksFailed(state) {
      state.isTasksLoading = false;
    },
    startCreateList(state) {
      state.isLoadingNewList = true;
    },
    createdList(state, action) {
      const newList = action.payload;
      newList.id = uuidv4();
      newList.cards = [];
      tasksAdapter.addOne(state, action.payload);
      state.newListTitle = '';
      state.isLoadingNewList = false;
    },
    startDeletingList(state) {
      state.isDeletingList = true;
    },
    deletedList(state, action) {
      tasksAdapter.removeOne(state, action.payload);
      state.isDeletingList = false;
    },
    onChangeNewListTitle(state, action) {
      state.newListTitle = action.payload;
    },
    startCreateCard(state, action) {
      state.entities[action.payload.listId].isCreatingCard = true;
    },
    createdCard(state, action) {
      const { listId, card } = action.payload;
      const updatedList = tasksAdapter.getSelectors().selectById(state, listId);
      const updatedCards = updatedList.cards;
      const newCard = card;
      newCard.id = uuidv4();
      newCard.order = updatedList.cards.length;

      updatedCards.push(newCard);

      updatedList.isCreatingCard = false;
      state.newCardTitles[listId] = '';
      tasksAdapter.updateOne(state, {
        id: listId,
        cards: updatedCards,
      });
    },
    startDeletingCard(state) {
      state.isDeletingCard = true;
    },
    deletedCard(state, action) {
      const { listId, cardId } = action.payload;
      const updatedList = tasksAdapter.getSelectors().selectById(state, listId);
      const updatedCards = updatedList.cards;
      const deletedCardIdx = updatedCards.findIndex(
        (card) => card.id === cardId
      );
      if (deletedCardIdx > -1) {
        updatedList.cards.splice(deletedCardIdx, 1);
      }

      tasksAdapter.updateOne(state, {
        id: listId,
        cards: updatedCards,
      });
      state.isDeletingCard = false;
    },
    onChangeNewCardTitle(state, action) {
      const { listId, value = '' } = action.payload;
      state.newCardTitles[listId] = value;
    },
    changeCardOrder() {},
    changedCardOrder(state, action) {
      const { cardId, toListId, fromListId, toOrder, fromOrder } = action.payload;
      const toUpdatedList = tasksAdapter
        .getSelectors()
        .selectById(state, toListId);
      const fromUpdatedList = tasksAdapter
        .getSelectors()
        .selectById(state, fromListId);
      const toUpdatedCards = toUpdatedList.cards;
      const fromUpdatedCards = fromUpdatedList.cards;

      if (toListId === fromListId) {
        const updatedCard = toUpdatedCards.find((card) => card.id === cardId);

        toUpdatedCards.splice(fromOrder, 1);
        toUpdatedCards.splice(toOrder, 0, updatedCard);

        const startReordering =
          updatedCard.order > toOrder ? toOrder : fromOrder;
        const endReordering = updatedCard.order > toOrder ? fromOrder : toUpdatedCards.length - 1;

        for (let i = startReordering; i <= endReordering; i += 1) {
          const card = toUpdatedCards[i];
          card.order = i;
        }
        updatedCard.order = toOrder;

        tasksAdapter.updateOne(state, {
          id: toListId,
          cards: toUpdatedCards,
        });
      } else {
        const updatedCard = fromUpdatedCards.find((card) => card.id === cardId);
        updatedCard.order = toOrder;

        fromUpdatedCards.splice(fromOrder, 1);
        toUpdatedCards.splice(toOrder, 0, updatedCard);

        const startReorderingToList = toOrder;
        const endReorderingToList = toUpdatedCards.length - 1;
        for (let i = startReorderingToList; i <= endReorderingToList; i += 1) {
          const card = toUpdatedCards[i];
          card.order = i;
        }

        const startReorderingFromList = fromOrder;
        const endReorderingFromList = fromUpdatedCards.length - 1;
        for (
          let i = startReorderingFromList;
          i <= endReorderingFromList;
          i += 1
        ) {
          const card = fromUpdatedCards[i];
          card.order = i;
        }

        tasksAdapter.updateMany(state, [
          {
            id: toListId,
            cards: toUpdatedList,
          },
          {
            id: fromListId,
            cards: fromUpdatedList,
          },
        ]);
      }
    },
    changeListOrder() {},
    changedListOrder(state, action) {
      const { listId, toOrder, fromOrder } = action.payload;
      const entities = tasksAdapter.getSelectors().selectEntities(state);
      const ids = tasksAdapter.getSelectors().selectIds(state);
      const updatedList = tasksAdapter.getSelectors().selectById(state, listId);

      ids.splice(fromOrder, 1);
      ids.splice(toOrder, 0, listId);

      const startReordering = toOrder > updatedList.order ? fromOrder : toOrder;
      const endReordering = toOrder > updatedList.order ? toOrder : fromOrder;
      const updatedEntities = [];

      for (let i = startReordering; i <= endReordering; i += 1) {
        const id = ids[i];
        const list = entities[id];

        list.order = i;
        updatedEntities.push(list);
      }
      updatedList.order = toOrder;

      tasksAdapter.updateMany(state, updatedEntities);
    },
  },
});

export const TasksActions = tasksSlice.actions;
export const TasksSelectors = tasksAdapter.getSelectors((state) => state.tasks);

export default tasksSlice.reducer;
