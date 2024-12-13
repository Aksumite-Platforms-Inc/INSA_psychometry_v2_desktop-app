import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { toast } from 'react-toastify';

interface ResetResponse {
  success: boolean;
  message?: string;
}

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const handleResetSuccess = (_event: any, ...args: unknown[]) => {
        const response = args[0] as ResetResponse;
        if (response.success) {
          setSubmitted(true);
        } else {
          setError(response.message || 'reset password failed');
        }
      };

      window.electron.ipcRenderer.on(
        'reset-password-success',
        handleResetSuccess,
      );

      return () => {
        window.electron.ipcRenderer.removeListener(
          'reset-password-success',
          handleResetSuccess,
        );
      };
    }
    return undefined;
  }, [navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('reset-password', email);
    } else {
      setError('Electron IPC is not available');
      toast.error('Electron IPC is not available.');
    }
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
          <>
            <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
              If an account with that email exists, you will receive a password
              reset email shortly.
            </Typography>
            <div className="mb-2.5">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/login');
                  }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Back to login
                </button>
              </div>
          </>
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default ForgotPassword;
