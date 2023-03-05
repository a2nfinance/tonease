import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";
import { Address } from "ton-core";

import { AppState } from "../store";
export const updateInvoiceStatusThunk = createAsyncThunk("invoice/update-status", async (wallet: any, { getState }) => {

    // @ts-ignore
    let state: AppState = getState();

    let account = Address.normalize(wallet.account.address);
    try {
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
            `Update the invoice status success`,
            ``,
        )
        return true;
    } catch (e) {
        errorToastContent(e);
        return false;
    }
})