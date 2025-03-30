import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Lưu trữ trong localStorage
import { productApi } from "./features/products";
import cartReducer from "./slices/cartSlice";
import { orderApi } from "./features/orders";
import { reviewApi } from "./features/reviews";
import { blogApi } from "./features/blogs";
import { userApi } from "./features/users";
import { momoApi } from "./features/momo";
import { saleApi } from "./features/sales";

// Gộp tất cả reducer thành 1 rootReducer
const rootReducer = combineReducers({
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [reviewApi.reducerPath]: reviewApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [momoApi.reducerPath]: momoApi.reducer,
  [saleApi.reducerPath]: saleApi.reducer,

  cart: cartReducer,
});

// Cấu hình redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // Chỉ persist giỏ hàng
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      productApi.middleware,
      orderApi.middleware,
      reviewApi.middleware,
      blogApi.middleware,
      userApi.middleware,
      momoApi.middleware,
      saleApi.middleware
    ),
});

export const persistor = persistStore(store);
export default store;
