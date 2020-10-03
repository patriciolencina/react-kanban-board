import { combineReducers } from '@reduxjs/toolkit';
import tasks from './tasks';

export function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    ...injectedReducers,
    tasks,
  });

  return rootReducer;
}
