import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, color, colorId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.colorId === colorId
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    decreaseQuantity: (state, action) => {
      const { id, colorId } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.colorId === colorId
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.items = state.items.filter(
            (item) => !(item.id === id && item.colorId === colorId)
          );
        }
      }
    },
    removeFromCart: (state, action) => {
      const { id, colorId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.colorId === colorId)
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart, decreaseQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
