import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import PaymentRequest from 'src/database/models/PaymentRequest';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            recipientAddress
        } = req.body;
        if (recipientAddress) {
        
            try {
                let requests = await PaymentRequest.find({recipient: recipientAddress}).sort({createdAt: -1});
                return res.status(200).send(requests);
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