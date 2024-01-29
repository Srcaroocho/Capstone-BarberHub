import React from 'react';
import cortePelo1 from './catalogo/hombre/crew_cut.png';
import cortePelo2 from './catalogo/hombre/degradado_bald_fade.png';
import cortePelo3 from './catalogo/hombre/degradado_blowout.png';
import cortePelo4 from './catalogo/hombre/degradado_high_fade.png';
import cortePelo5 from './catalogo/hombre/degradado_low_fade.png';
import cortePelo6 from './catalogo/hombre/degradado_mid_fade.png';
import cortePelo7 from './catalogo/hombre/degradado_militar.png';
import cortePelo8 from './catalogo/hombre/degradado_mullet_fade.png';
import cortePelo9 from './catalogo/hombre/degrado_drop_fade.png';
// Importa otras imágenes si es necesario
import "../vista_cliente/styles/catalogocorteshombres.css";

const CatalogoCortesHombre = ({ onImageSelect }) => {
  const cortesDePelo = [
    cortePelo1,
    cortePelo2,
    cortePelo3,
    cortePelo4,
    cortePelo5,
    cortePelo6,
    cortePelo7,
    cortePelo8,
    cortePelo9,
    // Agrega más imágenes importadas aquí
  ];

  const handleImageSelect = (imagen) => {
    onImageSelect(imagen); // Llama a la función pasada como prop
  };

  return (
    <div className="catalogo-cortes">
      {cortesDePelo.map((imagen, index) => (
        <div
          key={index}
          className="corte-container"
          onClick={() => handleImageSelect(imagen)} // Llama a la función al hacer clic
        >
          <img
            src={imagen}
            alt={`Corte de pelo número ${index + 1}`}
            className="corte-de-pelo"
          />
        </div>
      ))}
    </div>
  );
};

export default CatalogoCortesHombre;
