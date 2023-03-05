import { SettingsIcon } from '@chakra-ui/icons';
import { Box, Divider, HStack, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react';
import { useTonWallet } from '@tonconnect/ui-react';
import { useCallback, useEffect } from 'react';
import { chains } from 'src/config/chainSettings';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { getReceivedInvoicesThunk } from 'src/controller/invoice/getReceivedInvoicesThunk';
import { InvoiceItem, setCurrentItems, setIsShowItems, setSelectedInvoice, setShowPayModal, setShowStatusModal, setStatusTo } from 'src/controller/invoice/invoiceSlice';
import { useAddress } from 'src/hooks/useAddress';
import { useInvoice } from 'src/hooks/useInvoice';
import { useStatus } from 'src/hooks/useStatus';

export default function ReceivedInvoiceList() {
    const wallet = useTonWallet();
    const dispatch = useAppDispatch();
    const { getShortAddress } = useAddress();
    const { getInvoiceAmount, checkInvoiceActionable } = useInvoice();
    const { getInvoiceStatus } = useStatus();
    const { receivedInvoices } = useAppSelector(state => state.invoice);
    const { chain } = useAppSelector(state => state.network);
    const process = useAppSelector(state => state.process);
    const handleShowCurrentItems = useCallback((items: InvoiceItem[]) => {
        dispatch(setIsShowItems(true));
        dispatch(setCurrentItems(items));
    }, [])

    useEffect(() => {
        if (wallet) {
            dispatch(getReceivedInvoicesThunk(wallet))
        }
    }, [wallet, process.updateInvoiceStatus.processing])

    const handleUpdateInvoiceStatus = useCallback((selectedInvoice, status: number) => {
        if (status == 5) {
            dispatch(setShowPayModal(true));
        } else {
            dispatch(setShowStatusModal(true))
        }

        dispatch(setSelectedInvoice(selectedInvoice));
        dispatch(setStatusTo(status));
    }, [])

    return (
        <Stack mt="2" gap={1}>

            {
                receivedInvoices.map((invoice, index) => {
                    let shortAddress = <a href={chains[chain].explorer.concat("address/").concat(invoice.recipient)} target="_blank">
                        {getShortAddress(invoice.owner)}
                    </a>
                    let { due } = getInvoiceAmount(invoice.items);
                    let status = getInvoiceStatus(invoice.status);
                    const { allowPay, allowReject } = checkInvoiceActionable(invoice, false);
                    return (
                        <HStack key={`invoice-${index}`} justifyContent={"space-between"} w={"full"}>
                            <Box gap={1}>
                                <Text fontSize={"sm"}>From {shortAddress}</Text>
                                <Text fontSize={"xs"}>Created at {new Date(invoice.createdAt).toLocaleString()}</Text>
                            </Box>
                            <HStack>
                                <Box gap={1}>
                                    <Text fontWeight={500} fontSize={"sm"}>Due {due} Ton(s)</Text>
                                    <Text fontSize={"sm"}>{status}</Text>
                                </Box>

                                <Menu>
                                    <MenuButton icon={<SettingsIcon />} as={IconButton} />
                                    <MenuList>
                                        <MenuItem isDisabled={!allowPay} onClick={() => handleUpdateInvoiceStatus(invoice, 5)}>Pay</MenuItem>
                                        <MenuItem isDisabled={!allowReject} onClick={() => handleUpdateInvoiceStatus(invoice, 4)}>Reject</MenuItem>
                                        <MenuDivider />
                                        <MenuItem onClick={() => handleShowCurrentItems(invoice.items)}>View Details</MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack>
                    )
                })
            }
            <Divider size={"xs"} />
        </Stack>

    )
}