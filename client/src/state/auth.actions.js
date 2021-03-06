import { client } from '../app';
import { SET_CURRENT_USER, LOGOUT } from '../state/constants';

export const setCurrentUser = user => ({
  type: SET_CURRENT_USER,
  user,
});

export const logout = () => {
  // we run this on the next frame so that the reducer has time to complete before
  // we fully wipe the store. Otherwise some stuff gets left over.
  setTimeout(client.resetStore);
  return { type: LOGOUT };
};
