import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@material-ui/core'
import axios from 'axios'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Product } from '../../../models/product'
import api from '../../../services/api'

interface PageProps {
  product: Product
}

const ProductPage: NextPage<PageProps> = ({ product }) => {
  return (
    <div>
      <Head>
        <title>{product.name} - App Store</title>
      </Head>

      <Card>
        <CardHeader
          title={product.name.toUpperCase()}
          subheader={`$ ${product.price.toFixed(2)}`}
        />

        <CardActions>
          <Link
            href="/products/[slug]/order"
            as={`/products/${product.slug}/order`}
            passHref
          >
            <Button size="small" color="primary" component="a">
              Buy
            </Button>
          </Link>
        </CardActions>

        <CardMedia style={{ paddingTop: '56%' }} image={product.image_url} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export const getStaticProps: GetStaticProps<PageProps, { slug: string }> =
  async ({ params }) => {
    try {
      const { slug } = params
      const {
        data: { product },
      } = await api.get<{ product: Product }>(`/products/${slug}`)

      return {
        props: {
          product,
        },
        revalidate: 60 * 2, // 2 minutes
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return { notFound: true }
      }

      throw err
    }
  }

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { slug: 'practical-concrete-chair' },
    { slug: 'practical-granite-table' },
    { slug: 'intelligent-metal-soap' },
  ].map((product) => ({ params: { slug: product.slug } }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export default ProductPage
