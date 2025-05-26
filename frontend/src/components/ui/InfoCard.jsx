import React from "react";

const InfoCard = ({ image, title, description, patientImage, rating }) => {
  return (
    <div className="info-card">
      {image && <img src={image} alt={title} />}
      {patientImage && <img src={patientImage} alt="Imagen de paciente" />} {/* Usar patientImage */}
      <h2>{title}</h2>
      <p>{description}</p>
      {rating && (
        <div>
          {Array.from({ length: rating }).map((_, index) => (
            <span key={index}>★</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoCard;