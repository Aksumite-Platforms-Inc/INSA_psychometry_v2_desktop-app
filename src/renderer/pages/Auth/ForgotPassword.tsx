import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box } from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle forgot password logic
    setSubmitted(true);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        {submitted ? (
          <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
            If an account with that email exists, you will receive a password
            reset email shortly.
          </Typography>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Reset Link
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default ForgotPassword;
