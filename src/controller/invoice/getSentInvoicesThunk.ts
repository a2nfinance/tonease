import {createAsyncThunk} from "@reduxjs/toolkit";
import { Address } from "ton-core";

import { AppState } from "../store";
export const getSentInvoicesThunk = createAsyncThunk("invoice/get-sent-invoices", async (wallet: any, {getState}) => {

   // @ts-ignore
    let state: AppState = getState();
    let request = await fetch(`/api/db/invoice/getSentInvoices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            owner: Address.normalize(wallet.account.address)
        })
    });
    let invoices = await request.json();
    return invoices;
})