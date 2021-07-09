import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core'
import axios from 'axios'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { Product } from '../../../models/product'
import api from '../../../services/api'

interface PageProps {
  product: Product
}

const ProductOrderPage: NextPage<PageProps> = ({ product }) => {
  return (
    <Container>
      <Head>
        <title>Checkout - App Store</title>
      </Head>

      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Checkout
      </Typography>

      <ListItem>
        <ListItemAvatar>
          <Avatar src={product.imageUrl} />
        </ListItemAvatar>
        <ListItemText primary={product.name} secondary={`$ ${product.price}`} />
      </ListItem>

      <Typography component="h2" variant="h6" color="textPrimary" gutterBottom>
        Pay with credit card
      </Typography>

      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField label="Name" required fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Card Number"
              inputProps={{ maxLength: 16 }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="number"
              label="Verification number"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Exp. Month"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField type="number" label="Exp. Year" required fullWidth />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box style={{ marginTop: '1rem' }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Finish
          </Button>
        </Box>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<
  PageProps,
  { slug: string }
> = async ({ params }) => {
  try {
    const { slug } = params
    const {
      data: { product },
    } = await api.get<{ product: Product }>(`/products/${slug}`)

    return {
      props: {
        product,
      },
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return { notFound: true }
    }

    throw err
  }
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = [
//     { slug: 'practical-concrete-chair' },
//     { slug: 'practical-granite-table' },
//     { slug: 'intelligent-metal-soap' },
//   ].map((product) => ({ params: { slug: product.slug } }))

//   return {
//     paths,
//     fallback: 'blocking',
//   }
// }

export default ProductOrderPage
