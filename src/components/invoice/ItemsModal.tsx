import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Td,
    Tfoot,
} from '@chakra-ui/react'
import { MdClear } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks'
import { setIsShowItems } from 'src/controller/invoice/invoiceSlice';
import { useInvoice } from 'src/hooks/useInvoice';

export default function ItemsModal() {
    const dispatch = useAppDispatch();
    const { getLineItemAmount, getInvoiceAmount } = useInvoice()
    const { isShowItems, currentItems } = useAppSelector(state => state.invoice)

    return (

        <Modal isOpen={isShowItems} size="full" onClose={() => dispatch(setIsShowItems(false))}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>INVOICE ITEMS</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Description</Th>
                                    <Th isNumeric>QTY</Th>
                                    <Th isNumeric>Unit Price</Th>
                                    <Th isNumeric>Discount (%)</Th>
                                    <Th isNumeric>Tax (%)</Th>
                                    <Th isNumeric>Amount</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    currentItems.map(item => {
                                        let lineItemAmount = getLineItemAmount(item);
                                        return (
                                            <Tr>
                                                <Td>{item.description}</Td>
                                                <Td isNumeric>{item.qty}</Td>
                                                <Td isNumeric>{item.unitPrice}</Td>
                                                <Td isNumeric>{item.discount}</Td>
                                                <Td isNumeric>{item.tax}</Td>
                                                <Td isNumeric>{lineItemAmount} TON(s)</Td>
                                            </Tr>
                                        )
                                    })
                                }

                            </Tbody>
                            {
                                [1].map(() => {
                                    const { amountWithoutTax, totalTaxAmount, totalAmount, due } = getInvoiceAmount(currentItems);
                                    return (
                                        <Tfoot>
                                            <Tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td>Amount Without Tax</Td>
                                                <Td isNumeric>{amountWithoutTax} TON(s)</Td>
                                            </Tr>
                                            <Tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td>Total Tax Amount</Td>
                                                <Td isNumeric>{totalTaxAmount} TON(s)</Td>
                                            </Tr>
                                            <Tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td>Total Amount</Td>
                                                <Td isNumeric>{totalAmount} TON(s)</Td>
                                            </Tr>
                                            <Tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td>Due</Td>
                                                <Td isNumeric>{due} TON(s)</Td>
                                            </Tr>
                                        </Tfoot>
                                    )
                                })

                            }
                        </Table>
                    </TableContainer>
                </ModalBody>
            </ModalContent>
        </Modal>

    )
}