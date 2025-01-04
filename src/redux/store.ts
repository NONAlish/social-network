import { configureStore } from "@reduxjs/toolkit";
import messegeReducer from "./messageSlice";
import marathonsReducer from "./marathonsSlice"; // импортируем marathonsSlice

// Используйте store, а не StorageEvent
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    messages: messegeReducer,
    marathons: marathonsReducer, // добавляем marathonsReducer
  },
});

export default store;
