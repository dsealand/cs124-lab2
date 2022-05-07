import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tab: null,
  sortOrder: ["priority", "desc"],
  showCompleted: true,
}

const activeSlice = createSlice({
  name: 'active',
  initialState,
  reducers: {
    setActiveTabID: (state, action) => {state.tab = action.payload},
    setSortOrder: (state, action) => {state.sortOrder = action.payload},
    setShowCompleted: (state, action) => {state.showCompleted = action.payload}
  }
})

export const { setActiveTabID, setSortOrder, setShowCompleted } = activeSlice.actions;
export default activeSlice.reducer;