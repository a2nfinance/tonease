import { createAsyncThunk } from "@reduxjs/toolkit";
import { Address } from "ton-core";
export const getReceivedInvoicesThunk = createAsyncThunk("invoice/get-received-invoices", async (wallet: any, { getState }) => {
    try {
        let request = await fetch(`/api/db/invoice/getReceivedInvoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipient: Address.normalize(wallet.account.address)
            })
        });
        let invoices = await request.json();
        return invoices;
    } catch (e) {
        console.log(e);
    }

    return [];
})