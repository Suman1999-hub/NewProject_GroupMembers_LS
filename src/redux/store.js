import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import storage from "redux-persist/lib/storage";
import { loaderDataReducer, userCredentialReducer } from "./reducers";

const rootReducer = combineReducers({
  userCredential: userCredentialReducer,
  loaderData: loaderDataReducer,
});

const persistConfig = {
  key: "root",
  storage,
  keyPrefix: "",
  stateReconciler: hardSet,
  blacklist: ["loaderData"],
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: pReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
