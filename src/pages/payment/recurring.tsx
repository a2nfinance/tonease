import { Heading, Stack, Text } from "@chakra-ui/react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { ErrorMessage } from "src/components/recurring-payment/ErrorMessage";
import Recipients from "src/components/recurring-payment/Recipients";
import RecurringPaymentForm from "src/components/recurring-payment/RecurringPaymentForm";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch } from "src/controller/hooks";

export default function RecurringPayment() {
    const dispatch = useAppDispatch();
    const wallet = useTonWallet();
    useEffect(() => {
        if (wallet) {
            dispatch(getAddressThunk(wallet.account.address));
        }
        
    }, [wallet])
    return (
        <Stack w={"100%"}>
            <ErrorMessage />
            <Stack>
                <Heading fontSize={"lg"}>General Setting</Heading>
                <Text fontSize={"sm"} color="gray.500">This setting will be applied to all recipients.</Text>
            </Stack>

            <RecurringPaymentForm />
            <Stack>
                <Heading fontSize={"lg"}>Recipients</Heading>
                <Text fontSize={"sm"} color="gray.500">The maximum number of recipients is 4.</Text>
            </Stack>
            
            <Recipients />
        </Stack>
    )
}