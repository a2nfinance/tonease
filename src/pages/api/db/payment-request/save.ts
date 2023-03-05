import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import PaymentRequest from "src/database/models/PaymentRequest";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        // need to validate
        const {
            generalSetting,
            recipients,
            senderAddress
        } = req.body;
        if (generalSetting.startDate && recipients.length > 0 && senderAddress) {
            try {
                let paymentRequests = [];
                for (let i = 0; i < recipients.length; i++) {
                    paymentRequests.push({...generalSetting, ...recipients[i], sender: senderAddress});
                }
                let savedPaymentRequests = await PaymentRequest.insertMany(paymentRequests);
                return res.status(200).send(savedPaymentRequests);
            } catch (error) {
                console.log(error)
                return res.status(500).send(error.message);
            }
        } else {
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);