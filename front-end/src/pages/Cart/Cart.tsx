import React, { useEffect, useState } from 'react';
import { Button, List, ListItem, Typography, IconButton, ListItemSecondaryAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import $bus from '../../tools/$bus';

type CartItem = {
  _id: string;
  title: string;
  price: number;
  quantity: number;
};



const Cart = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState<CartItem[]>([
        // { _id: '1', title: 'Book 1', price: 100, quantity: 1 },
        // { _id: '2', title: 'Book 2', price: 200, quantity: 2 },
    ]);

    
    useEffect(() => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        $bus.setCart(JSON.parse(cart));
        setCartItems(JSON.parse(cart));
      }

      console.log('cartItems',cartItems);
      
    }, []);

    const handleIncrease =  (item: CartItem)  => {

      setCartItems(prevItems => {
        const newItems = prevItems.map(cartItem => 
          cartItem._id === item._id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem
        );
        $bus.setCart(newItems);
        return newItems;
      });
    };

    const handleDecrease = (item: CartItem) => {
      setCartItems(prevItems => {
        const newItems = prevItems.map(cartItem => 
          cartItem._id === item._id && cartItem.quantity > 1 ? {...cartItem, quantity: cartItem.quantity - 1} : cartItem
        );
        $bus.setCart(newItems);
        return newItems;
      });
    };
    
    const handleRemove = (item: CartItem) => {
      setCartItems(prevItems => {
        const newItems = prevItems.filter(cartItem => cartItem._id !== item._id);
        $bus.setCart(newItems);
        return newItems;
      });
    };
    
    
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

    const handleCheckout = () => {
        navigate('/checkout');  
    };

    return (
        <div>
            <Typography variant="h4">Your Cart</Typography>
            <List>
                {cartItems.map(item => (
                    <ListItem key={item._id}>
                        <Typography>{item.title} - {item.price} x {item.quantity}</Typography>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleIncrease(item)}>
                                <AddIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleDecrease(item)}>
                                <RemoveIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleRemove(item)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Typography variant="h6">Total: {calculateTotal().toFixed(2)}</Typography>
            <Button variant="contained" color="primary" onClick={handleCheckout}>Checkout</Button>
        </div>
    );
};

export default Cart;
