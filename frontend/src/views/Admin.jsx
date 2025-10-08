import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../js/store/appContext';

 function Admin() {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  
  useEffect(() => {
    if (!store.adminToken) {
      navigate('/');
    }
  }, [store.adminToken, navigate]);

  // Cargar proyectos al montar
  useEffect(() => {
    if (store.adminToken) {
      loadProjects();
    }
  }, [store.adminToken]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await actions.getProjects();
      if (!result.ok) {
        console.error('Error loading projects:', result.error);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      const result = await actions.deleteProject(projectId);
      if (result.ok) {
        // Proyecto eliminado del store automáticamente
      } else {
        alert('Error: ' + result.error);
      }
    }
  };

  if (!store.adminToken) {
    return null; 
  }

  return (
    <div className="fixed inset-0 bg-gray-900 text-white overflow-hidden">
      {/* Background image like Home */}
      <div className="absolute inset-0">
        <img
          src="/deskdark.jpg"
          alt="Dark workspace background"
          className="w-full h-full object-cover object-center"
          draggable="false"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      <main className="absolute inset-0 pt-20 overflow-y-auto">
        <div className="relative z-10 container mx-auto px-8 py-8">
        
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-white">
                BIENVENIDO JUAN
              </h1>
              <p className="text-gray-300 font-light">Gestiona tus proyectos</p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 ease-in-out transform"
            >
              + Nuevo Proyecto
            </button>
          </div>

        {/* Loading */}
        {loading && <div className="text-center py-8">Cargando proyectos...</div>}

          {/* Lista de proyectos */}
          <div className="grid gap-6">
            {store.projects && store.projects.length > 0 && store.projects.map((project) => (
              <div key={project.id} className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2 mb-3">
                    {project.techs && (
                      Array.isArray(project.techs) 
                        ? project.techs.map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">
                              {tech}
                            </span>
                          ))
                        : typeof project.techs === 'string' && project.techs.split(',').map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">
                              {tech.trim()}
                            </span>
                          ))
                    )}
                  </div>
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-20 h-20 object-cover rounded" />
                  )}
                </div>
                
                <div className="flex gap-3 ml-4 flex-col sm:flex-row">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-transparent border border-blue-400 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-400 hover:text-white transition-all duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-4 py-2 bg-transparent border border-red-400 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-400 hover:text-white transition-all duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>

          {/* Estado vacío */}
          {!loading && (!store.projects || store.projects.length === 0) && (
            <div className="text-center py-16">
              <p className="text-gray-300 mb-6 text-lg font-light">No hay proyectos aún</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-transparent border-2 border-blue-400 text-blue-400 rounded-lg font-semibold hover:bg-blue-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out transform"
              >
                Crear el primero
              </button>
            </div>
          )}

          {/* Formulario modal (placeholder por ahora) */}
          {showForm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">
                  {editingProject ? 'EDITAR PROYECTO' : 'NUEVO PROYECTO'}
                </h2>
                <p className="text-gray-300 mb-6 font-light">Formulario en construcción...</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingProject(null);
                    }}
                    className="px-6 py-2 bg-transparent border border-gray-400 text-gray-400 rounded-lg font-semibold hover:bg-gray-400 hover:text-white transition-all duration-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
export default Admin;
