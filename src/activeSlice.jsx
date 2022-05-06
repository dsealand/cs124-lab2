import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tab: null,
  sortOrder: "priority desc"
}

const activeSlice = createSlice({
  name: 'active',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {state.tab = action.payload},
    setActiveSortOrder: (state, action) => {state.sortOrder = action.payload}
  }
})

export const { setActiveTab, setActiveSortOrder } = activeSlice.actions;
export default activeSlice.reducer;