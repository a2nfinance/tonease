import { DeleteIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button, ButtonGroup, Card, CardBody, CardFooter, Flex, FormControl, FormLabel, IconButton, Input, InputGroup, Stack, StackDivider, WrapItem
} from '@chakra-ui/react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useCallback } from 'react';
import { addNewRecipient, changeRecipient, removeRecipient, setErrorMessages } from 'src/controller/batch-payment/batchPaymentSlice';
import { createBatchPaymentThunk } from 'src/controller/batch-payment/createBatchPaymentThunk';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';
import { usePaymentRequest } from 'src/hooks/usePaymentRequest';
import AddressFieldForMultiRecipient from '../address-book/AddressFieldMultiRecipient';

export default function Recipients() {
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI()
    const { generalSetting, recipients } = useAppSelector(state => state.batchPayment);
    const { validateOneTime } = usePaymentRequest();
    const { createOneTimePayments: createOneTimePaymentsProcess } = useAppSelector(state => state.process);
    const dispatch = useAppDispatch();

    const handleChangeRecipient = useCallback((index: number, att: string, value: any) => {
        dispatch(changeRecipient({ index, att, value }));
    }, [])

    const handleAddRecipient = useCallback(() => {
        dispatch(addNewRecipient());
    }, [])

    const handleRemoveRecipient = useCallback((index: number) => {
        dispatch(removeRecipient({ index }));
    }, []);

    const handleSave = useCallback(() => {
        let errorMessages = validateOneTime({
            generalSetting: generalSetting,
            recipients: recipients,
            errorMessages: []
        })

        if (errorMessages.length) {
            dispatch(setErrorMessages(errorMessages));
            return;
        } else {
            dispatch(setErrorMessages([]));
        }
        dispatch(updateProcessStatus({
            actionName: actionNames.createOneTimePayments,
            att: processKeys.processing,
            value: true
        }))
        dispatch(createBatchPaymentThunk({ wallet, tonConnectUi }));
    }, [wallet, tonConnectUi, generalSetting, recipients])

    return (

        <Card>
            <CardBody>

                <Stack divider={<StackDivider />} gap={4}>
                    {
                        recipients.map((recipient, index) => {
                            return (
                                <Box key={`recipient-${index}`}>
                                    <Box w={"full"} mb={2}>
                                        <Flex alignItems={"center"} justifyContent="space-between">
                                            <WrapItem><Avatar name={(index + 1).toString()} size={"xs"} /></WrapItem>
                                            <ButtonGroup>

                                                <IconButton onClick={() => handleRemoveRecipient(index)}  isDisabled={recipients.length == 1}  aria-label='Remove Recipient' icon={<DeleteIcon />} />
                                            </ButtonGroup>
                                        </Flex>

                                        <Stack>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Wallet Address</FormLabel>
                                                <AddressFieldForMultiRecipient
                                                    att="recipient"
                                                    index={index}
                                                    value={recipient.recipient}
                                                    handleChange={handleChangeRecipient}
                                                />
                                            </FormControl>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Amount</FormLabel>
                                                <InputGroup>

                                                    <Input type="number" value={recipient.amount} min={0} onChange={(e) => handleChangeRecipient(index, "amount", e.target.value)} />

                                                </InputGroup>
                                            </FormControl>
                                        </Stack>

                                    </Box>
                                </Box>
                            )
                        })
                    }

                </Stack>
            </CardBody>
            <CardFooter justifyContent={"center"}>
                {
                    wallet ? (
                        <ButtonGroup w={"100%"}>
                            <Button w={"50%"} variant={'outline'} colorScheme={"blue"} onClick={() => handleAddRecipient()}>New recipient</Button>
                            <Button w={"50%"} isLoading={createOneTimePaymentsProcess.processing} colorScheme="blue" onClick={() => handleSave()}>Apply</Button>
                        </ButtonGroup>
                    ) : (<Button colorScheme="blue">Please connect wallet</Button>)
                }
            </CardFooter>
        </Card>


    )
}