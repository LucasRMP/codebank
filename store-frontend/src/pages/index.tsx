import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  Container,
} from '@material-ui/core'

import Iterate from '../components/Iterate'
import { Product } from '../models/product'
import api from '../services/api'

interface PageProps {
  products: Product[]
}

const ProductListPage: NextPage<PageProps> = ({ products }) => {
  return (
    <Container>
      <Head>
        <title>List - App Store</title>
      </Head>

      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={4}>
        <Iterate
          data={products}
          keyExtractor={(product) => product.id}
          render={({ data: product }) => (
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  style={{ paddingTop: '56%' }}
                  image={product.imageUrl}
                />
                <CardContent>
                  <Typography
                    component="h2"
                    variant="h5"
                    color="textPrimary"
                    gutterBottom
                  >
                    {product.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link
                    href="/products/[slug]"
                    as={`/products/${product.slug}`}
                    passHref
                  >
                    <Button
                      size="small"
                      color="primary"
                      component="a"
                      fullWidth
                    >
                      Details
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          )}
        />
      </Grid>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const { data: products } = await api.get<Product[]>('/products')

  return {
    props: { products },
  }
}

export default ProductListPage
