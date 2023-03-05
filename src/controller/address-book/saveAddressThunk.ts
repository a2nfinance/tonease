import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";
import { Address } from "ton-core";

import { AppState } from "../store";
export const saveAddressThunk = createAsyncThunk("addressBook/save-address", async (wallet: any, { getState }) => {

    // @ts-ignore
    let state: AppState = getState();
    try {
        // save DB
        let address = state.addressBook.address;
        fetch(`/api/db/address/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...address, owner: Address.normalize(wallet.account.address) })
        });
        successToastContent(
            `Create new address success`,
            ``,
        )
        return true;
    } catch (e) {
        console.log(e);
        errorToastContent(e);
        return false;
    }
})