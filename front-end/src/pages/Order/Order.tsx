import React from 'react';
import { useQuery } from 'react-query';
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import {getOrders} from './../../api/books.js';
import OrderCard from './OrderCard.js';



const MyOrders = () => {
  const { data: orders, isLoading } = useQuery('orders', getOrders);

  if (isLoading) return (<p>loading</p>);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.map(order => (
        <OrderCard key={order._id} order={order} />
    ))}
    </Container>
  );
};

export default MyOrders;
