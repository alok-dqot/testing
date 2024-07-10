import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import errorHandler from '../../helpers/errorHandler';
import faqsService from './faqsService'

const initialState = {
    data: [],
    meta: {
        total: 0,
        per_page: 5,
        current_page: 1,
        last_page: 1,
        first_page: 1,
        first_page_url: "/?page=1",
        last_page_url: "/?page=1",
        next_page_url: null,
        previous_page_url: null
    },
    message: 'Something went wrong'
}

// get list of faqs
export const getAll = createAsyncThunk('/faqs', async (data, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await faqsService.getAll(token, data);
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

// create faqs
export const create = createAsyncThunk('/faqs/create', async (data, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await faqsService.create(token, data);
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

// update faqs
export const update = createAsyncThunk('/faqs/update', async (data, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await faqsService.update(token, data);
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

// delete faqs
export const deleteRow = createAsyncThunk('/faqs/delete', async (id, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await faqsService.deleteRow(token, id)
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

export const faqsSlice = createSlice({
    name: 'faqs',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.pending, (state) => {
                state.data = []
                state.meta = {
                    total: 0,
                    per_page: 5,
                    current_page: 1,
                    last_page: 1,
                    first_page: 1,
                    first_page_url: "/?page=1",
                    last_page_url: "/?page=1",
                    next_page_url: null,
                    previous_page_url: null
                }
            })
            .addCase(getAll.fulfilled, (state, action) => {
                if (action && action.meta && action.meta.arg && action.meta.arg.hasOwnProperty('paginate') && action.meta.arg.paginate == 'no') {
                    state.meta = [];
                    state.data = action.payload
                } else {
                    state.meta = action.payload.meta
                    state.data = action.payload.data
                }
            })
            .addCase(getAll.rejected, (state, action) => {
                state.data = []
                state.meta = {
                    total: 0,
                    per_page: 5,
                    current_page: 1,
                    last_page: 1,
                    first_page: 1,
                    first_page_url: "/?page=1",
                    last_page_url: "/?page=1",
                    next_page_url: null,
                    previous_page_url: null
                }
            })
            .addCase(create.pending, (state) => {
                state.message = 'Something went wrong';
            })
            .addCase(create.fulfilled, (state, action) => {
                state.message = action.payload.message ? action.payload.message : action.payload.error;
            })
            .addCase(create.rejected, (state, action) => {
                state.message = 'Something went wrong';
            })
            .addCase(update.fulfilled, (state, action) => {
                state.message = action.payload.message ? action.payload.message : action.payload.error;
            })
            .addCase(update.rejected, (state, action) => {
                state.message = 'Something went wrong';
            })
            .addCase(deleteRow.pending, (state) => {
                state.message = 'Something went wrong';
            })
            .addCase(deleteRow.fulfilled, (state, action) => {
                state.message = action.payload.message ? action.payload.message : action.payload.error;
                if (action.payload.message) {
                    state.data = state.data.filter(
                        (row) => row.id !== action.meta.arg
                    )
                }
            })
            .addCase(deleteRow.rejected, (state, action) => {
                state.message = 'Something went wrong';
            })

    },
})

export const { reset } = faqsSlice.actions
export default faqsSlice.reducer
