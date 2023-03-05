import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";
import { Address } from "ton-core";

import { AppState } from "../store";
export const createInvoiceThunk = createAsyncThunk("invoice/save", async (wallet: any, { getState }) => {

    // @ts-ignore
    let state: AppState = getState();

    let account = Address.normalize(wallet.account.address);

    try {
        let invoiceData = {
            ...state.invoice.generalSetting,
            owner: account,
            items: state.invoice.items,
            recipient: Address.normalize(state.invoice.generalSetting.recipient)
        }

        fetch(`/api/db/invoice/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });
        successToastContent(
            `Create new invoice success`,
            ``,
        )
        return true;
    } catch (e) {
        errorToastContent(e);
        return false;
    }
})