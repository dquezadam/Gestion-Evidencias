import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const GenerarCobro = () => {
  const [evidenciasAprobadas, setEvidenciasAprobadas] = useState([]);
  const { user } = useContext(AuthContext);

useEffect(() => {
  const fetchEvidenciasAprobadas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/evidencias/?estado=APROB');
      setEvidenciasAprobadas(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  fetchEvidenciasAprobadas();
}, []);

  const handleGenerarCobro = async (evidenciaId) => {
  try {
    const response = await axios.get(  // <-- Cambiar a GET
      `/api/cobros/generar-cobro/${evidenciaId}/`,
      { responseType: 'blob' }
    );

      // Crear enlace temporal para descargar el PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cobro_${evidenciaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al generar cobro:', error);
      alert('No se pudo generar el cobro');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Generar Cobros</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evidenciasAprobadas.map((evidencia) => (
              <TableRow key={evidencia.id}>
                <TableCell>{evidencia.producto?.nombre || 'N/A'}</TableCell>
                <TableCell>${evidencia.producto?.precio_unitario || 0}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleGenerarCobro(evidencia.id)}
                  >
                    Generar Cobro
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default GenerarCobro;