import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { TextField, Button, Container, Typography, Input } from '@mui/material';
import axios from 'axios';

const SubirEvidencia = () => {
  const [archivo, setArchivo] = useState(null);
  const [productoId, setProductoId] = useState('');
  const { user } = useContext(AuthContext);
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('producto', productoId);

    try {
      await axios.post('/api/evidencias/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      history.push('/evidencias'); // Redirigir al listado
    } catch (err) {
      alert('Error al subir evidencia');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>Subir Evidencia</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ID del Producto"
          fullWidth
          margin="normal"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
        />
        <Input
          type="file"
          onChange={(e) => setArchivo(e.target.files[0])}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Subir
        </Button>
      </form>
    </Container>
  );
};

export default SubirEvidencia;