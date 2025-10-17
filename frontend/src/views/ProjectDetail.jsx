import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../js/store/appContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useContext(Context);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

useEffect(() => {
  const fetchProject = async () => {
    setLoading(true);
    const result = await actions.getProjectById(parseInt(id));
    console.log(result);
    console.log("ID recibido:", id);

    if (result.ok && result.data) {
      setProject(result.data);

      const images = Array.isArray(result.data.images) ? result.data.images : [];
      let index = 0;
      if (
        typeof result.data.main_image_index === 'number' &&
        images.length > 0 &&
        result.data.main_image_index >= 0 &&
        result.data.main_image_index < images.length
      ) {
        index = result.data.main_image_index;
      }
      setSelectedImageIndex(index);
    } else {
      navigate('/projects');
    }

    setLoading(false);
  };

  if (id) {
    fetchProject();
  }
}, [id, actions, navigate]);

  // Navegación de imágenes
  const nextImage = () => {
    if (!project?.images || isTransitioning) return;
    setIsTransitioning(true);
    setSelectedImageIndex(prevIndex => 
      prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevImage = () => {
    if (!project?.images || isTransitioning) return;
    setIsTransitioning(true);
    setSelectedImageIndex(prevIndex => 
      prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleImageClick = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Manejo táctil
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || !project?.images || project.images.length <= 1) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) { // Umbral mínimo para swipe
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    setTouchStartX(null);
  };

  // Navegación con teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!project?.images || project.images.length <= 1) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImageIndex(prevIndex => 
          prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
        );
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImageIndex(prevIndex => 
          prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [project?.images]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <p className="text-xl text-gray-400 mb-4">Proyecto no encontrado</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver a Proyectos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Contenido principal */}
      <div className="pt-24 pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header del proyecto simple */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              {project.title}
            </h1>
          </div>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Columna izquierda - Galería moderna con navegación */}
            <div className="lg:col-span-2">
              {project.images && project.images.length > 0 ? (
                <div className="space-y-6">
                  {/* Imagen principal con navegación */}
                  <div className="relative group">
                    <div 
                      className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl"
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      <img
                        src={project.images[selectedImageIndex]}
                        alt={`${project.title} - Imagen ${selectedImageIndex + 1}`}
                        className={`w-full h-96 md:h-[600px] object-cover transition-all duration-300 ${
                          isTransitioning ? 'scale-105' : 'scale-100'
                        }`}
                        loading="lazy"
                      />
                      
                      {/* Gradiente overlay para mejor legibilidad */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      
                      {/* Botones de navegación */}
                      {project.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                            aria-label="Imagen anterior"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                            aria-label="Siguiente imagen"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Contador modernizado */}
                      {project.images.length > 1 && (
                        <div className="absolute bottom-6 left-6">
                          <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{selectedImageIndex + 1} / {project.images.length}</span>
                          </div>
                        </div>
                      )}

                      {/* Indicador de swipe en móvil */}
                      {project.images.length > 1 && (
                        <div className="absolute bottom-6 right-6 md:hidden">
                          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md flex items-center gap-1">
                            <span>Desliza</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Indicadores de puntos */}
                    {project.images.length > 1 && (
                      <div className="flex justify-center mt-4 gap-2">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              selectedImageIndex === index
                                ? 'bg-blue-500 w-8'
                                : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                            aria-label={`Ir a imagen ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Miniaturas horizontales mejoradas */}
                  {project.images.length > 1 && (
                    <div className="overflow-x-auto pb-2">
                      <div className="flex gap-3 w-max">
                        {project.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => handleImageClick(index)}
                            className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                              selectedImageIndex === index
                                ? 'ring-3 ring-blue-500 ring-offset-2 ring-offset-black scale-105'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${project.title} - Miniatura ${index + 1}`}
                              className="w-24 h-16 object-cover"
                              loading="lazy"
                            />
                            {selectedImageIndex === index && (
                              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl h-96 md:h-[600px] flex items-center justify-center shadow-2xl">
                  <div className="text-center text-gray-500">
                    <div className="text-8xl mb-6 opacity-50">🖼️</div>
                    <p className="text-xl font-medium">No hay imágenes disponibles</p>
                    <p className="text-gray-400 mt-2">Este proyecto aún no tiene galería de imágenes</p>
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha - Información compacta */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tecnologías con efectos mejorados */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Tecnologías</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(Array.isArray(project.techs) ? project.techs : project.techs?.split(',') || []).map((tech, i) => (
                    <span 
                      key={i} 
                      className="group px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-600 hover:to-blue-700 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default border border-gray-600 hover:border-blue-500"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Información del proyecto */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Detalles del Proyecto</h3>
                </div>
                <div className="space-y-4">
                  {project.images && project.images.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="text-gray-400 text-sm block">Galería de imágenes</span>
                        <p className="text-white font-medium">{project.images.length} imagen{project.images.length !== 1 ? 'es' : ''}</p>
                      </div>
                    </div>
                  )}

                  {/* Instrucciones de navegación */}
                  {project.images && project.images.length > 1 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="text-blue-400 text-sm block font-medium">Navegación</span>
                        <p className="text-blue-300 text-xs">Usa las flechas del teclado ← → o desliza en móvil</p>
                      </div>
                    </div>
                  )}

                  {/* Enlaces del proyecto */}
                  {(project.repo_url && project.repo_url.trim()) || (project.live_url && project.live_url.trim()) ? (
                    <div className="space-y-2">
                      {project.repo_url && project.repo_url.trim() && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span className="text-gray-300 hover:text-white transition-colors">Repositorio</span>
                        </a>
                      )}
                      {project.live_url && project.live_url.trim() && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                        >
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="text-blue-300 hover:text-blue-200 transition-colors">Ver Demo</span>
                        </a>
                      )}
                    </div>
                  ) : null}

                  {/* Estado del proyecto */}
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <span className="text-emerald-400 text-sm block font-medium">Estado</span>
                      <p className="text-emerald-300 text-xs">Proyecto completado y funcional</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-6 shadow-xl border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Conecta Conmigo</h3>
                </div>
                <div className="space-y-3">
                  <a
                    href="https://github.com/juanparedes26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium block">GitHub Personal</span>
                      <span className="text-gray-400 text-sm">Explora más proyectos</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  <a
                    href="https://linkedin.com/in/juan-manuel-paredes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 bg-blue-600/10 hover:bg-blue-600/20 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium block">LinkedIn</span>
                      <span className="text-gray-400 text-sm">Red profesional</span>
                    </div>
                    <svg className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción como card debajo de las fotos */}
          <div className="mt-12">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Descripción del Proyecto</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-base">
                {project.description}
              </p>
            </div>
            
        
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate('/projects')}
                className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Volver a Proyectos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;