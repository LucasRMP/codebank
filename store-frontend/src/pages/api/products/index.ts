import { NextApiRequest, NextApiResponse } from 'next'

import { products } from '../_mock/db'

export default (_: NextApiRequest, res: NextApiResponse) => {
  return res.json(products)
}
