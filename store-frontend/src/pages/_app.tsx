import Head from 'next/head'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { orange } from '@material-ui/core/colors'

const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#e64a19',
    },
    secondary: orange,
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Head>
        <title>App Store</title>
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
