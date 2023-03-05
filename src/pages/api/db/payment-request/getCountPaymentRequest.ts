import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import PaymentRequest from 'src/database/models/PaymentRequest';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            senderAddress
        } = req.body;
        if (senderAddress) {
        
            try {
                let count = await PaymentRequest.find({sender: senderAddress}).count();
                return res.status(200).send(count);
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