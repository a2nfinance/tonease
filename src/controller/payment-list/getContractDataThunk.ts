import { createAsyncThunk } from "@reduxjs/toolkit";
import { tonGetContractData } from "src/core/ton";

import { AppState } from "../store";
export const getContractDataThunk = createAsyncThunk("paymentRequest/get-detail", async (_, { getState }) => {

   // @ts-ignore
   let state: AppState = getState();
   let contractData = await tonGetContractData(state.paymentList.selectedPaymentRequest.contractAddress);

   return contractData;
})