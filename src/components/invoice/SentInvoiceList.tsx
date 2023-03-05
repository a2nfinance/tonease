import { SettingsIcon } from '@chakra-ui/icons';
import { Box, Divider, HStack, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react';
import { useTonWallet } from '@tonconnect/ui-react';
import { useCallback, useEffect } from 'react';
import { chains } from 'src/config/chainSettings';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { getSentInvoicesThunk } from 'src/controller/invoice/getSentInvoicesThunk';
import { InvoiceItem, setCurrentItems, setIsShowItems, setSelectedInvoice, setShowStatusModal, setStatusTo } from 'src/controller/invoice/invoiceSlice';
import { useAddress } from 'src/hooks/useAddress';
import { useInvoice } from 'src/hooks/useInvoice';
import { useStatus } from 'src/hooks/useStatus';
export default function SentInvoiceList() {
    const wallet = useTonWallet();
    const dispatch = useAppDispatch();
    const { getShortAddress } = useAddress();
    const { getInvoiceAmount, checkInvoiceActionable } = useInvoice();
    const { getInvoiceStatus } = useStatus();
    const { sentInvoices } = useAppSelector(state => state.invoice);
    const { chain } = useAppSelector(state => state.network);
    const process = useAppSelector(state => state.process);
    const handleShowCurrentItems = useCallback((items: InvoiceItem[]) => {
        dispatch(setIsShowItems(true));
        dispatch(setCurrentItems(items));
    }, [])

    useEffect(() => {
        if (wallet) {
            dispatch(getSentInvoicesThunk(wallet))
        }

    }, [wallet, process.updateInvoiceStatus.processing])

    const handleUpdateInvoiceStatus = useCallback((selectedInvoice, status: number) => {
        dispatch(setShowStatusModal(true)),
            dispatch(setSelectedInvoice(selectedInvoice));
        dispatch(setStatusTo(status));
    }, [])

    return (
        <Stack mt="2" gap={1}>

            {
                sentInvoices.map((invoice, index) => {
                    let shortAddress = <a href={chains[chain].explorer.concat("address/").concat(invoice.recipient)} target="_blank">
                        {getShortAddress(invoice.recipient)}
                    </a>
                    let { due, totalTaxAmount } = getInvoiceAmount(invoice.items);
                    let status = getInvoiceStatus(invoice.status);
                    const { allowPause, allowCancel, allowActive } = checkInvoiceActionable(invoice, true);
                    return (
                        <HStack key={`invoice-${index}`} justifyContent={"space-between"} w={"full"}>
                            <Box gap={1}>
                                <Text fontSize={"sm"}>To {shortAddress}</Text>
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
                                        <MenuItem isDisabled={!allowCancel} onClick={() => handleUpdateInvoiceStatus(invoice, 2)}>Cancel</MenuItem>
                                        <MenuItem isDisabled={!allowPause} onClick={() => handleUpdateInvoiceStatus(invoice, 3)}>Pause</MenuItem>
                                        <MenuItem isDisabled={!allowActive} onClick={() => handleUpdateInvoiceStatus(invoice, 1)}>Active</MenuItem>
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