import { NextApiRequest, NextApiResponse } from 'next'
import { products } from '../_mock/db'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query
  const product = products.find((product) => product.slug === slug)

  if (!product) {
    return res.status(404).json({ error: 'item not found' })
  }

  return res.json({ product })
}
