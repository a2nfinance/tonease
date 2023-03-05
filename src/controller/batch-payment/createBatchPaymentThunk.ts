import {createAsyncThunk} from "@reduxjs/toolkit";
import { TonConnectUI } from "@tonconnect/ui-react";
import { createdBatchRecurringPayments, createOneTimePayments, getSenderPaymentRequests } from "src/core";
import { tonCreateOneTimePayments } from "src/core/ton";

import { AppState } from "../store";
export const createBatchPaymentThunk = createAsyncThunk("batchpay/create-payments", async ({wallet, tonConnectUi}: any, {getState}) => {
   // @ts-ignore
   let state: AppState = getState();
   await tonCreateOneTimePayments(state.batchPayment, wallet, tonConnectUi);
})