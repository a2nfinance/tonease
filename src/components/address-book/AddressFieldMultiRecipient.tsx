import { Flex, FormControl, FormHelperText, FormLabel, HStack, InputGroup, InputLeftAddon, Tag } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { useAddress } from "src/hooks/useAddress";
import { RiWallet2Line } from "react-icons/ri";

export default function AddressFieldForMultiRecipient({ att, index, handleChange, value }) {
    const { addressList } = useAppSelector(state => state.addressBook);
    const { getShortAddress } = useAddress();
    return (
        <FormControl>
            <AutoComplete freeSolo={true} openOnFocus onSelectOption={val => handleChange(index, att, val.item.value)} >
                <InputGroup>
                    <InputLeftAddon
                        pointerEvents='none'
                        children={<RiWallet2Line />}
                    />
                    <AutoCompleteInput isRequired={true} value={value} onChange={e => handleChange(index, att, e.target.value)}/>
                </InputGroup>
                <AutoCompleteList ml={10} mt={1} maxW={350}>
                    {addressList.map((address) => (
                        <AutoCompleteItem
                            key={`option-${address._id}`}
                            value={address.walletAddress}
                            textTransform="capitalize"
                        >
                            <HStack gap={1}>
                                {
                                    address.name ? <Tag>{address.name}</Tag> : <span></span>
                                }
                                <Tag colorScheme={"purple"}>{getShortAddress(address.walletAddress)}</Tag>
                                {
                                    address.email ? <Tag colorScheme={"blue"}>{address.email}</Tag> : <span></span>
                                }
                            </HStack>

                        </AutoCompleteItem>
                    ))}
                </AutoCompleteList>
            </AutoComplete>
        </FormControl>
    )
}