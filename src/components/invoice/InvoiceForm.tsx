import { HamburgerIcon } from "@chakra-ui/icons";
import {
    Card,
    CardBody, FormControl, FormLabel, HStack,
    Input,
    InputGroup,
    InputLeftAddon, Select, VStack
} from "@chakra-ui/react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useCallback } from "react";
import {
    AiOutlineDollarCircle, AiOutlineTags
} from "react-icons/ai";
import { fiats } from "src/config/invoice";
import { useAppDispatch } from "src/controller/hooks";
import { changeGeneralSetting } from "src/controller/invoice/invoiceSlice";
import AddressField from "../address-book/AddressField";
import TokenSelector from "../common/TokenSelector";



export default function InvoiceForm() {
    const wallet = useTonWallet();
    const dispatch = useAppDispatch();
    const handleUpdate = useCallback((att: string, value: string | number) => {
        dispatch(changeGeneralSetting({ att, value }));
    }, [])
    return (
        <Card>
            <CardBody>
                <VStack>
                    <AddressField label={"Your Client"} att="recipient" placeHolder="" handleChange={handleUpdate} />
                    <HStack gap={4} width={"full"}>

                        <FormControl>
                            <FormLabel>Fiat</FormLabel>
                            <InputGroup>
                                <InputLeftAddon pointerEvents={"none"} children={<AiOutlineDollarCircle />} />
                                <Select onChange={(e) => handleUpdate("fiat", e.target.value)}>
                                    {
                                        fiats.map(fiat => {
                                            return <option value={fiat.value}>{fiat.label}</option>
                                        })
                                    }
                                </Select>
                            </InputGroup>

                        </FormControl>
                        <FormControl>
                            <FormLabel>Token</FormLabel>

                            <TokenSelector handleOnChange={handleUpdate} />
                        </FormControl>
                    </HStack>
                    <HStack gap={4} width={"full"}>
                        <FormControl>
                            <FormLabel>Category</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<HamburgerIcon />}
                                />
                                <Input type='text' onChange={(e) => handleUpdate("category", e.target.value)} placeholder='Category' />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Tags</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<AiOutlineTags />}
                                />
                                <Input type='text' onChange={(e) => handleUpdate("tags", e.target.value)} placeholder='Tags' />
                            </InputGroup>
                        </FormControl>
                    </HStack>
                </VStack>

            </CardBody>
        </Card>

    )
}