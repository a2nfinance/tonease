import { getHttpEndpoint, Network } from "@orbs-network/ton-access";
import { BatchPaymentState } from "src/controller/batch-payment/batchPaymentSlice";
import { MultipleRecurringPaymentState, Recipient } from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import { setEndProcess } from "src/controller/payment-list/paymentListSlice";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { store } from "src/controller/store";
import TonEase from "src/wrapper/tonease";
import { Address, beginCell, Cell, fromNano, OpenedContract, SenderArguments, storeStateInit, toNano, TonClient } from "ton";

const netENV: Network = process.env.NEXT_PUBLIC_NET_ENV === "testnet" ? "testnet" : "mainnet";

const getTonClient = async () => {
    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: netENV });
    const client = new TonClient({ endpoint });
    return client;
}

const storageFeeCalculator = (recipient: Recipient) => {
  
    const size = 630 * 8;       
    const duration = recipient.numberOfUnlocks * recipient.unlockEvery * recipient.unlockEveryType;  
  
    const bit_price_ps = 1
    const cell_price_ps = 500
  
    const pricePerSec = size * bit_price_ps +
    + Math.round(bit_price_ps / 1023) * cell_price_ps
  
    let fee = (pricePerSec * duration / 2**16 * 10**-9)
    // Add 1 month storage fee
    fee += 0.0005;
    return fee;
  }
  

const loadSmartContract = async (address: string) => {
    let client = await getTonClient();
    const contract = new TonEase(
        Address.parse(address) // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<TonEase>;
}

const getSender = async (tonConnectUi) => {

    return {
        send: async (args: SenderArguments) => {
            await tonConnectUi.sendTransaction({
                messages: [
                    {
                        address: args.to.toString(),
                        amount: args.value.toString(),
                        payload: args.body?.toBoc().toString('base64'),
                    },
                ],
                validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
            });
        },
    };
}


const tonCreateBatchRecurringPaments = async (wallet, tonConnectUi, recurringPaymentsData: MultipleRecurringPaymentState) => {
    try {
        let senderAddress = Address.normalize(wallet.account.address);
        let request = await fetch(`/api/contract/getCellFile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

            })
        });
        let content = await request.arrayBuffer();

        const contractCode = Cell.fromBoc(Buffer.from(content))[0]; // compilation output from step 6
        let generalSetting = recurringPaymentsData.generalSetting;
        let recipients = recurringPaymentsData.recipients;
        let deployedContracts = [];

        let payAmounts = [];
        let storageFees = [];

        let countRq = await fetch(`/api/db/payment-request/getCountPaymentRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                senderAddress: senderAddress
            })
        });

        let count = await countRq.json();

        let correctRecipients = [];

        for (let i = 0; i < recipients.length; i++) {
            let recipient = recipients[i];
            let payAmount = recipient.numberOfUnlocks * recipient.unlockAmountPerTime;
            if (recipient.prepaidPercentage) {
                payAmount += (recipient.prepaidPercentage / 100) * payAmount;
            }

            const tonease = TonEase.createForDeploy(
                contractCode,
                Address.parse(senderAddress),
                Address.parse(recipient.recipient),
                toNano(payAmount.toFixed(9)),
                toNano(payAmount.toFixed(9)),
                toNano(recipient.unlockAmountPerTime),
                Math.floor(generalSetting.startDate / 1000),
                generalSetting.whoCanCancel,
                generalSetting.whoCanTransfer,
                recipient.unlockEvery * recipient.unlockEveryType,
                parseInt(recipient.numberOfUnlocks.toString()),
                recipient.prepaidPercentage * 100,
                1,
                count + i
            );

            deployedContracts.push(tonease);
            payAmounts.push(payAmount);
            storageFees.push(storageFeeCalculator(recipient));
            correctRecipients.push({
                ...recipient,
                contractAddress: tonease
                .address.toString(),
                recipient: Address.normalize(recipient.recipient)
            });
        }

        let messages: { address: string, amount: string, stateInit?: any }[] = [];

        for (let i = 0; i < deployedContracts.length; i++) {
            let deployedContract = deployedContracts[i];

            // Send amount to pay fee and fund the contract;

            messages.push({
                address: deployedContract.address.toString(),
                amount: toNano((storageFees[i] + parseFloat(payAmounts[i])).toFixed(9)).toString(),
                stateInit: beginCell().storeWritable(storeStateInit(deployedContract.init)).endCell().toBoc().toString('base64'),
            })
        }
        if (messages.length) {
            const defaultTx = {
                validUntil: Date.now() + 60000,
                messages: messages
            };
            let result = await tonConnectUi.sendTransaction(defaultTx);
            if (result) {

                // save database here
                let savePaymmentRequests = await fetch(`/api/db/payment-request/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        generalSetting,
                        recipients: correctRecipients,
                        senderAddress
                    })
                });

                let savedPaymentRequestsResponse = await savePaymmentRequests.json();
                if (savedPaymentRequestsResponse.length) {
                    console.log("Save success");
                }

            }
        }

    } catch (e) {
        console.log(e);
    }

}

const tonCreateOneTimePayments = async (oneTimePaymentsData: BatchPaymentState, wallet, tonConnectUi, isPayInvoice?: boolean) => {
    try {
        let isPayNow = oneTimePaymentsData.generalSetting.isPayNow;

        if (isPayNow || isPayInvoice) {
            let messages: { address: string, amount: string, stateInit?: any }[] = [];

            for (let i = 0; i < oneTimePaymentsData.recipients.length; i++) {
                let recipient = oneTimePaymentsData.recipients[i];

                // Send amount to pay fee and fund the contract;

                messages.push({
                    address: recipient.recipient.toString(),
                    amount: toNano(recipient.amount.toString()).toString(),
                })
            }
            if (messages.length) {
                const defaultTx = {
                    validUntil: Date.now() + 60000,
                    messages: messages
                };

                await tonConnectUi.sendTransaction(defaultTx);
            }
        } else {
            let generalSetting = oneTimePaymentsData.generalSetting;
            let recipients = oneTimePaymentsData.recipients;

            let recurringPaymentsData: MultipleRecurringPaymentState = {
                generalSetting: {
                    isNativeToken: true,
                    startDate: generalSetting.startDate,
                    whoCanCancel: 3,
                    whoCanTransfer: 3,
                    tokenAddress: ""
                },
                recipients: recipients.map(r => {
                    return {
                        numberOfUnlocks: 1,
                        unlockAmountPerTime: r.amount,
                        unlockEvery: 1,
                        unlockEveryType: 1,
                        prepaidPercentage: 0,
                        recipient: r.recipient
                    }
                }),
            }

            await tonCreateBatchRecurringPaments(wallet, tonConnectUi, recurringPaymentsData);
        }
    } catch (e) {
        console.log(e);
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.createOneTimePayments,
        att: processKeys.processing,
        value: false
    }))
}

const tonWithdrawFromPaymentRequest = async (contractAddress: string, amount: string, tonConnectUi) => {
    try {
        let sender = await getSender(tonConnectUi);

        let contract = await loadSmartContract(contractAddress);

        await contract.sendWithdraw(sender, amount);

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let contractData = await contract.getPaymentData();
        let oldBalance = contractData[3];

        let maxPollNumber = 30;
        let pollNumber = 0;
        while(contractData[3] === oldBalance && pollNumber < maxPollNumber) {
            pollNumber++;
            contractData = await contract.getPaymentData();
            console.log("Polling Withdraw Data:", contractData[3], "Result:", contractData[3] !== oldBalance)
        }
        if (contractData[3] !== oldBalance) {
            await fetch(`/api/db/payment-request/updateStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contractAddress,
                    status: contractData[11],
                    recipient: Address.normalize(contractData[1])
                })
            });
    
            store.dispatch(updateProcessStatus({
                actionName: actionNames.withdrawPayment,
                att: processKeys.processing,
                value: false
            }))
    
            store.dispatch(setEndProcess(actionNames.withdrawPayment));
        }
        
    } catch (error) {
        store.dispatch(updateProcessStatus({
            actionName: actionNames.withdrawPayment,
            att: processKeys.processing,
            value: false
        }))

        store.dispatch(setEndProcess(actionNames.withdrawPayment));
        console.log(error);
    }



}

