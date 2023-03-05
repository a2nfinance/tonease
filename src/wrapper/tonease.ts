import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell, Slice, toNano } from "ton-core";

export default class TonEase implements Contract {

    static createForDeploy(
        code: Cell,
        sender: Address,
        recipient: Address,
        payAmount: bigint,
        remainingBalance: bigint,
        unlockAmountPerTime: bigint,
        startTime: number,
        cancelPermission: number,
        transferPermission: number,
        unlockEvery: number,
        numberOfUnlocks: number,
        prepaidPercentage: number,
        status: number,
        requestId: number

    ): TonEase {
        const data = beginCell()
            .storeAddress(sender)
            .storeAddress(recipient)
            .storeCoins(payAmount)
            .storeCoins(remainingBalance)
            .storeCoins(unlockAmountPerTime)
            .storeUint(startTime, 32)
            .storeUint(cancelPermission, 8)
            .storeUint(transferPermission, 8)
            .storeUint(unlockEvery, 32)
            .storeUint(numberOfUnlocks, 32)
            .storeUint(prepaidPercentage, 16)
            .storeUint(status, 8)
            .storeUint(requestId, 32)
            .endCell();
        const workchain = 0;
        const address = contractAddress(workchain, { code, data });
        return new TonEase(address, { code, data });
    }

    constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.0005", // send 0.01 TON to contract for rent
            bounce: false
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, amount: string) {
        const messageBody = beginCell()
            .storeUint(1, 32) // op (op #1 = Withdraw)
            .storeCoins(toNano(amount.toString()))
            .endCell();
        await provider.internal(via, {
            value: "0.007", // send 0.007 TON for gas
            body: messageBody
        });
    }

    async sendTransfer(provider: ContractProvider, via: Sender, newRecipient: Address) {
        const messageBody = beginCell()
            .storeUint(2, 32) // op (op #2 = Transfer)
            .storeAddress(newRecipient)
            .endCell();
        await provider.internal(via, {
            value: "0.008", // send 0.008 TON for gas
            body: messageBody
        });
    }

    async sendCancel(provider: ContractProvider, via: Sender) {
        const messageBody = beginCell()
            .storeUint(3, 32) // op (op #3 = Cancel)
            .endCell();
        await provider.internal(via, {
            value: "0.009", // send 0.009 TON for gas
            body: messageBody
        });
    }

    async getPaymentData(provider: ContractProvider): Promise<any[]> {
        const { stack } = await provider.get("get_payment_data", []);
        return [
            stack.readAddress(),
            stack.readAddress(),
            stack.readBigNumber(),
            stack.readBigNumber(),
            stack.readBigNumber(),
            stack.readNumber(),
            stack.readNumber(),
            stack.readNumber(),
            stack.readNumber(),
            stack.readNumber(),
            stack.readNumber(),
            stack.readNumber(),
            stack.readNumber(),
        ];
    }
}