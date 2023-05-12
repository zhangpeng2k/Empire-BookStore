
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import Album from "../Home/Album";


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    TextField,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { searchBookById,addComment } from '../../api/books.js';
import Skeleton from '@mui/material/Skeleton';
import $bus from '../../tools/$bus';
import bookImg from './../../imgs/DALL-E book.png'

const ProductDetails = () => {


    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState<number>(1);
    const { isLoading, data: book } = useQuery(['details', id], () => searchBookById(id), { cacheTime: 0,onSuccess: (data) => {
        setComments(data.comments);
     }});

    const [commentText, setCommentText] = useState<string>('');
    const [comments, setComments] = useState<Array<any>>([]);


    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommentText(event.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (commentText.trim() === '') {
            alert('Comment text cannot be empty');
            return;
        }

        try {
            const newCommentData = await addComment(id, commentText);
            console.log('newComment',newCommentData);
            if (newCommentData.comment) {
                setComments((prevComments) => [...prevComments, newCommentData.comment]);
                setCommentText('');
            }else{
                alert('Failed to add comment');
            }
            
        } catch (error) {
            alert('Failed to add comment');
        }
    };


    const handleAddQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleRemoveQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" width={345} height={400} />
                    ) : (
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia component="img" height="200" image={bookImg} alt={book.title} />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {book.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                    {isLoading ? (
                        <>
                            <Skeleton variant="text" width={200} height={40} />
                            <Skeleton variant="rectangular" width={400} height={400} sx={{ mt: 2 }} />
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Book Details: {book.title}
                            </Typography>
                            <Divider />
                            <List sx={{ pt: 2 }}>
                                <ListItem disablePadding>
                                    <ListItemText primary="Book title" secondary={book.title} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Book author" secondary={book.author} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Book Price" secondary={`$${book.price}`} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Book publisher" secondary={book.publisher} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Book Category" secondary={book.category} />
                                </ListItem>
                            </List>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Typography variant="h6" sx={{ mr: 2 }}>
                                    Quantity:
                                </Typography>
                                <TextField
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    inputProps={{
                                        min: 1, max: 99
                                    }}
                                    sx={{ maxWidth: 60 }}
                                />
                                <Button variant="contained" onClick={handleAddQuantity} sx={{ ml: 1 }}>
                                    +
                                </Button>
                                <Button variant="contained" onClick={handleRemoveQuantity} sx={{ ml: 1 }}>
                                    -
                                </Button>
                            </Box>
                            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => $bus.addToCart({...book,quantity})}>
                                Add to Cart
                            </Button>
                            <Button variant="contained" color="primary" sx={{ mt: 3, left:30 }} onClick={() => {
                                navigate('/cart')
                            }}>
                                Go to Cart
                            </Button>
                        </>
                    )}
                </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={commentText}
                    onChange={handleCommentChange}
                    variant="outlined"
                    placeholder="Enter your comment here"
                />
                <Button variant="contained" color="primary" onClick={handleSubmitComment} sx={{ mt: 2 }}>
                    Submit Comment
                </Button>
            </Box>
            <h2>Reviews</h2>
            <List sx={{ mt: 3 }}>
                {comments.map((comment, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={comment.text} secondary={`Posted on ${comment.createdAt}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
        
    );
};

export default ProductDetails;