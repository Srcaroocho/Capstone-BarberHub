import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './RutaProtegida'; // Asegúrate de usar la ruta correcta
import Login from './pages/Login'; 
import DashboardPage from './pages/VistaAdministrador';
import ClientPage from './pages/VistaCliente';
import EmployeePage from './pages/VistaEmpleado';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute 
              component={DashboardPage} 
              allowedRoles={[3]} // Solo el rol de administrador
            />
          } 
        />

        <Route 
          path="/cliente" 
          element={
            <ProtectedRoute 
              component={ClientPage} 
              allowedRoles={[1]} // Solo el rol de cliente
            />
          } 
        />

        <Route 
          path="/empleado" 
          element={
            <ProtectedRoute 
              component={EmployeePage} 
              allowedRoles={[2]} // Solo el rol de empleado
            />
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;