import {createSlice} from '@reduxjs/toolkit';
export const networkSlice = createSlice({
    name: 'network',
    initialState: {
        chain: process.env.NEXT_PUBLIC_DEFAULT_CHAIN,
    },
    reducers: {
        setChain: (state) => {

        }
    }
})

export default networkSlice.reducer;