import * as fs from "fs";
import { Address, Cell, toNano } from "ton-core";
import { Blockchain, OpenedContract, TreasuryContract } from "@ton-community/sandbox";
import TonEase from "../../wrapper/tonease"; // this is the interface class from tutorial 2
import "@ton-community/test-utils"; // register matchers
import moment from "moment";

describe("Counter tests", () => {
    let blockchain: Blockchain;
    let wallet1: OpenedContract<TreasuryContract>;
    let wallet2: OpenedContract<TreasuryContract>;
    let wallet3: OpenedContract<TreasuryContract>;
    let toneaseContract: OpenedContract<TonEase>;

    beforeEach(async () => {
        // initialize the blockchain sandbox
        blockchain = await Blockchain.create();
        blockchain.verbosity = "vm_logs";
        wallet1 = await blockchain.treasury("user1");
        wallet2 = await blockchain.treasury("user2");
        wallet3 = await blockchain.treasury("user3");
        // prepare Counter's initial code and data cells for deployment
        const toneaseCode = Cell.fromBoc(fs.readFileSync("contracts/tonease/cell/tonease.cell"))[0];
        // version with ~dump instruction
        const tonease = TonEase.createForDeploy(
            toneaseCode,
            wallet1.address,
            wallet2.address,
            toNano("0.02"),
            toNano("0.02"),
            toNano("0.01"),
            moment().subtract(20, "second").unix(),
            0,
            0,
            1,
            2,
            0,
            1,
            1
        );

        console.log("wallet 2 address:", wallet2.address);
        // deploy tonease
        toneaseContract = blockchain.openContract(tonease);
        await toneaseContract.sendDeploy(wallet1.getSender());
    }),

    it("should send ton coin to the contract", async () => {
        console.log("sending 0.02 TON");
        await wallet1.send({
            to: toneaseContract.address,
            value: toNano("0.02")
        });
        let data = await toneaseContract.getPaymentData();
        let recipient = Address.normalize(data[1]);
        expect(recipient).toEqual(wallet2.address.toString());
    });    

    it("should withdraw 0.01, remaining balance is 0.01", async () => {
        await wallet1.send({
            to: toneaseContract.address,
            value: toNano("0.02")
        });
        await toneaseContract.sendWithdraw(wallet2.getSender(), "0.01");
        let amount = await toneaseContract.getPaymentData();
        expect(amount[3]).toEqual(toNano("0.01"));

    })

    it("should withdraw fail, not recipient send request", async () => {
        await wallet1.send({
            to: toneaseContract.address,
            value: toNano("0.02")
        });
        await toneaseContract.sendWithdraw(wallet3.getSender(), "0.01");
        let amount = await toneaseContract.getPaymentData();
        expect(amount[3]).toEqual(toNano("0.02"));

    })

    it("should transfer success, transfer when status is 1", async () => {
        await wallet1.send({
            to: toneaseContract.address,
            value: toNano("0.02")
        });
        await toneaseContract.sendTransfer(wallet1.getSender(), wallet3.address);
        let data = await toneaseContract.getPaymentData();
        expect(Address.normalize(data[1])).toEqual(wallet3.address.toString());

    })

    it("should transfer payment success, transfer when status is 1", async () => {
        await wallet1.send({
            to: toneaseContract.address,
            value: toNano("0.02")
        });
        await toneaseContract.sendTransfer(wallet1.getSender(), wallet3.address);
        let data = await toneaseContract.getPaymentData();
        expect(Address.normalize(data[1])).toEqual(wallet3.address.toString());

    })

    it ("should cancel payment success, cancel when status is 1", async() => {
        await wallet1.send({
            to: toneaseContract.address,
            value: toNano("0.02")
        });
        await toneaseContract.sendCancel(wallet1.getSender());
        let data = await toneaseContract.getPaymentData();
        expect(data[3]).toEqual(toNano("0"));
    });

});