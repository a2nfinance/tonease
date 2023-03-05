import { Heading, Stack, Text } from "@chakra-ui/react";
import ChangeStatusModal from "src/components/invoice/ChangeStatusModal";
import ItemsModal from "src/components/invoice/ItemsModal";
import PayModal from "src/components/invoice/PayModal";
import ReceivedInvoiceList from "src/components/invoice/ReceivedInvoiceList";

export default function ReceivedInvoice() {
    return (
        <>
            <Stack mb="2">
                <Heading fontSize={"lg"}>Received Invoices</Heading>
                <Text fontSize={"sm"} color="gray.500">A list of your received invoices. Click on each item to view its details.</Text>
            </Stack>
            <ReceivedInvoiceList />
            <ItemsModal />
            <ChangeStatusModal />
            <PayModal />
        </>


    )
}