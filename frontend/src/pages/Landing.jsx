import React from "react";
import InfoCard from "../components/ui/InfoCard";
import TestimonialsCarousel from "../components/ui/TestimonialsCarousel"; // Importar el componente del carrusel
import "../assets/css/Landing.css";
import heroImage from "../assets/img/Brain.png"; // Importar la imagen del cerebro
import Fruit from "../assets/img/Fruits.png" 
import Wine from "../assets/img/Wine.png" 
import Peach from "../assets/img/Peach.png" 

function Landing() {
  return (
    <>
      <div className="hero">
        <h1>MHIA</h1>
        <p>Tu asistente en procesos psicológicos</p>
        <div className="hero-image">
          <img src={heroImage} alt="Cerebro con circuitos" />
        </div>
      </div>
      <section className="info-cards-container">
        
        <InfoCard
          image={Fruit} // Reemplaza con la ruta correcta de la imagen
          title="¿Quiénes somos?"
          description="Un equipo de expertos en psicología y tecnología, creando soluciones innovadoras para la salud mental."
        />
        <InfoCard
          image={Wine} // Reemplaza con la ruta correcta de la imagen
          title="¿Qué hacemos?"
          description="Desarrollamos un asistente virtual inteligente con IA para optimizar procesos psicológicos para profesionales y pacientes."
        />
        <InfoCard
          image={Peach} // Reemplaza con la ruta correcta de la imagen
          title="¿Cómo lo hacemos?"
          description="Usamos inteligencia artificial avanzada y colaboración con psicólogos para una herramienta eficaz y segura."
        />
      </section>

      <section className="carousel-container">
        <TestimonialsCarousel />
      </section>
    </>
  );
}

export default Landing;