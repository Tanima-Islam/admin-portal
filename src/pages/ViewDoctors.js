import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialtyMap, setSpecialtyMap] = useState({});

  useEffect(() => {
    const fetchDoctorsAndSpecialties = async () => {
      // Fetch specialties
      const specialtiesSnapshot = await getDocs(collection(db, 'specialties'));
      const specialties = {};
      specialtiesSnapshot.forEach(doc => {
        specialties[doc.id] = doc.data().name;
      });
      setSpecialtyMap(specialties);

      // Fetch doctors
      const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
      const doctorsList = doctorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(doctorsList);
    };

    fetchDoctorsAndSpecialties();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h5" gutterBottom>
        Total Doctors: {doctors.length}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Specialty</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{specialtyMap[doctor.specialty_id] || 'Unknown'}</TableCell>
                <TableCell>{doctor.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViewDoctors;
