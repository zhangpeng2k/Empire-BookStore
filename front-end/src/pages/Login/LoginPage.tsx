import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Link,
  Grid,
  Paper,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

export default function SignInSide() {
  const [formType, setFormType] = useState('signin');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    navigate('/');
    // $bus.setUserData({ username: 'test' });
  };

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
          <form style={{ width: '100%', marginTop: '8px' }} onSubmit={handleSubmit}>
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
            />
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
              />
            )}
            {formType === 'register' && (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                type="text"
                id="username"
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
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
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
  );
}
