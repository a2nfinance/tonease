import {createAsyncThunk} from "@reduxjs/toolkit";
import { withdrawFromPaymentRequest } from "src/core";
import { tonWithdrawFromPaymentRequest } from "src/core/ton";

import { AppState } from "../store";
export const withdrawPaymentRequestThunk = createAsyncThunk("paymentRequest/withdraw", async ({amount, tonConnectUi}: any, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   //return list;

   await tonWithdrawFromPaymentRequest(state.paymentList.selectedPaymentRequest.contractAddress, amount, tonConnectUi);
})