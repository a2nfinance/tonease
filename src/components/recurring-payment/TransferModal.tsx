import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    InputGroup,
    InputLeftAddon,
    Input,
    ButtonGroup,
} from '@chakra-ui/react'
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback, useState } from 'react';
import { RiWallet2Line } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks'
import { setShowTransferModal } from 'src/controller/payment-list/paymentListSlice';
import { transferPaymentRequestThunk } from 'src/controller/payment-list/transferPaymnentRequestThunk';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';

export default function TransferModal() {
    const dispatch = useAppDispatch();
    const [tonConnectUi] = useTonConnectUI();
    const { showTransferModal, selectedPaymentRequest } = useAppSelector(state => state.paymentList);
    const { transfer } = useAppSelector(state => state.process);
    const [to, setTo] = useState("");

    const handleClose = useCallback(() => {
        dispatch(setShowTransferModal(false));
    }, []);

    const handleTransferPaymentRequest = useCallback((to) => {

        dispatch(updateProcessStatus({
            actionName: actionNames.transfer,
            att: processKeys.processing,
            value: true
        }))
        dispatch(setShowTransferModal(false));
        dispatch(transferPaymentRequestThunk({to, tonConnectUi}))

    }, [to])

    return (
        <Modal isOpen={showTransferModal} onClose={handleClose} size={{base: "xs", md: 'md'}}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Transfer Payment Request</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <InputGroup>
                        <InputLeftAddon pointerEvents={"none"} children={<RiWallet2Line />} />
                        <Input type={"text"} placeholder="New recipient address" value={to} onChange={(e) => setTo(e.target.value)} />
                    </InputGroup>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button isLoading={transfer.processing} variant='outline' onClick={() => handleTransferPaymentRequest(to)} colorScheme={"purple"}>Yes</Button>
                        <Button variant={"outline"} colorScheme='blue' mr={3} onClick={handleClose}>
                            No
                        </Button>

                    </ButtonGroup>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}