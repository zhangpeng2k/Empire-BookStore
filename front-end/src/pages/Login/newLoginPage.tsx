import React, { useState } from 'react';
import {
    Button,
    TextField,
    Typography,
    Link,
    Grid,
    Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { registerUser,loginUser } from '../../api/user.js'
import $bus from '../../tools/$bus.js';

export default function SignInSide() {
    const [formType, setFormType] = useState('signin');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '', // Add this
            lastName: '',  // Add this
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Required'),
            confirmPassword: formType === 'register'
                ? Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords must match')
                    .required('Required')
                : null,
            firstName: formType === 'register' ? Yup.string().required('Required') : null, // Add this
            lastName: formType === 'register' ? Yup.string().required('Required') : null, // Add this
        }),
        onSubmit: async (values) => {
            try {
                console.log('Form submitted');
                if (formType === 'signin') {
                    // alert(' Sign in')
                    // Call API to Sign in
                    const { email, password } = formik.values;


                    try {
                        const response = await loginUser(email, password)
                        const { token, message,user } = response;
                        if (token) {
                            localStorage.setItem('jwt', token);
                            localStorage.setItem('userId', user.id);
                            localStorage.setItem('userInfo', JSON.stringify(user));
                            $bus.emit('login', user);
                            $bus.setUserData({ ...user });
                            navigate('/');
                            console.log('User logged in successfully',$bus.state.userdata);
                            // Redirect user to the homepage or another page
                        } else {
                            // Display the error message to the user
                            alert(message);
                            console.error(message);
                        }

                        if (response.status === 200) {
                            alert('User logged in successfully');
                            navigate('/');
                            setFormType('signin');
                        } else {
                        }
                    } catch (err) {
                        alert(err.message);
                        console.error('Error logging in:', err.message);
                    }

                    
                    

                } else {
                    // Call API to Register
                    const { email, password, firstName, lastName } = formik.values;




                    try {
                        const response = await registerUser(email,
                            password,firstName,lastName,)

                        if (response.status === 201) {
                            alert('User registered successfully');
                            setFormType('signin');
                        } else {
                            alert(`${response.message}`);
                        }
                    } catch (err) {
                        alert(err.message);
                        console.error('Error register:', err.message);
                    }
                }
                // handle successful response
            } catch (error) {
                console.error('Error:', error);
            }
        },
    });

    return (
        <Grid container component="main" style={{ height: '100vh' }}>
            <Grid item xs={false} sm={4} md={7} style={{
                backgroundImage: 'url(https://source.unsplash.com/random)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#f8f8f8',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div style={{
                    margin: '80px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Typography component="h1" variant="h5">
                        {formType === 'signin' ? 'Sign in' : 'Register'}
                    </Typography>
                    <form style={{ width: '100%', marginTop: '8px' }} onSubmit={formik.handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        {formType === 'register' && (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="firstName"
                                label="First Name"
                                type="text"
                                id="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange} // Add this
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)} // Add this
                                helperText={formik.touched.firstName && formik.errors.firstName} // Add this
                            />
                        )}
                        {formType === 'register' && (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="lastName"
                                label="Last Name"
                                type="text"
                                id="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange} // Add this
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)} // Add this
                                helperText={formik.touched.lastName && formik.errors.lastName} // Add this
                            />
                        )}


                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        {formType === 'register' && (
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="confirm-password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ margin: '24px 0px 16px' }}
                        >
                            {formType === 'signin' ? 'Sign in' : 'Register'}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link
                                    variant="body2"
                                    onClick={() =>
                                        setFormType(
                                            formType === 'signin' ? 'register' : 'signin'
                                        )
                                    }
                                >
                                    {formType === 'signin'
                                        ? "Don't have an account? Sign Up"
                                        : 'Already have an account? Sign in'}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    )
}    
