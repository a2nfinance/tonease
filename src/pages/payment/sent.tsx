import { Box, Flex, Heading, Image, Stat, StatLabel, StatNumber, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import CancelModal from "src/components/recurring-payment/CancelModal";
import SentPaymentList from "src/components/recurring-payment/SentPaymentList";
import TransferModal from "src/components/recurring-payment/TransferModal";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getSenderPaymentRequestsThunk } from "src/controller/payment-list/getSenderPaymentRequestThunk";
import DetailModal from "src/components/recurring-payment/DetailModal";
import { useTonWallet } from "@tonconnect/ui-react";
import { usePaymentRequest } from "src/hooks/usePaymentRequest";
import ActionProcess from "src/components/common/ActionProcess";
export default function SentPayment() {
    const wallet = useTonWallet();
    const dispatch = useAppDispatch();
    const { countProcess, paymentRequests } = useAppSelector(state => state.paymentList)
    const {getStats} = usePaymentRequest();
    async function fetchData() {
        await dispatch(getSenderPaymentRequestsThunk({ wallet }));
    }

    useEffect(() => {
        fetchData();
    }, [wallet, countProcess])

    return (
        <Box>
            <Box>
                <Stat
                    mb="5"
                    px={{ base: 2, md: 4 }}
                    py={'5'}
                    shadow={'xs'}
                    backgroundColor={useColorModeValue("blue.400", "blue.900")}
                    rounded={'lg'}>
                    <Flex justifyContent={'space-between'} color="white">
                        <Box pl={{ base: 2, md: 4 }}>
                            <StatLabel fontWeight={'medium'} isTruncated>
                                Total Sent Amount
                            </StatLabel>
                            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>

                                {getStats(paymentRequests)} TON(s)

                            </StatNumber>
                        </Box>
                        <Box
                            my={'auto'}
                            color={useColorModeValue('gray.800', 'gray.200')}
                            alignContent={'center'}>
                            <Image src="/tokens/ton.png" w={"50px"} />
                        </Box>
                    </Flex>
                </Stat>
            </Box>
            <ActionProcess />
            <SentPaymentList />
            <CancelModal />
            <TransferModal />
            <DetailModal />
        </Box>
    )
}