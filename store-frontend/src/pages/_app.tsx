import Head from 'next/head'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { orange } from '@material-ui/core/colors'
import { Box, Container } from '@material-ui/core'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { SnackbarProvider } from 'notistack'

import Navbar from '../components/navbar'

const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#e64a19',
    },
    secondary: orange,
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStypes = document.querySelector('#jss-server-side')
    jssStypes?.parentElement?.removeChild(jssStypes)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider>
        <Head>
          <title>App Store</title>
        </Head>
        <Navbar />
        <Container>
          <Box marginY={2}>
            <CssBaseline />
            <Component {...pageProps} />
          </Box>
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default MyApp
