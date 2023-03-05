import {createAsyncThunk} from "@reduxjs/toolkit";
import { Address } from "ton-core";
export const getAddressThunk = createAsyncThunk("addressBook/get-addresses", async (address: any, {getState}) => {
    let request = await fetch(`/api/db/address/getList`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            owner: Address.normalize(address)
        })
    });
    let addressList = await request.json();
    return addressList;
    
})