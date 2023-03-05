import {
    VStack,
    Divider, Heading, Box,

} from "@chakra-ui/react"
import WalletList from "../../components/multisign-wallet/WalletList";
import LatestProposal from "../../components/multisign-wallet/LatestProposal";
export default function Index() {
    return (
        <VStack alignItems={"flex-start"}>
            <Heading size={"md"} mb={5}>Latest Proposals</Heading>
            <LatestProposal />
            <Divider/>
            <Heading size={"md"}>All Safe Wallets</Heading>
            <WalletList />
        </VStack>
    )
}