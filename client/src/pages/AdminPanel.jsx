import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { authAPI } from '../api';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { ListSkeleton } from '../components/SkeletonLoader';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await authAPI.getAllUsers();
      setUsers(res.data.data.users);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await authAPI.updateUserRole(userId, role);
      showSuccess('Role updated successfully.');
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await authAPI.deleteUser(userId);
      showSuccess('User deleted.');
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="Admin Panel" path="/admin" />
        <PageHeader title="Administrator Panel" subtitle="Manage users and system access" />
        <ListSkeleton rows={8} />
      </>
    );
  }

  return (
    <Box>
      <SEO title="Admin Panel" description="Administrator dashboard for user management." path="/admin" />
      <PageHeader title="Administrator Panel" subtitle="Manage users and system access" />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Chip label={new Date(user.createdAt).toLocaleDateString()} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(user._id)} color="error" aria-label="Delete user">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary" mt={2}>
        Total users: {users.length}
      </Typography>

    </Box>
  );
};

export default AdminPanel;