const tonCancelPaymentRequest = async (contractAddress: string, tonConnectUi) => {
    try {
        let sender = await getSender(tonConnectUi);

        let contract = await loadSmartContract(contractAddress);

        await contract.sendCancel(sender);
        let contractData = await contract.getPaymentData();

        let maxPollNumber = 30;
        let pollNumber = 0;
        while(contractData[11] !== 2 && pollNumber < maxPollNumber) {
            pollNumber++;
            contractData = await contract.getPaymentData();
            console.log("Polling Cancel Data:", contractData[11], "Result:", contractData[11] === 2)
        }

        if (contractData[11] === 2) {
            await fetch(`/api/db/payment-request/updateStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contractAddress,
                    status: 2,
                    recipient: Address.normalize(contractData[1])
                })
            });

            store.dispatch(updateProcessStatus({
                actionName: actionNames.cancel,
                att: processKeys.processing,
                value: false
            }))
    
            store.dispatch(setEndProcess(actionNames.cancel));
    
        }
       

    } catch (e) {
        store.dispatch(updateProcessStatus({
            actionName: actionNames.cancel,
            att: processKeys.processing,
            value: false
        }))
        store.dispatch(setEndProcess(actionNames.cancel));
        console.log(e);
    }


}

const tonTransferPaymentRequest = async (contractAddress: string, to: string, tonConnectUi) => {
    try {
        let sender = await getSender(tonConnectUi);

        let contract = await loadSmartContract(contractAddress);

        await contract.sendTransfer(sender, Address.parse(to));
        
        let contractData = await contract.getPaymentData();

        let maxPollNumber = 30;
        let pollNumber = 0;
        while(Address.normalize(contractData[1]) !== to && pollNumber < maxPollNumber) {
            pollNumber++;
            contractData = await contract.getPaymentData();
            console.log("Polling Transfer Data:", Address.normalize(contractData[1]), " TO:", to, "Result:", Address.normalize(contractData[1]) === to)
        }

        if (Address.normalize(contractData[1]) === to) {
            await fetch(`/api/db/payment-request/updateStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contractAddress,
                    status: contractData[11],
                    recipient: Address.normalize(contractData[1])
                })
            });

            store.dispatch(updateProcessStatus({
                actionName: actionNames.transfer,
                att: processKeys.processing,
                value: false
            }))
    
            store.dispatch(setEndProcess(actionNames.transfer));
        }
        
        

        
    } catch (error) {

        store.dispatch(updateProcessStatus({
            actionName: actionNames.transfer,
            att: processKeys.processing,
            value: false
        }))

        store.dispatch(setEndProcess(actionNames.transfer));
        console.log(error);
    }


}

const tonGetSentPaymentRequests = async (wallet: any) => {
    const senderAddress = Address.normalize(wallet.account.address);
    let paymentRequestsReq = await fetch(`/api/db/payment-request/getSentRequests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            senderAddress
        })
    });

    let paymentRequests = await paymentRequestsReq.json();
    return paymentRequests;
}

const tonGetReceivedPaymentRequests = async (wallet: any) => {
    const recipientAddress = Address.normalize(wallet.account.address);
    let paymentRequestsReq = await fetch(`/api/db/payment-request/getReceivedRequests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipientAddress
        })
    });
    let paymentRequests = await paymentRequestsReq.json();
    return paymentRequests;
}


const tonGetContractData = async (contractAddress: string) => {
    try {
        let contract = await loadSmartContract(contractAddress);

        let contractData = await contract.getPaymentData();

        return {
            sender: Address.normalize(contractData[0]),
            recipient: Address.normalize(contractData[1]),
            payAmount: fromNano(contractData[2]),
            remainingBalance: fromNano(contractData[3]),
            unlockAmountPerTime: fromNano(contractData[4]),
            startTime: contractData[5],
            cancelPermission: contractData[6],
            transferPermission: contractData[7],
            unlockEvery: contractData[8],
            numberOfUnlock: contractData[9],
            prepaidPercentage: contractData[10],
            status: contractData[11],
            requestId: contractData[12]
        }
    } catch (error) {
        console.log(error);
    }

}


export {
    getTonClient,
    tonCreateBatchRecurringPaments,
    tonCreateOneTimePayments,
    tonWithdrawFromPaymentRequest,
    tonTransferPaymentRequest,
    tonCancelPaymentRequest,
    tonGetSentPaymentRequests,
    tonGetReceivedPaymentRequests,
    tonGetContractData
};
