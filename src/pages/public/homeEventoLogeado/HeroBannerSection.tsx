import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const HeroBannerSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    "🎭",
    "🎪",
    "🎨",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <section className="w-full bg-white dark:bg-slate-800 py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
            <span className="text-sm font-bold text-[#016630] dark:text-[#00a651] [font-family:'Arimo-Bold',Helvetica]">
              ⭐ Evento Destacado
            </span>
          </div>

          <h1 className="text-5xl font-bold text-slate-900 dark:text-white leading-tight [font-family:'Arimo-Bold',Helvetica]">
            Gala Benéfica Anual: Eres Pieza Clave
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
            Únete a una noche mágica para apoyar los cuidados paliativos.
          </p>

          <button
            onClick={() => navigate("/evento-invitado")}
            className="px-8 py-3 bg-[#00753e] dark:bg-[#00a651] hover:bg-[#006835] dark:hover:bg-[#008a43] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg w-fit [font-family:'Arimo-Regular',Helvetica]"
            type="button"
            aria-label="Comprar Entradas para Gala Benéfica Anual"
          >
            🎫 Comprar Entradas
          </button>
        </div>

        <div className="relative h-96 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl shadow-xl overflow-hidden group">
          {/* Carousel Container */}
          <div className="w-full h-full flex items-center justify-center text-8xl transition-all duration-500">
            {carouselImages[currentImageIndex]}
          </div>

          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 p-2 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-700 p-2 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white dark:bg-slate-200 w-6"
                    : "bg-gray-400 dark:bg-slate-500 hover:bg-gray-300"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

