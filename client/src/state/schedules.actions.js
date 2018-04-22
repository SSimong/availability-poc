import {
  SET_SELECTED_DATE,
  SET_SELECTED_REQUESTS,
  SET_SELECTED_SCHEDULE,
  START_WEEK_CHANGE,
} from '../state/constants';

export const setSelectedDate = date => ({
  type: SET_SELECTED_DATE,
  date,
});

export const setSelectedSchedule = schedule => ({
  type: SET_SELECTED_SCHEDULE,
  schedule,
});

export const setSelectedRequests = requests => ({
  type: SET_SELECTED_REQUESTS,
  requests,
});

export const startWeekChange = () => ({
  type: START_WEEK_CHANGE,
});