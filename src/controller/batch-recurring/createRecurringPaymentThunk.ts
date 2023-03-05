import {createAsyncThunk} from "@reduxjs/toolkit";
import { createdBatchRecurringPayments, getSenderPaymentRequests } from "src/core";
import { tonCreateBatchRecurringPaments } from "src/core/ton";

import { AppState } from "../store";
export const createRecurringPaymentThunk = createAsyncThunk("recurring/create-payments", async ({wallet, tonConnectUi}: any, {getState}) => {
   // @ts-ignore
   let state: AppState = getState();
   tonCreateBatchRecurringPaments(wallet, tonConnectUi, state.batchRecurring);
})