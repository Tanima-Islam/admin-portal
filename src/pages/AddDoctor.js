import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Typography, Grid, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    photo_url: '',
    specialty_id: '',
    latitude: '',
    longitude: '',
    status: 'active', // default
  });

  const fetchSpecialties = async () => {
    const snapshot = await getDocs(collection(db, 'specialties'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSpecialties(list);
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDoctor = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };
    await addDoc(collection(db, 'doctors'), newDoctor);
    navigate('/manage-doctors');
  };

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Box sx={{ maxWidth: 500, width: '100%' }}>
        <Button variant="outlined" onClick={() => navigate('/manage-doctors')} sx={{ mb: 2 }}>
          ← Back
        </Button>

        <Typography variant="h5" mb={3}>Add New Doctor</Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              { label: 'Name', name: 'name' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Phone', name: 'phone' },
              { label: 'Location', name: 'address' },
              { label: 'Photo URL', name: 'photo_url' },
              { label: 'Description', name: 'description', multiline: true, rows: 2 },
              { label: 'Latitude', name: 'latitude', type: 'number' },
              { label: 'Longitude', name: 'longitude', type: 'number' },
            ].map((field) => (
              <Grid item xs={field.name === 'latitude' || field.name === 'longitude' ? 6 : 12} key={field.name}>
                <Typography variant="body2" fontWeight={600}>{field.label}:</Typography>
                <TextField
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type={field.type || 'text'}
                  multiline={field.multiline || false}
                  rows={field.rows || 1}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={600}>Specialty:</Typography>
              <TextField
                select
                name="specialty_id"
                value={formData.specialty_id}
                onChange={handleChange}
                fullWidth
                size="small"
              >
                {specialties.map((spec) => (
                  <MenuItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={600}>Status:</Typography>
              <TextField
                select
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                size="small"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Save Doctor
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddDoctor;
