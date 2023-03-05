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
  ButtonGroup,
} from '@chakra-ui/react'
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks'
import { cancelPaymentRequestThunk } from 'src/controller/payment-list/cancelPaymentRequestThunk';
import { setShowCancelModal } from 'src/controller/payment-list/paymentListSlice';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
export default function CancelModal() {
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();
  const dispatch = useAppDispatch();
  const { showCancelModal } = useAppSelector(state => state.paymentList);
  const { cancel } = useAppSelector(state => state.process);

  const handleClose = useCallback(() => {
    dispatch(setShowCancelModal(false));
  }, []);

  const handleCancelPaymentRequest = useCallback(() => {

    dispatch(updateProcessStatus({
      actionName: actionNames.cancel,
      att: processKeys.processing,
      value: true
    }))

    dispatch(setShowCancelModal(false));

    dispatch(cancelPaymentRequestThunk({ tonConnectUi }));

  }, [wallet])

  return (
    <Modal isOpen={showCancelModal} onClose={handleClose} size={{ base: "xs", md: 'md' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Do you want to cancel this Payment Request?</Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup gap={4}>
            <Button isLoading={cancel.processing} variant='outline' onClick={() => handleCancelPaymentRequest()} colorScheme={"purple"}>Yes</Button>
            <Button variant={"outline"} colorScheme='blue' mr={3} onClick={handleClose}>
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}