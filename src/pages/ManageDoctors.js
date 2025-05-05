import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableBody, TableRow,
  TableCell, Paper, IconButton, Chip, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    const doctorSnapshot = await getDocs(collection(db, 'doctors'));
    const doctorList = doctorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setDoctors(doctorList);
    setFilteredDoctors(doctorList); // Set default filtered list
  };

  const fetchSpecialties = async () => {
    const specSnapshot = await getDocs(collection(db, 'specialties'));
    const specList = specSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSpecialties(specList);
  };

  const getSpecialtyName = (id) => {
    const match = specialties.find(s => s.id === id);
    return match ? match.name : 'Unknown';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      await deleteDoc(doc(db, 'doctors', id));
      fetchDoctors();
    }
  };

  const handleToggleStatus = async (doctor) => {
    const newStatus = doctor.status === 'active' ? 'suspended' : 'active';
    await updateDoc(doc(db, 'doctors', doctor.id), { status: newStatus });
    fetchDoctors();
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = doctors.filter(doc =>
      doc.name.toLowerCase().includes(value)
    );
    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Manage Doctors</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-doctor')}
        >
          Add New Doctor
        </Button>
      </Box>

      <TextField
        label="Search by name"
        variant="outlined"
        fullWidth
        size="small"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{getSpecialtyName(doc.specialty_id)}</TableCell>
                <TableCell>{doc.address}</TableCell>
                <TableCell>{doc.email}</TableCell>
                <TableCell>{doc.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={doc.status === 'active' ? 'Active' : 'Suspended'}
                    color={doc.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => navigate(`/edit-doctor/${doc.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="warning" onClick={() => handleToggleStatus(doc)}>
                    {doc.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(doc.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ManageDoctors;
