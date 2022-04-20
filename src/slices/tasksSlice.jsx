import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: []
  },
  reducers: {
    dummy: (state) => state
  }
});

export const { dummy } = tasksSlice.actions

export const selectCompleted = (state) => {
  return state.filter(t=>t.isCompleted)
}

export const selectNotCompleted = (state) => {
  return state.filter(t=>!t.isCompleted)
}

export default tasksSlice.reducer