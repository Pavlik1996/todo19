import { createSlice } from '@reduxjs/toolkit';
import { appActions } from 'app/app.reducer';
import { authAPI, LoginParamsType } from 'features/auth/auth.api';
import { clearTasksAndTodolists } from 'common/actions';
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils';

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login', async (data, thunkAPI) => {
	const { dispatch, rejectWithValue } = thunkAPI
	try {
		const res = await authAPI.login(data)
		if (res.data.resultCode === 0) {
			dispatch(appActions.setAppStatus({ status: 'succeeded' }))
			return { isLoggedIn: true }
		} else {
			handleServerAppError(res.data, dispatch)
			return rejectWithValue(null)
		}
	} catch (e) {
		handleServerNetworkError(e, dispatch)
		return rejectWithValue(null)
	}
})

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/logout', async (__, thunkAPI) => {
	const { dispatch, rejectWithValue } = thunkAPI;
	try {
		const res = await authAPI.logout();
		if (res.data.resultCode === 0) {
			dispatch(clearTasksAndTodolists());
			dispatch(appActions.setAppStatus({ status: 'succeeded' }));
			return {isLoggedIn: false}
		} else {
			handleServerAppError(res.data, dispatch);
			return rejectWithValue(null);
		}
	} catch (e) {
		handleServerNetworkError(e, dispatch);
		return rejectWithValue(null);
	}
})

const slice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(login.fulfilled, (state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			})
			.addCase(logOut.fulfilled, (state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			})
	}
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login, logOut }


