import { Heading, Stack, Text } from "@chakra-ui/react";
import ChangeStatusModal from "src/components/invoice/ChangeStatusModal";
import ItemsModal from "src/components/invoice/ItemsModal";
import SentInvoiceList from "src/components/invoice/SentInvoiceList";

export default function SentInvoice() {
    return (
        <>
            <Stack mb="2">
                <Heading fontSize={"lg"}>Sent Invoices</Heading>
                <Text fontSize={"sm"} color="gray.500">A list of your sent invoices. Click on each item to view its details.</Text>
            </Stack>
            <SentInvoiceList />
            <ItemsModal />
            <ChangeStatusModal />
        </>


    )
}