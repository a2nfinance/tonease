import {ActionReducerMapBuilder, createSlice, PayloadAction} from '@reduxjs/toolkit';

export type Recipient = {
    recipient: string,
    unlockEvery: number,
    unlockEveryType: number,
    unlockAmountPerTime: number,
    numberOfUnlocks: number,
    prepaidPercentage: number,
    contractAddress?: string
}
export type MultipleRecurringPaymentState = {
    generalSetting: {
        tokenAddress: string,
        isNativeToken: boolean,
        startDate: number,
        whoCanCancel: number,
        whoCanTransfer: number
    },
    recipients: Recipient[],
    errorMessages?: string[]
}

const initialState: MultipleRecurringPaymentState = {
    generalSetting: {
        tokenAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        isNativeToken: true,
        startDate: new Date().getTime(),
        whoCanCancel: 0,
        whoCanTransfer: 0
    },
    recipients: [
        {
            recipient: "",
            unlockEvery: 1,
            unlockEveryType: 1,
            unlockAmountPerTime: 1,
            numberOfUnlocks: 1,
            prepaidPercentage: 0,
            contractAddress: ""

        }
    ],
    errorMessages: []
}

export const multipleRecurringPaymentSlice = createSlice({
    name: 'multipleRecurringPayment',
    initialState,
    reducers: {
        changeGeneralSetting: (state: MultipleRecurringPaymentState, action: PayloadAction<{att: string, value: any}>) => {
            state.generalSetting[action.payload.att] = action.payload.value;
        },
        addNewRecipient: (state: MultipleRecurringPaymentState) => {
            if (state.recipients.length < 4) {
                state.recipients.push({
                    recipient: "",
                    unlockEvery: 1,
                    unlockEveryType: 1,
                    unlockAmountPerTime: 1,
                    numberOfUnlocks: 1,
                    prepaidPercentage: 0
        
                })
            }
           
        },
        addNewRecipients: (state: MultipleRecurringPaymentState, action: PayloadAction<Recipient[]>) => {
            state.recipients = state.recipients.concat(action.payload);
        },
        removeRecipient: (state: MultipleRecurringPaymentState, action: PayloadAction<{index: number}>) => {
            if (state.recipients.length > 1) {
                state.recipients.splice(action.payload.index, 1);
            }
           
        },
        changeRecipient: (state: MultipleRecurringPaymentState, action: PayloadAction<{index: number, att: string, value: any}>) => {
            let payloadValue = action.payload.value;
            if (action.payload.value !== "") {
                if (["numberOfUnlocks", "unlockEvery", "prepaidPercentage"].indexOf(action.payload.att) !== -1) {
                    payloadValue = parseInt(payloadValue);
                }
            }
            state.recipients[action.payload.index][action.payload.att] = payloadValue;
        },
        setErrorMessages: (state: MultipleRecurringPaymentState, action: PayloadAction<string[]>) => {
            state.errorMessages = action.payload;
        }
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        // builder.addCase(initContractThunk.fulfilled, (state, action) => {
        //     console.log("complete init contract");
        //     state.contract = action.payload;
        // })

    }
})

export const { changeGeneralSetting, changeRecipient, addNewRecipient, removeRecipient, addNewRecipients, setErrorMessages } = multipleRecurringPaymentSlice.actions;

export default multipleRecurringPaymentSlice.reducer;