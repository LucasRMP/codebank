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
import type { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

import { Product } from '../../../models/product'
import api from '../../../services/api'
import { CreditCard } from '../../../models/credit-card'

interface PageProps {
  product: Product
}

const ProductOrderPage: NextPage<PageProps> = ({ product }) => {
  const { register, handleSubmit, setValue } = useForm<CreditCard>()

  const handleFormSubmit: SubmitHandler<CreditCard> = async (values) => {
    const { data } = await api.post('/orders', {
      creditCard: values,
      items: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    })

    console.log({ data })
  }

  const setAsInteger =
    (field: keyof CreditCard) => (e: ChangeEvent<HTMLInputElement>) => {
      setValue(field, parseInt(e.target.value))
    }

  return (
    <>
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

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              {...register('name')}
              variant="outlined"
              label="Name"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register('number')}
              variant="outlined"
              label="Card Number"
              inputProps={{ maxLength: 16 }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register('cvv')}
              variant="outlined"
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
                  {...register('expirationMonth')}
                  variant="outlined"
                  type="number"
                  label="Exp. Month"
                  onChange={setAsInteger('expirationMonth')}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register('expirationYear')}
                  variant="outlined"
                  type="number"
                  label="Exp. Year"
                  onChange={setAsInteger('expirationYear')}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Finish
          </Button>
        </Box>
      </form>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  PageProps,
  { slug: string }
> = async ({ params }) => {
  try {
    const { slug } = params
    const { data: product } = await api.get<Product>(`/products/${slug}`)

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

export default ProductOrderPage
