import {createAsyncThunk} from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";
import { Address } from "ton-core";

import { AppState } from "../store";
export const saveGroupThunk = createAsyncThunk("addressBook/save-group", async (wallet: any, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   try {
    // save DB
    let groupData = state.addressBook.group;
    fetch(`/api/db/address-group/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            owner: Address.normalize(wallet.account.address),
            name: groupData.name,
            description: groupData.description,
            status: groupData.status
        })
    });
    successToastContent(
        `Create new group success`,
        ``,
    )
    return true;
} catch (e) {
    errorToastContent(e);
    return false;
}
})