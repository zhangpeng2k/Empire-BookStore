import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import Details from '../Details/Details';
import About from '../About/About';
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

import '@mui/material';
import { getBooks } from './../../api/books.js';

import $bus from '../../tools/$bus';
interface HomeState {
  userinfo: {
    username: string;
  };
  cartCount: {
    count: number;
  };
  booklist: [];
  isLoading: boolean;
}





function BookCard({ book }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Card sx={{ width: 245, m: 1 }} >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={book.cover || 'https://source.unsplash.com/random'}
          alt={book.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.author}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => $bus.addToCart(book)}>
          Add to Cart
        </Button>
        <Button size="small" color="primary" onClick={() => navigate('/details/'+book._id)}>
          View Detail
        </Button>
      </CardActions>
    </Card>
  );
}


class Home extends Component<{}, HomeState> {
  constructor(props) {
    super(props);
    this.state = {
      userinfo: {
        username: "",
      },
      cartCount: {
        count: 0,
      },
      booklist: [],
      isLoading: true,
    };

  }

  async componentDidMount() {
    $bus.addListener('setUserData', this.SettingUserData);

    $bus.addListener('addCartCount', this.AddCartCount);

    // get book
    // this.state.booklist = await getBooks();
    let bookRes = await getBooks();
    this.setState({ booklist: bookRes.books }, () => {
      console.log(this.state.booklist);
      // set isLoading to false
      this.setState({ isLoading: false });
    });


  }

  componentWillUnmount() {
    $bus.removeListener('setUserData', this.SettingUserData);
    $bus.removeListener('addCartCount', this.AddCartCount);
  }

  SettingUserData(e) {
    let data = { ...e }
    $bus.setUserData(data)
    this.setState({ userinfo: { username: e.username } }, () => {
      console.log(e, this.state.userinfo.username);
    });
  }


  AddToCart(book) {
    console.log('AddToCart', book);
    let count = this.state.cartCount

  }

  AddCartCount(e) {
    let data = { ...e }
    $bus.setCartCount(data)
    this.setState({ cartCount: { count: e.count } }, () => {
      console.log(e, this.state.cartCount.count);
    });
  }

  render() {
    return (
      <>

        <Container maxWidth="lg" sx={{ mt: 3 }}>
          <Typography variant="h3" sx={{ mb: 3 }}>
            Welcome to Online Bookstore
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Bestselling Books
          </Typography>
          {this.state.isLoading === false ? (

            <Container maxWidth="md" sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {this.state.booklist.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </Container>
          ) : (<div>loading</div>)}


        </Container>
      </>
    );
  }
}

export default Home;
