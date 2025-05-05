import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Specialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctorCounts, setDoctorCounts] = useState({});
  const [newSpecialty, setNewSpecialty] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const fetchSpecialties = async () => {
    const snapshot = await getDocs(collection(db, 'specialties'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSpecialties(list);
  };

  const fetchDoctorCounts = async () => {
    const counts = {};
    const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
    doctorsSnapshot.forEach(doc => {
      const specId = doc.data().specialty_id;
      if (specId) {
        counts[specId] = (counts[specId] || 0) + 1;
      }
    });
    setDoctorCounts(counts);
  };

  const fetchDoctorsBySpecialty = async (specId) => {
    const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
    const list = doctorsSnapshot.docs
      .map(doc => doc.data())
      .filter(doc => doc.specialty_id === specId);
    setFilteredDoctors(list);
  };

  useEffect(() => {
    fetchSpecialties();
    fetchDoctorCounts();
  }, []);

  const handleAdd = async () => {
    if (!newSpecialty.trim()) return;
    await addDoc(collection(db, 'specialties'), { name: newSpecialty.trim() });
    setNewSpecialty('');
    fetchSpecialties();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'specialties', id));
    fetchSpecialties();
  };

  const handleChipClick = async (spec) => {
    setSelectedSpecialty(spec);
    await fetchDoctorsBySpecialty(spec.id);
  };

  const handleAllClick = () => {
    setSelectedSpecialty(null);
    setFilteredDoctors([]);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Specialties Management ({specialties.length} Total)
      </Typography>

      <Box display="flex" gap={2} mb={4}>
        <TextField
          label="New Specialty"
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAdd}>Add</Button>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item>
          <Chip
            label="All"
            color={!selectedSpecialty ? "primary" : "default"}
            variant="outlined"
            clickable
            onClick={handleAllClick}
          />
        </Grid>
        {specialties.map((spec) => (
          <Grid item key={spec.id}>
            <Chip
              label={`${spec.name} (${doctorCounts[spec.id] || 0})`}
              color={selectedSpecialty?.id === spec.id ? "primary" : "default"}
              variant="outlined"
              clickable
              onClick={() => handleChipClick(spec)}
            />
          </Grid>
        ))}
      </Grid>

      {selectedSpecialty && (
        <Box mt={4}>
          <Typography variant="h6">
            {selectedSpecialty.name} Doctors ({filteredDoctors.length})
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Table component={Paper}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDoctors.map((doc, i) => (
                <TableRow key={i}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.address}</TableCell>
                  <TableCell>{doc.email}</TableCell>
                  <TableCell>{doc.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {!selectedSpecialty && (
        <Paper sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Specialty</TableCell>
                <TableCell>Doctors</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specialties.map((spec, index) => (
                <TableRow key={spec.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{spec.name}</TableCell>
                  <TableCell>{doctorCounts[spec.id] || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleDelete(spec.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default Specialties;


