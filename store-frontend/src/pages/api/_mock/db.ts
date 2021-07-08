import faker from 'faker'
import { Product } from '../../../models/product'

faker.seed(2)
export const products: Product[] = Array.from({ length: 30 }, (_, idx) => {
  const name = faker.commerce.productName()

  return {
    id: `${idx + 1}`,
    name,
    description: faker.commerce.productDescription(),
    image_url: 'https://source.unsplash.com/random?product' + Math.random(),
    slug: faker.helpers.slugify(name.toLowerCase()),
    price: faker.datatype.number({ precision: 2 }),
    created_at: faker.date.past(10).toISOString(),
  }
})
