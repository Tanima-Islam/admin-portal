import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = ['#1976d2', '#f44336']; // Active and Suspended colors

const Reports = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const doctorSnapshot = await getDocs(collection(db, 'doctors'));
      const doctorList = doctorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(doctorList);

      const specialtySnapshot = await getDocs(collection(db, 'specialties'));
      const specialtyList = specialtySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpecialties(specialtyList);
    };

    fetchData();
  }, []);

  const generatePDF = () => {
    const input = reportRef.current;
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Doctor_Report.pdf');
    });
  };

  const total = doctors.length;
  const active = doctors.filter(d => d.status === 'active').length;
  const suspended = doctors.filter(d => d.status === 'suspended').length;

  const doctorsBySpecialty = specialties.map(spec => ({
    name: spec.name,
    count: doctors.filter(d => d.specialty_id === spec.id).length,
  }));

  const pieData = [
    { name: 'Active', value: active },
    { name: 'Suspended', value: suspended }
  ];

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Reports</Typography>
        <Button variant="contained" onClick={generatePDF}>
          Export to PDF
        </Button>
      </Box>

      <Box ref={reportRef} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* SECTION 1: Summary Cards */}
        <Box>
          <Typography variant="h6" gutterBottom>Summary</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle2">Total Doctors</Typography>
                <Typography variant="h4" fontWeight="bold">{total}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle2">Active</Typography>
                <Chip label="Active" color="success" />
                <Typography variant="h5" mt={1}>{active}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle2">Suspended</Typography>
                <Chip label="Suspended" color="default" />
                <Typography variant="h5" mt={1}>{suspended}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* SECTION 2: Doctors by Specialty */}
        <Box>
          <Typography variant="h6" gutterBottom>Doctors by Specialty</Typography>
          <Paper sx={{ p: 3 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={doctorsBySpecialty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* SECTION 3: Status Breakdown */}
        <Box>
          <Typography variant="h6" gutterBottom>Status Breakdown</Typography>
          <Paper sx={{ p: 3 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
