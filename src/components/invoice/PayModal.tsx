import {
  Button, ButtonGroup, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text
} from '@chakra-ui/react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { setShowPayModal } from 'src/controller/invoice/invoiceSlice';
import { payInvoiceThunk } from 'src/controller/invoice/payInvoiceThunk';

import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';

export default function PayModal() {
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();
  const dispatch = useAppDispatch();
  const { isShowPayModal } = useAppSelector(state => state.invoice);
  const { updateInvoiceStatus } = useAppSelector(state => state.process);

  const handleClose = useCallback(() => {
    dispatch(setShowPayModal(false));
  }, []);

  const handleChangeStatus = useCallback(() => {
    dispatch(updateProcessStatus({
      actionName: actionNames.updateInvoiceStatus,
      att: processKeys.processing,
      value: true
    }))
    dispatch(setShowPayModal(false));
    dispatch(payInvoiceThunk({wallet, tonConnectUi}));
  }, [])

  return (
    <Modal isOpen={isShowPayModal} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Do you want to pay this invoice?</Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup gap={4}>
            <Button isLoading={updateInvoiceStatus.processing} variant='outline' onClick={() => handleChangeStatus()} colorScheme={"purple"}>Accept</Button>
            <Button variant={"outline"} colorScheme='blue' mr={3} onClick={handleClose}>
              Close
            </Button>
          </ButtonGroup>


        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}