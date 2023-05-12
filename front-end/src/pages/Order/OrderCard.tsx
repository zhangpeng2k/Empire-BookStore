import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText,Button } from '@mui/material';
import {changeOrderStatus} from './../../api/books.js';

const OrderCard = ({ order }) => {

    const handleCancel = async () => {
        try {
            const response = await changeOrderStatus(order._id, 'cancelled');
            if (response.message) {
                alert(response.message);
                window.location.reload();
            } else {
                alert('Failed to cancel the order');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to cancel the order');
        }
    };

    const handleComplete = async () => {
        try {
            const response = await changeOrderStatus(order._id, 'completed');
            if (response.message) {
                alert(response.message);
                window.location.reload();
            } else {
                alert('Failed to complete the order');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to complete the order');
        }
    };
    

    return (
        <Card sx={{ minWidth: 275, mt: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Order ID: {order._id}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Total Cost: ${order.totalCost.toFixed(2)}
                </Typography>
                <Typography variant="h6">
                    Status: {order.status}
                    {
                        // IF order is pending, show a button to cancel or complete the order
                        order.status === 'pending' && (
                            <div>
                                <Button variant="contained" color="primary"
                                 onClick={handleCancel}
                                 sx={{ ml: 2 }}>
                                    Cancel
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleComplete} sx={{ ml: 2 }}>
                                    Complete
                                </Button>
                            </div>
                        )


                    }
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                    Items:
                </Typography>
                <List>
                    {order.items.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemText primary={item.book.title} secondary={`Quantity: ${item.quantity}`} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
