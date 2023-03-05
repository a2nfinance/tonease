import { Box, Button, ButtonGroup, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useCallback, useEffect } from "react";
import { ErrorMessage } from "src/components/invoice/ErrorMessage";
import InvoiceItems from "src/components/invoice/InvoiceItems";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { createInvoiceThunk } from "src/controller/invoice/createInvoiceThunk";
import { setErrorMessages } from "src/controller/invoice/invoiceSlice";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { useInvoice } from "src/hooks/useInvoice";
import InvoiceForm from "../../components/invoice/InvoiceForm";

export default function NewInvoice() {
    const wallet = useTonWallet();
    const dispatch = useAppDispatch();
    const { createInvoice } = useAppSelector(state => state.process);
    const {generalSetting, items} = useAppSelector(state => state.invoice);

    const {validate} = useInvoice();
    useEffect(() => {
        if (wallet) {
            dispatch(getAddressThunk(wallet.account.address));
        }
    }, [wallet])

    const handleSave = useCallback(() => {
        let errorMessages = validate(generalSetting, items);
        if (errorMessages.length) {
            dispatch(setErrorMessages(errorMessages));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        } else {
            dispatch(setErrorMessages([]));
        }
        dispatch(updateProcessStatus({
            actionName: actionNames.createInvoice,
            att: processKeys.processing,
            value: true
        }))
        dispatch(createInvoiceThunk(wallet));
    }, [generalSetting, items])

    return (
        <Box>
            <ErrorMessage />
            <Stack mb={2}>
                <Heading fontSize={"lg"}>Invoice Setting</Heading>
                <Text fontSize={"sm"} color="gray.500">Streamline your payments with TON - the token that simplifies invoicing.</Text>
            </Stack>
            <InvoiceForm />
            <Stack mb={2}>
                <Heading fontSize={"lg"}>Invoice Items</Heading>
                <Text fontSize={"sm"} color="gray.500">You can add an unlimited number of items.</Text>
            </Stack>
            <InvoiceItems />
            <Flex justifyContent={"center"} mt="5">
                {
                wallet ? (<ButtonGroup w={"full"}>
                    <Button w={"50%"} variant={"outline"} colorScheme={"blue"}>Reset</Button>
                    <Button w={"50%"} onClick={() => handleSave()} isLoading={createInvoice.processing} colorScheme={"blue"}>Send</Button>
                    </ButtonGroup>) :
                    (<Button colorScheme="blue">Please connect wallet</Button>)
                }
                
            </Flex>

        </Box>
    )
}