import { HashRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Details from './pages/Details/Details';
import About from './pages/About/About';
import Footer from './pages/Footer/Footer';
import Header from './pages/Header/Header';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import MyOrders from './pages/Order/Order';
// import Login from './pages/Login/LoginPage';


import Search from './pages/Home/Home';


import NewLogin from './pages/Login/newLoginPage';

import $bus from './tools/$bus';  

import './styles/BaseStyles.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#81B234',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
    },
  },
});

const queryClient = new QueryClient();

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div id='main'>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" key={'1'} element={<Home />} />
            <Route path="about" key={'2'} element={<About />} />
            <Route path="details/:id" key={'3'} element={<Details />} />
            <Route path="Search/:q" key={'4'} element={<Search />} />
            <Route path="login" key={'5'} element={<NewLogin />} />
            <Route path="cart" key={'6'} element={<Cart />} />
            <Route path="checkout" key={'7'} element={<Checkout />} />
            <Route path="orders" key={'8'} element={<MyOrders />} />

            <Route path="*" key={'0'} element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
      </div>
      <Footer />
    </ThemeProvider>
  );
}

export function WrappedApp() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}
