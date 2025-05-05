import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Typography, Grid, MenuItem, Avatar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';

const EditDoctor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

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
    status: 'active', // default value
  });

  const fetchSpecialties = async () => {
    const snapshot = await getDocs(collection(db, 'specialties'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSpecialties(list);
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      const docRef = doc(db, 'doctors', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          description: data.description || '',
          photo_url: data.photo_url || '',
          specialty_id: data.specialty_id || '',
          latitude: data.latitude?.toString() || '',
          longitude: data.longitude?.toString() || '',
          status: data.status || 'active', // load existing or default
        });
      }
      setLoading(false);
    };

    fetchDoctor();
    fetchSpecialties();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedDoctor = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    await updateDoc(doc(db, 'doctors', id), updatedDoctor);
    navigate('/manage-doctors');
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Box sx={{ maxWidth: 500, width: '100%' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/manage-doctors')}
          sx={{ mb: 2, fontWeight: 'bold', textTransform: 'none' }}
        >
          ← Back
        </Button>

        <Typography variant="h5" mb={3}>Edit Doctor</Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            src={formData.photo_url || ''}
            alt="Doctor"
            sx={{ width: 80, height: 80, bgcolor: '#ccc' }}
          />
        </Box>

        <form onSubmit={handleUpdate}>
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
                  placeholder={`Enter ${field.label}`}
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

            <Grid item xs={12} mt={2}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: 2 }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default EditDoctor;
