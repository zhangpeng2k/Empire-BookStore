import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

import $bus from '../../tools/$bus';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

//logout
const logout = () => {
  $bus.emit('logout');
  location.reload()
}

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState('');
  const [cartCount, setCartCount] = useState();

  const [user, setUser] = useState(null);

  useEffect(() => {
    loginUserData()
  }, []);

  const loginUserData=()=>{
    const userInfo = localStorage.getItem('userInfo');
      
    if (userInfo) {
      let user = JSON.parse(localStorage.getItem('userInfo'));
      $bus.setUserData({ ...user });
      setUser(user);
      console.log('user',user);
      console.log('User logged in successfully',$bus.state.userdata);
      
    }
  }

  useEffect(() => {

    //从localStorage中获取cart数据
    const cart = localStorage.getItem('cart');
    if (cart) {
      $bus.setCart(JSON.parse(cart));
    }
    
    $bus.addListener('login', (cart) => loginUserData());
    $bus.addListener('cart', (cart) => setCart(cart));
    $bus.addListener('cartCount', (cartCount) => setCartCount(cartCount));

    $bus.addListener('logout', () => {
      localStorage.clear()
      $bus.setUserData({})
    }); 

  }, []);



  const handleLogoClick = () => {
    navigate('/');
    location.reload()
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/${searchText}`);
    location.reload()
    setSearchText('');
  };

  return (
    <AppBar position="static">
      <Box
        sx={{
          width: '1200px',
          margin: '0 auto',
        }}
      >
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <div className="logo" onClick={handleLogoClick}>
            <img src="src/imgs/Empire Bookstore.png" alt="Empire Bookstore" className="logo" />
          </div>
        </Typography>
        <Search>
          <form onSubmit={handleSearch}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </form>
        </Search>
        <Button color="inherit" onClick={() => navigate('/')}>
          Home
        </Button>
        {
          user&&user.first_name!==null  ?
          ('Welcome,' + $bus.state.userdata.first_name):
          (<Button color="inherit" onClick={() => navigate('/login')}>
          Login
        </Button>)
        }

        {user&&user.first_name!==null?(<Button color="inherit" onClick={() => logout()}>
          logout
        </Button>):(null)}

        {user&&user.first_name!==null?(<Button color="inherit" onClick={() => navigate('/orders')}>
          My Orders
        </Button>):(null)}
        
        
        <IconButton color="inherit" onClick={()=>navigate('/cart')}>
          <Badge badgeContent={cart.length} showZero color="primary"  >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;
