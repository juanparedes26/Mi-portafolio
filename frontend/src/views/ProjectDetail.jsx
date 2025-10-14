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
      {/* Header con navegación */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Proyectos
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        {/* Header del proyecto */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
            {project.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 mb-6">
            <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
              {new Date(project.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          {/* Enlaces de acción */}
          <div className="flex gap-3 mb-8">
            {project.repo_url && project.repo_url.trim() && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Repositorio
              </a>
            )}
            {project.live_url && project.live_url.trim() && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver Demo
              </a>
            )}
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna izquierda - Galería de imágenes */}
          <div className="lg:col-span-2">
            {project.images && project.images.length > 0 ? (
              <div className="space-y-6">
                {/* Imagen principal */}
                <div className="relative">
                  <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
                    <img
                      src={project.images[selectedImageIndex]}
                      alt={`${project.title} - Imagen ${selectedImageIndex + 1}`}
                      className="w-full h-96 md:h-[500px] object-cover"
                    />
                  </div>

                  {/* Contador de imágenes */}
                  {project.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {selectedImageIndex + 1} / {project.images.length}
                    </div>
                  )}
                </div>

                {/* Miniaturas */}
                {project.images.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {project.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageClick(index)}
                        className={`relative rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                          selectedImageIndex === index
                            ? 'ring-2 ring-blue-500'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${project.title} - Miniatura ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-blue-500/20"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-2xl h-96 md:h-[500px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p>No hay imágenes disponibles</p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Información del proyecto */}
          <div className="lg:col-span-1 space-y-8">
            {/* Descripción */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Descripción</h3>
              <p className="text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tecnologías */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Tecnologías</h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(project.techs) ? project.techs : project.techs?.split(',') || []).map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Información</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Fecha de creación:</span>
                  <p className="text-white">
                    {new Date(project.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {project.images && project.images.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Total de imágenes:</span>
                    <p className="text-white">{project.images.length}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;