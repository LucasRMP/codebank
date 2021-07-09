import { Typography } from '@material-ui/core'
import { NextPage } from 'next'
import Head from 'next/head'

const Page404: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Not Found</title>
      </Head>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        404 - Page not found
      </Typography>
    </div>
  )
}

export default Page404
