import connect from 'src/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import * as fs from "fs";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        
            try {
                let content = fs.readFileSync("contracts/tonease/cell/tonease.cell");
                return res.status(200).send(content);
            } catch (error) {
                console.log(error)
                return res.status(500).send(error.message);
            }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);