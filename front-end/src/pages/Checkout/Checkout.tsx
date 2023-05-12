import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, Box, List, ListItem, ListItemText } from '@mui/material';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { checkout } from '../../api/books.js'; 
import $bus from '../../tools/$bus';

const Checkout = () => {
    const navigate = useNavigate();

    const [discountCode, setDiscountCode] = useState('');

    const [cart, setCart] = useState([
    ]);


    useEffect(() => {
        const cart = localStorage.getItem('cart');
        if (cart) {
            $bus.setCart(JSON.parse(cart));
            setCart(JSON.parse(cart));
        }

        console.log('cart', cart);

    }, []);

    const handleCheckout = async () => {
        try {
            const response = await checkout(cart, discountCode);
            if (response.orderId) {
                // Clear the cart
                $bus.setCart([]);
                localStorage.removeItem('cart');

                alert('Order placed successfully, order id is: ' + response.orderId);
                navigate('/'); // Redirect to home page or any other page
            } else {
                alert('Failed to place the order');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to place the order');
        }
    };

    const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Checkout
            </Typography>
            <List>
                {cart.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={item.title}
                            secondary={`Quantity: ${item.quantity}, Price: $${item.price}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Typography variant="h6" gutterBottom>
                Total Cost: ${totalCost.toFixed(2)}
            </Typography>
            <TextField
                label="Discount Code"
                variant="outlined"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleCheckout}>
                Pay
            </Button>
        </Box>
    );
};

export default Checkout;
