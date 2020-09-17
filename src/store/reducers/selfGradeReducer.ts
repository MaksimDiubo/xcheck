import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { getTasks } from '../../services/heroku';
import { ITask } from 'src/models';

type selfGradeType = {
  task: ITask | null;
  loading: boolean;
  error: boolean;
  taskScore: scoreType;
};

type ItemsType = {
  id: string
  score: number
  comment: string
}

type scoreType = {
  taskName: string
  items: Array<ItemsType>
}


const initialState: selfGradeType = {
  task: null,
  loading: false,
  error: false,
  taskScore: {
    taskName: '',
    items: []
  }
}

const selfGradeSlice = createSlice({
  name: 'selfGrade',
  initialState,
  reducers: {
    loadTasks(state) {
      state.loading = true
    },
    loadTaskSuccess(state, action) {
      state.loading = false
      state.task = action.payload
      state.taskScore.taskName = action.payload.id
      state.taskScore.items = action.payload.items.map((item: any) => {
        return {
          id: item.id,
          score: '',
          comment: '',
        }
      })
    },
    getTasksError(state, action) {
      state.error = action.payload;
    }
  }
})

export const {
  loadTasks,
  loadTaskSuccess,
  getTasksError,
} = selfGradeSlice.actions



export const fetchTasks = (taskName: string): AppThunk => async dispatch => {
  try {
    dispatch(loadTasks());
    const response = await getTasks();
    const tasks = await response.json();
    const taskToCheck = tasks.find((task: { id: any; }) => {
      if (task.id !== taskName) {
        return null;
      }
      return task;
    });
    dispatch(loadTaskSuccess(taskToCheck));
  } catch (err) {
    dispatch(getTasksError(err));
  }
}

export default selfGradeSlice.reducer;
