import React, { useState } from 'react';
import { Button, TextField, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Illustration from '../../assets/Images/logo/undraw_forgot_password_re_hxwm.svg'; // Use a relevant illustration
import Logo from '../../assets/Images/logo/INSA_ICON_LOGO.png'; // Your watermark logo

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-gray-800">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl flex flex-col md:flex-row w-full">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
          <img src={Logo} alt="Watermark Logo" className="max-w-sm" />
        </div>

        {/* Back Button */}
        <IconButton
          onClick={() => navigate(-1)}
          className="z-50"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: '#667596',
            '&:hover': {
              color: '#1E40AF',
            },
          }}
        >
          <ArrowBackIos />
        </IconButton>

        {/* Left Section - Illustration */}
        <div className="relative z-10 flex items-center justify-center w-full md:w-1/2 p-8 bg-gray-100">
          <img src={Illustration} alt="Illustration" className="max-w-xs" />
        </div>

        {/* Right Section - Form */}
        <div className="relative z-10 w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}
            >
              Forgot Password?
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
              Enter your email to receive a password reset link.
            </Typography>
          </div>

          {submitted ? (
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mt: 2,
                color: 'gray',
                fontStyle: 'italic',
              }}
            >
              If an account with that email exists, you will receive a password
              reset email shortly.
            </Typography>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#3B82F6',
                    },
                    '&:hover fieldset': {
                      borderColor: '#2563EB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1E40AF',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  backgroundColor: '#2563EB',
                  '&:hover': {
                    backgroundColor: '#1E40AF',
                  },
                }}
              >
                Send Reset Link
              </Button>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
