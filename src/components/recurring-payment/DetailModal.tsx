import {
    Heading, Modal, ModalBody,
    ModalCloseButton, ModalContent,
    ModalHeader, ModalOverlay, Progress, Stack, Text
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { getContractDataThunk } from 'src/controller/payment-list/getContractDataThunk';
import { setShowDetailModal } from 'src/controller/payment-list/paymentListSlice';
import { useAddress } from 'src/hooks/useAddress';
import { useStatus } from 'src/hooks/useStatus';

export default function DetailModal() {
    const dispatch = useAppDispatch();
    const {getShortAddress} = useAddress();
    const {getStatus} = useStatus();
    const { showDetailModal, contractData } = useAppSelector((state) => state.paymentList)
    const handleClose = useCallback(() => {
        dispatch(setShowDetailModal(false));
    }, []);

    useEffect(() => {
        dispatch(getContractDataThunk())
    }, [showDetailModal])

    return (
        <Modal isOpen={showDetailModal} onClose={handleClose} size={{ base: "xs", md: 'md' }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Payment Details</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {
                        contractData ? <Stack gap={1}>
                            <Text><strong>Sender</strong>: {getShortAddress(contractData.sender)}</Text>
                            <Text><strong>Recipient:</strong> {getShortAddress(contractData.recipient)}</Text>
                            <Text><strong>Total Amount:</strong> {contractData.payAmount} TON(s)</Text>
                            <Text><strong>Withdrew:</strong> {parseFloat((parseFloat(contractData.payAmount) - parseFloat(contractData.remainingBalance)).toFixed(4))} TON(s)</Text>
                            <Text><strong>Unlock Amount each Time:</strong> {contractData.unlockAmountPerTime} TON(s)</Text>
                            <Text><strong>Number of Unlocks:</strong> {contractData.numberOfUnlock}</Text>
                            <Text><strong>Unlock Every:</strong> {contractData.unlockEvery} second(s)</Text>
                            <Text><strong>Status:</strong> {getStatus(contractData.status)}</Text>
                        </Stack> : <Progress size='xs' isIndeterminate />
                    }

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}