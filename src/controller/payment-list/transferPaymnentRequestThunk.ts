import {createAsyncThunk} from "@reduxjs/toolkit";
import { transferPaymentRequest } from "src/core";
import { tonTransferPaymentRequest } from "src/core/ton";

import { AppState } from "../store";

export const transferPaymentRequestThunk = createAsyncThunk("paymentRequest/transfer", async ({to, tonConnectUi}: any, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   await tonTransferPaymentRequest(state.paymentList.selectedPaymentRequest.contractAddress, to, tonConnectUi);
})