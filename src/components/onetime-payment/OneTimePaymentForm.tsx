import {
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    HStack,
    Input, InputGroup, InputLeftElement,
    VStack,
    Radio,
    RadioGroup,
    Stack,
    InputLeftAddon
} from "@chakra-ui/react";
import {
    AiOutlineMail
} from "react-icons/ai";
import TokenSelector from "../common/TokenSelector";
import { useCallback } from "react";
import { stringifier } from "csv/.";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { changeGeneralSetting } from "src/controller/batch-payment/batchPaymentSlice";
import { changeRecipient } from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import { TimeIcon } from "@chakra-ui/icons";



export default function OneTimePaymentForm() {
    const dispatch = useAppDispatch();
    const {generalSetting} = useAppSelector(state => state.batchPayment);
    
    const handleOnChange = useCallback((att: string, value: string | number | boolean ) => {
         dispatch(changeGeneralSetting({att, value}));
    }, [])
    return (
        <Card>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Token</FormLabel>
                        <TokenSelector handleOnChange={handleOnChange} />
                    </FormControl>
                    
                        <FormControl>
                            <FormLabel>Pay</FormLabel>

                            <RadioGroup onChange={value => handleOnChange("isPayNow", (value == "true" ? true : false))} value={generalSetting.isPayNow.toString()}>
                                <Stack direction='row'>
                                    <Radio value='true'>Now</Radio>
                                    <Radio value='false'>On specific date</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel></FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<TimeIcon />}
                                />
                                <Input disabled={generalSetting.isPayNow} type='datetime-local' placeholder='Name' onChange={(e) => handleOnChange("startDate", new Date(e.target.value).getTime())}/>
                            </InputGroup>
                        </FormControl>
                    
                </VStack>

            </CardBody>
        </Card>

    )
}