import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../rtk/features/apis/apiSlice";
import authSlice from "../rtk/features/auth/authSlice";
import conversationSlice from "../rtk/features/conversation/conversationSlice";
import messageSlice from "../rtk/features/messages/messageSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    conversions: conversationSlice,
    messages: messageSlice,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(apiSlice.middleware),
});

export default store;
