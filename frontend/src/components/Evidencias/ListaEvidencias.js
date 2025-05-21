import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Box
} from '@mui/material';

const ListaEvidencias = () => {
  const [evidencias, setEvidencias] = useState([]); // <-- Estado para TODAS las evidencias
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Función para actualizar el estado de una evidencia
  const manejarAprobacion = async (evidenciaId, nuevoEstado) => {
    try {
      await axios.patch(`http://localhost:8000/api/evidencias/${evidenciaId}/`, {
        estado: nuevoEstado
      });
      
      // Actualizar el estado LOCAL para reflejar el cambio sin recargar la página
      const nuevasEvidencias = evidencias.map(ev => 
        ev.id === evidenciaId ? { ...ev, estado: nuevoEstado } : ev
      );
      setEvidencias(nuevasEvidencias);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  // Obtener evidencias al cargar el componente
  useEffect(() => {
    const fetchEvidencias = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/evidencias/');
        setEvidencias(response.data);
      } catch (error) {
        console.error('Error al obtener evidencias:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvidencias();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Estado</TableCell>
            {user.tipoUsuario === 'LOG_CL' && <TableCell>Acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {evidencias.map((evidencia) => (
            <TableRow key={evidencia.id}>
              <TableCell>
                {evidencia.producto?.nombre || 'Nombre no disponible'}
              </TableCell>
              <TableCell>{evidencia.estado}</TableCell>
              {user.tipoUsuario === 'LOG_CL' && (
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => manejarAprobacion(evidencia.id, 'APROB')}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => manejarAprobacion(evidencia.id, 'RECHAZ')}
                    >
                      Rechazar
                    </Button>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListaEvidencias;