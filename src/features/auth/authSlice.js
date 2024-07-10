import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import errorHandler from '../../helpers/errorHandler';
import authService from './authService'




const initialState = {
  user: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null,
  status: false,
  message: '',
  role: JSON.parse(localStorage.getItem('role')) ? JSON.parse(localStorage.getItem('role')) : null,
  keys: null,
  subToken: JSON.parse(localStorage.getItem('subscription_token')) ? JSON.parse(localStorage.getItem('subscription_token')) : null,
  currentPlan: null
}

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
export const signup = createAsyncThunk('auth/signup', async (user, thunkAPI) => {
  try {
    return await authService.signup(user)
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
export const signupOTP = createAsyncThunk('auth/signupOTP', async (user, thunkAPI) => {
  try {
    return await authService.signupOTP(user)
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
export const me = createAsyncThunk('auth/me', async (user, thunkAPI) => {
  try {
    return await authService.me(user)
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})
// update user
export const update = createAsyncThunk('/user/update', async (data, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    return await authService.update(token, data);
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// change password user
export const changepassword = createAsyncThunk('/user/changepassword', async (data, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    return await authService.changepassword(token, data);
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
// forgot password user
export const forgotPassword = createAsyncThunk('/user/forgotpassword', async (data, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    return await authService.forgotPassword(token, data);
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
// reset password user
export const resetPassword = createAsyncThunk('/user/resetpassword', async (data, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    return await authService.resetPassword(token, data);
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
// generateKey user
export const generateKey = createAsyncThunk('/user/generateKey', async (data, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    return await authService.generateKey(token, data);
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
// generateToken user
export const generateToken = createAsyncThunk('/user/generateToken', async (data, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    return await authService.generateToken(token, data);
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
// get user access keys
export const getAccessKey = createAsyncThunk('user/accessKey', async (data, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    return await authService.getAccessKeys(token, data)
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})
// get user access keys
export const getCurrentPlan = createAsyncThunk('user/getCurrentPlan', async (data, thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    return await authService.getSubscriptions(token, { id: user?.subscription_id })
  } catch (error) {
    if (error.response.data.errors.length > 0) {
      errorHandler(error.response.data.errors);
    }
    if (error.response.data.error) {
      errorHandler(error.response.data.error, 1);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.status = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.message = action.payload.message
        state.user = action.payload.data.user
        state.status = true
        state.role = state.user.role
      })
      .addCase(login.rejected, (state, action) => {
        state.status = false
        state.message = action.payload.message
        state.user = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.message = action.payload.message
        state.user = action.payload.data
        state.status = action.payload.status
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = false
        state.message = action.payload.message
        state.user = null
      })
      .addCase(signupOTP.fulfilled, (state, action) => {
        state.message = action.payload.message
        state.user = action.payload.data
        state.status = action.payload.status
      })
      .addCase(signupOTP.rejected, (state, action) => {
        state.status = false
        state.message = action.payload.message
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = false
        state.user = null
        state.role = null
      })
      .addCase(me.fulfilled, (state, action) => {
        state.message = action.payload.message
        state.user = action.payload.data
        state.status = action.payload.status
      })
      .addCase(me.rejected, (state, action) => {
        state.status = false
        state.message = action.payload.message
        state.user = null
      })
      .addCase(update.fulfilled, (state, action) => {
        state.message = action.payload.message ? action.payload.message : action.payload.error;
      })
      .addCase(update.rejected, (state, action) => {
        state.message = 'Something went wrong';
      })
      .addCase(changepassword.fulfilled, (state, action) => {
        state.message = action.payload.message ? action.payload.message : action.payload.error;
      })
      .addCase(changepassword.rejected, (state, action) => {
        state.message = 'Something went wrong';
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload.message ? action.payload.message : action.payload.error;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.message = 'Something went wrong';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload.message ? action.payload.message : action.payload.error;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.message = 'Something went wrong';
      })
      .addCase(generateKey.fulfilled, (state, action) => {
        state.message = action.payload.message ? action.payload.message : action.payload.error;
      })
      .addCase(generateKey.rejected, (state, action) => {
        state.message = 'Something went wrong';
      })
      .addCase(generateToken.fulfilled, (state, action) => {
        state.message = action.payload.message ? action.payload.message : action.payload.error;
      })
      .addCase(generateToken.rejected, (state, action) => {
        state.message = 'Something went wrong';
      })
      .addCase(getAccessKey.fulfilled, (state, action) => {
        state.message = action.payload.message
        state.keys = action.payload.data
        state.status = action.payload.status
      })
      .addCase(getAccessKey.rejected, (state, action) => {
        state.status = false
        state.message = action.payload.message
        state.keys = null
      })
      .addCase(getCurrentPlan.fulfilled, (state, action) => {
        state.message = action.payload.message
        state.currentPlan = action.payload
        state.status = action.payload.status
      })
      .addCase(getCurrentPlan.rejected, (state, action) => {
        state.status = false
        state.message = action.payload.message
        state.currentPlan = null
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
