import React, { useState } from 'react';
import cortePelo1 from './catalogo/mujer/aesthetic_blunt_cut.png';
import cortePelo2 from './catalogo/mujer/aesthetic_con_ondas_naturales.png';
import cortePelo3 from './catalogo/mujer/aesthetic_corto_on_textura.png';
import cortePelo4 from './catalogo/mujer/aesthetic_raya_en-medio_capas_largas.png';
import cortePelo5 from './catalogo/mujer/blunt_bob.png';
import cortePelo6 from './catalogo/mujer/corto_atrevidos_buzz.png';
import cortePelo7 from './catalogo/mujer/flequillo_abierto_desfilado_bob-escalado.png';
import cortePelo8 from './catalogo/mujer/flequillo_cortina_desfilado_long_bob.png';
import cortePelo9 from './catalogo/mujer/flequillo_desfilado_mixie.png';
import "../vista_cliente/styles/catalogocortesmujer.css";

const CatalogoCortesMujer = ({ onImageSelect }) => {
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
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageSelect = (index) => {
    const selectedImage = cortesDePelo[index];
    setSelectedImageIndex(index); // Actualiza el estado con el índice de la imagen seleccionada
    onImageSelect(selectedImage); // Pasa la imagen correspondiente al índice seleccionado
  };

  return (
    <div className="catalogo-cortes">
      {cortesDePelo.map((imagen, index) => (
        <div
          key={index}
          className={`corte-container ${selectedImageIndex === index ? 'selected' : ''}`} // Aplica una clase de CSS si la imagen está seleccionada
          onClick={() => handleImageSelect(index)} // Llama a la función al hacer clic
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

export default CatalogoCortesMujer;
