import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../js/store/appContext';

const Projects = () => {
  const { t } = useTranslation();
  const { actions } = useContext(Context);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProjects = async () => {
      setLoading(true);
      const result = await actions.getProjects();
      
      if (isMounted && result.ok) {
        const sorted = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProjects(sorted);
      }
      
      if (isMounted) {
        setLoading(false);
      }
    };
    
    fetchProjects();
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Contenido principal */}
      <div className="flex-grow pt-24 pb-8">
        {/* Header con título */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">
            {t('projects.title')}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Container principal */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-6xl mb-6">📁</div>
              <p className="text-xl text-gray-400">{t('projects.no_projects')}</p>
            </div>
          ) : (
            /* Grid de proyectos */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, idx) => (
                <div 
                  key={project.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-600/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Imagen del proyecto */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url || '/deskdark.jpg'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    
                    {/* Badge de fecha */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {new Date(project.created_at).getFullYear()}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    {/* Título */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Descripción */}
                    <p className="text-gray-600 leading-relaxed mb-4 text-sm line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tecnologías */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(Array.isArray(project.techs) ? project.techs : project.techs?.split(',') || []).map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Enlaces y botón */}
                    <div className="flex items-center justify-between">
                      {/* Enlaces a repo y demo */}
                      <div className="flex gap-2">
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title={t('projects.view_repository')}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title={t('projects.view_demo')}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>

                      {/* Botón Ver más */}
                      <a
                        href={`/projects/${project.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        {t('projects.view_more')}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-6 mt-auto">
        <div className="flex flex-col md:flex-row items-start justify-start gap-4 px-8">
          <div className="flex gap-4">
            <a href="https://github.com/juanparedes26" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg className="w-6 h-6 text-white hover:text-blue-400 transition drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/juan-manuel-paredes-lopez-b7621224b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg className="w-6 h-6 text-white hover:text-blue-400 transition drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Projects