import React from 'react';
import PropTypes from 'prop-types';
import './styles/breadcrumb.css'; // Asegúrate de que la ruta es correcta

const Breadcrumb = ({ location }) => {
  return (
    <nav className="breadcrumb">
      <span className="breadcrumb-item">Panel de administración</span>
      <span className="breadcrumb-separator">{'>'}</span>
      <span className="breadcrumb-location">{location}</span>
    </nav>
  );
};

Breadcrumb.propTypes = {
  location: PropTypes.string.isRequired,
};

export default Breadcrumb;
