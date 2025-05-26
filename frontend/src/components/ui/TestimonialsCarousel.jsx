import React from "react";
import InfoCard from "./InfoCard";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import paciente from "../../assets/img/descargar.jpg";
import "./TestimonialsCarousel.css"; // Importa el archivo CSS para estilos personalizados

function TestimonialsCarousel() {
  const testimonials = [
    {
      description:
        "MHIA me ha ayudado mucho a comprender mejor a mis pacientes. ¡Es una herramienta increíble!",
      patientImage: paciente,
      rating: 5,
    },
    {
      description:
        "Gracias a MHIA, puedo dedicar más tiempo a mis pacientes y menos tiempo a la documentación.",
      patientImage: paciente,
      rating: 4,
    },
    {
      description:
        "MHIA ha mejorado significativamente la calidad de mis sesiones. ¡Lo recomiendo ampliamente!",
      patientImage: paciente,
      rating: 5,
    },
  ];

  return (
    <div className="testimonials-carousel-container">
      <Carousel
        showArrows={true} // Asegura que las flechas se muestren
        showThumbs={false}
        infiniteLoop={true}
        centerMode={true}
        centerSlidePercentage={80}
        showStatus={false} // Oculta el contador "1 of 3"
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="carousel-arrow carousel-arrow-left"
            >
              <span aria-hidden="true">‹</span> {/* Flecha izquierda */}
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="carousel-arrow carousel-arrow-right"
            >
              <span aria-hidden="true">›</span> {/* Flecha derecha */}
            </button>
          )
        }
      >
        {testimonials.map((testimonial, index) => (
          <div key={index}>
            <InfoCard {...testimonial} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default TestimonialsCarousel;