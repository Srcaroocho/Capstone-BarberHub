import React, { useState } from 'react';
import '../styles/vista_administrador.css';
import Sidebar from '../components/vista_administrador/Sidebar';
import Breadcrumb from '../components/vista_administrador/Breadcrumb';
import EmployeeTable from '../components/vista_administrador/EmployeeTable';
import ClientTable from '../components/vista_administrador/ClientTable';
import EmployeeSchedule from '../components/vista_administrador/Turnos';
import ServiceAssignment from '../components/vista_administrador/Servicios';
import GeneralDashboard from '../components/vista_administrador/GeneralDashboard';
import AppointmentTable from '../components/vista_administrador/AppointmentTable';

// Importa aquí los otros componentes como AppointmentTable si es necesario

const DashboardPage = () => {
    const [componenteActivo, setComponenteActivo] = useState('GeneralDashboard');

    // Corregido: Mapeo de componentes a nombres para el breadcrumb
    const breadcrumbNames = {
        'EmployeeTable': 'Lista de empleados',
        'GeneralDashboard': 'General',
        'ClientTable': 'Lista de clientes',
        'EmployeeSchedule': 'Turnos',
        'ServiceAssignment': 'Servicios',
        'AppointmentTable': 'Lista de citas',

        // 'AppointmentTable': 'Citas', // Descomenta y añade más según sea necesario
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-container">
                <Sidebar onCambioComponente={setComponenteActivo} />
                <div className="main-content">
                    <Breadcrumb location={breadcrumbNames[componenteActivo] || 'Desconocido'} />
                    {componenteActivo === 'GeneralDashboard' && <GeneralDashboard />}
                    {componenteActivo === 'EmployeeTable' && <EmployeeTable />}
                    {componenteActivo === 'ClientTable' && <ClientTable />}
                    {componenteActivo === 'EmployeeSchedule' && <EmployeeSchedule />}
                    {componenteActivo === 'ServiceAssignment' && <ServiceAssignment />}
                    {componenteActivo === 'AppointmentTable' && <AppointmentTable />}
                    {/* {componenteActivo === 'AppointmentTable' && <AppointmentTable />} */}
                    {/* Añade aquí más condiciones para otros componentes si los tienes */}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
