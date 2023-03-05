import {createAsyncThunk} from "@reduxjs/toolkit";
import { tonGetReceivedPaymentRequests } from "src/core/ton";

import { AppState } from "../store";
export const getReceivedPaymentRequestsThunk = createAsyncThunk("recipient/get-payment-requests", async ({wallet}: any, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   let list = await tonGetReceivedPaymentRequests(wallet);

   return list;
})