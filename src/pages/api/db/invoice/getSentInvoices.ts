import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Invoice from 'src/database/models/Invoice';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            owner
        } = req.body;
        if (owner) {
        
            try {
                let invoices = await Invoice.find({owner: owner}).sort({createdAt: -1});
                return res.status(200).send(invoices);
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