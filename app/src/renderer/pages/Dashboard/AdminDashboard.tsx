import React from 'react';
import { Container, Grid, Paper, Typography } from '@material-ui/core';

const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper>
            <Typography variant="h6">User Management</Typography>
            <Typography>Manage users and their roles</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper>
            <Typography variant="h6">Reports</Typography>
            <Typography>View system reports and analytics</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper>
            <Typography variant="h6">Settings</Typography>
            <Typography>Configure system settings</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
