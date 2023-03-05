import {
    Button, ButtonGroup,
    Card,
    CardBody, CardFooter, FormControl, FormLabel, HStack,
    Input, InputGroup, InputLeftAddon, Select, VStack
} from "@chakra-ui/react";
import {
    AiOutlineMail
} from "react-icons/ai";
import {
    RiWallet2Line
} from "react-icons/ri";

import { useTonWallet } from "@tonconnect/ui-react";
import { useCallback, useEffect } from "react";
import {
    BiGroup
} from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { setAddressAttribute } from "src/controller/address-book/addressBookSlice";
import { getGroupsThunk } from "src/controller/address-book/getGroupsThunk";
import { saveAddressThunk } from "src/controller/address-book/saveAddressThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";



export default function AddressForm() {
    const wallet = useTonWallet();
    const dispatch = useAppDispatch();
    const { groupList } = useAppSelector(state => state.addressBook);
    const process = useAppSelector(state => state.process)

    useEffect(() => {
        if (wallet) {
            dispatch(getGroupsThunk(wallet));
        }
    }, [wallet, process.saveAddressGroup.processing])

    const handleChange = useCallback((att: string, value: string | number) => {
        dispatch(setAddressAttribute({
            att: att,
            value: value
        }))
    }, [])

    const handleSave = useCallback(() => {
        dispatch(updateProcessStatus({
            actionName: actionNames.saveAddress,
            att: processKeys.processing,
            value: true
        }))

        dispatch(saveAddressThunk(wallet));

    }, [wallet])

    return (
        <Card>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Wallet Address</FormLabel>
                        <InputGroup>
                            <InputLeftAddon
                                pointerEvents='none'
                                children={<RiWallet2Line />}
                            />
                            <Input onChange={e => handleChange("walletAddress", e.target.value)} type='text' placeholder='Wallet address' />
                        </InputGroup>
                    </FormControl>
                    <HStack gap={4} width={"full"}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<BsPerson />}
                                />
                                <Input onChange={e => handleChange("name", e.target.value)} type='text' placeholder='Name' />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<AiOutlineMail />}
                                />
                                <Input onChange={e => handleChange("email", e.target.value)} type='email' placeholder='Email' />
                            </InputGroup>
                        </FormControl>
                    </HStack>
                    <FormControl>
                        <FormLabel>Group</FormLabel>
                        <InputGroup>
                            <InputLeftAddon pointerEvents='none' children={<BiGroup />} />

                            <Select onChange={e => handleChange("groupId", e.target.value)} placeholder='Select a group'>
                                {
                                    groupList.map((group, index) => {
                                        return <option key={`group-${index}`} value={group._id}>{group.name}</option>
                                    })
                                }
                            </Select>
                        </InputGroup>

                    </FormControl>


                </VStack>

            </CardBody>
            <CardFooter justifyContent={"center"}>
                {
                    wallet ? (

                        <ButtonGroup w={"100%"}>
                            <Button w={"50%"} onClick={() => handleSave()} isLoading={process.saveAddress.processing} colorScheme={"blue"}>Save</Button>
                            <Button w={"50%"} variant={"outline"}>Reset</Button>
                        </ButtonGroup>

                    ) : (
                        <Button colorScheme="blue">Please connect wallet</Button>
                    )
                }

            </CardFooter>
        </Card>

    )
}