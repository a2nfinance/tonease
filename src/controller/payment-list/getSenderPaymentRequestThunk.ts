import {createAsyncThunk} from "@reduxjs/toolkit";
import { tonGetSentPaymentRequests } from "src/core/ton";

import { AppState } from "../store";
export const getSenderPaymentRequestsThunk = createAsyncThunk("sender/get-payment-requests", async ({wallet}: any, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();

   console.log("Wallet", wallet);
    
   let list = await tonGetSentPaymentRequests(wallet);

   return list;
})