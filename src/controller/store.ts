import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import {persistStore } from 'redux-persist';
import networkReducer from "src/controller/network/networkSlice";
import multipleRecurringReducer from "src/controller/batch-recurring/multipleRecurringPaymentSlice"
import paymentListReducer from "src/controller/payment-list/paymentListSlice";
import addressBookReducer from "src/controller/address-book/addressBookSlice";
import processReducer from 'src/controller/process/processSlice';
import batchPaymentReducer from "src/controller/batch-payment/batchPaymentSlice";
import invoiceReducer from './invoice/invoiceSlice';

// const persistConfig = {
//     key: 'network',
//     storage,
// }
// const network = persistReducer(persistConfig, networkReducer)
export function makeStore() {
    return configureStore({
        reducer: {
            network: networkReducer,
            batchRecurring: multipleRecurringReducer,
            paymentList: paymentListReducer,
            addressBook: addressBookReducer,
            process: processReducer,
            batchPayment: batchPaymentReducer,
            invoice: invoiceReducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    })
}

export const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
    >

export const persistor  = persistStore(store)