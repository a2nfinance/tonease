import {createAsyncThunk} from "@reduxjs/toolkit";
import { Address } from "ton-core";

import { AppState } from "../store";
export const getGroupsThunk = createAsyncThunk("addressBook/get-groups", async (wallet: any, {getState}) => {

   // @ts-ignore
    let state: AppState = getState();
    let request = await fetch(`/api/db/address-group/getList`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            owner: Address.normalize(wallet.account.address)
        })
    });
    let groupList = await request.json();
    return groupList;
})