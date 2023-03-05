import { createAsyncThunk } from "@reduxjs/toolkit";
import { title } from "process";
import { errorToastContent, successToastContent } from "src/config/toastContent";
import { cancelPaymentRequest } from "src/core";
import { tonCancelPaymentRequest } from "src/core/ton";

import { AppState } from "../store";
export const cancelPaymentRequestThunk = createAsyncThunk("paymentRequest/cancel", async ({ tonConnectUi }: any, { getState }) => {
   try {
      // @ts-ignore
      let state: AppState = getState();
      //return list;
      await tonCancelPaymentRequest(state.paymentList.selectedPaymentRequest.contractAddress, tonConnectUi);
      //successToastContent("Cancel the payment success", "");
   } catch(e) {
      errorToastContent(e);
      console.log(e);
   }
  
})