import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Alert, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { userApi } from '../services/api';

export default function StaffManagementPage() {
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firmName, setFirmName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);

  const handleCreateStaff = async () => {
    try {
      setSuccessMessage(null);
      setErrorMessage(null);
      const response = await userApi.createUser({ userType, name, password, email, firmName });
      if (response.status === 200) {
        setSuccessMessage('Staff created successfully!');
        setUserType('');
        setName('');
        setPassword('');
        setEmail('');
        setFirmName('');
        fetchStaffUsers();
      } else {
        setErrorMessage(response.data?.message || 'Failed to create staff.');
      }
    } catch (error: any) {
      console.error('Error creating staff:', error);
      setErrorMessage(error.message || 'An error occurred while creating staff.');
    }
  };

  const fetchStaffUsers = async () => {
    try {
      setLoadingStaff(true);
      const response = await userApi.getUsersList();
      const nonClients = response.data.filter((user: any) => user.userType !== 'client');
      setStaffUsers(nonClients);
      setStaffError(null);
    } catch (err: any) {
      console.error('Error fetching staff users:', err);
      setStaffError(err.message || 'Failed to load staff users.');
      setStaffUsers([]);
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  return (
    <Box sx={{ bgcolor: '#f3f2ee', minHeight: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
      <Container maxWidth="md" sx={{ mx: 'auto', bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 3, mb: 3, border: '1px solid #e0e6ef' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Create New Staff
        </Typography>
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        <Grid container spacing={2} component="div">
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="user-type-label">User Type</InputLabel>
              <Select
                labelId="user-type-label"
                value={userType}
                label="User Type"
                onChange={(e) => setUserType(e.target.value)}
              >
                <MenuItem value="marketing_manager">Marketing Manager</MenuItem>
                <MenuItem value="lawyer">Lawyer</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{
                autoComplete: 'new-password',
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Firm Name"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateStaff}
              fullWidth
              sx={{ mt: 2 }}
            >
              Create Staff
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="md" sx={{ mx: 'auto', bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 4, border: '1px solid #e0e6ef' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Existing Staff
        </Typography>
        {loadingStaff ? (
          <Typography>Loading staff users...</Typography>
        ) : staffError ? (
          <Typography color="error">{staffError}</Typography>
        ) : staffUsers.length === 0 ? (
          <Typography>No staff users found.</Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 0, border: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f6f8fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>User Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Firm Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.userType}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firmName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
} 