import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";
import { tonCreateOneTimePayments } from "src/core/ton";
import { useInvoice } from "src/hooks/useInvoice";
import { Address } from "ton-core";
import { BatchPaymentState } from "../batch-payment/batchPaymentSlice";

import { AppState } from "../store";
export const payInvoiceThunk = createAsyncThunk("invoice/pay-now", async ({wallet, tonConnectUi}: any, { getState }) => {
    const {getInvoiceAmount} = useInvoice();
    // @ts-ignore
    let state: AppState = getState();
    try {
        let selectedInvoice = state.invoice.selectedInvoice;
        let oneTimePaymentData: BatchPaymentState = {
            generalSetting: {
                tokenAddress: "", //selectedInvoice.tokenAddress,
                isPayNow: true,
                startDate: new Date().getTime(),
                isNativeToken: true //tokenAddressInfo[chain][selectedInvoice.tokenAddress].isNative
            },
            recipients: [
                {
                    recipient: selectedInvoice.owner,
                    amount: getInvoiceAmount(selectedInvoice.items).due
                }
            ]
        }
        await tonCreateOneTimePayments(oneTimePaymentData, wallet, tonConnectUi, true);

        await fetch(`/api/db/invoice/updateStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: state.invoice.selectedInvoice._id,
                status: state.invoice.changeStatusTo
            })
        });
        successToastContent(
            `Pay the invoice success`,
            ``,
        )
        return true;
    } catch (e) {
        errorToastContent(e);
        return false;
    }
})