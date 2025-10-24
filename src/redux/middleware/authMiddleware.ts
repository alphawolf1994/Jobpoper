import { setAuthToken } from '../../api/axiosInstance';

export const authMiddleware = (store: any) => (next: any) => (action: any) => {
  // Check if the action is a rehydration from redux-persist
  if (action.type === 'persist/REHYDRATE' && action.payload?.auth?.accessToken) {
    // Set the token in axios when the store is rehydrated
    setAuthToken(action.payload.auth.accessToken);
  }
  
  return next(action);
};
