import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { ErrorMessage } from "src/components/onetime-payment/ErrorMessage";
import OneTimePaymentForm from "src/components/onetime-payment/OneTimePaymentForm";
import Recipients from "src/components/onetime-payment/Recipients";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";

export default function OneTimePayment() {
    const dispatch = useAppDispatch();
    const wallet = useTonWallet();
    useEffect(() => {
        if (wallet) {
            dispatch(getAddressThunk(wallet.account.address));
        }
    }, [wallet])
    return (
        <>
            <ErrorMessage />
            <Stack mb={2}>
                <Heading fontSize={"lg"}>General Setting</Heading>
                <Text fontSize={"sm"} color="gray.500">This setting will be applied to all recipients.</Text>
            </Stack>
            <OneTimePaymentForm />
            <Stack my={2}>
                <Heading fontSize={"lg"}>Recipients</Heading>
                <Text fontSize={"sm"} color="gray.500">The maximum number of recipients is 4.</Text>
            </Stack>
            <Recipients />
        </>
    )
}