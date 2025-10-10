import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../js/store/appContext';

const Projects = () => {
  const { t } = useTranslation();
  const { actions } = useContext(Context);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones si el componente se desmonta
    
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
      isMounted = false; // Cleanup al desmontar
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ejecutar solo una vez al montar

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      {/* Mensaje motivador arriba */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black mb-2">{t('projects.title')}</h1>
        <p className="text-lg text-blue-600 font-medium">{t('projects.subtitle')}</p>
      </div>

      {/* Mapeo de proyectos alternados */}
      <div className="flex flex-col gap-20 w-full max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 text-gray-400">{t('projects.no_projects')}</div>
        ) : (
          projects.map((project, idx) => (
            <div
              key={project.id}
              className={`w-full 
                ${idx % 2 === 0 ? 'flex justify-start' : 'flex justify-end'}
                group relative
              `}
            >
              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white rounded-3xl shadow-2xl border border-white/10 w-full max-w-4xl overflow-hidden transition-all duration-700 group-hover:scale-[1.03] group-hover:shadow-blue-500/30 group-hover:shadow-2xl hover:-translate-y-2 group-hover:border-blue-500/50 group-hover:bg-gradient-to-br group-hover:from-slate-700 group-hover:via-slate-800 group-hover:to-slate-900">
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />
                
                <div className="flex flex-col lg:flex-row h-auto lg:h-80 relative z-10">
                  {/* Imagen - Lado izquierdo */}
                  <div className="lg:w-2/5 h-64 lg:h-full relative overflow-hidden">
                    <img
                      src={project.image_url || '/deskdark.jpg'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-150"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Overlay con efecto glassmorphism */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  </div>

                  {/* Contenido - Lado derecho */}
                  <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between relative">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 leading-tight group-hover:from-blue-300 group-hover:via-cyan-300 group-hover:to-blue-400 transition-all duration-500">
                          {project.title}
                        </h2>
                        <span className="text-xs text-blue-300 bg-blue-950/50 backdrop-blur-sm px-3 py-2 rounded-full border border-blue-500/30 shadow-lg group-hover:border-blue-400/60 group-hover:bg-blue-900/60 transition-all duration-300">
                          {new Date(project.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      {/* Línea animada */}
                      <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 mb-4 group-hover:w-20 transition-all duration-700 ease-out shadow-sm shadow-blue-400/50" />

                      <p className="text-base text-gray-300 leading-relaxed mb-6 line-clamp-3 lg:line-clamp-4 group-hover:text-gray-200 transition-colors duration-300">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {(Array.isArray(project.techs) ? project.techs : project.techs?.split(',') || []).map((tech, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-xs font-semibold shadow-md hover:shadow-blue-500/50 hover:from-blue-500 hover:to-cyan-500 hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-blue-400/30"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-400 bg-white/5 hover:bg-blue-500/20 rounded-full backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 hover:rotate-12"
                            title={t('projects.view_repository')}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-cyan-400 bg-white/5 hover:bg-cyan-500/20 rounded-full backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110 hover:-rotate-12"
                            title={t('projects.view_demo')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>

                      <div className="relative group/button">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur-sm opacity-0 group-hover/button:opacity-75 transition-opacity duration-300" />
                        <a
                          href={`/projects/${project.id}`}
                          className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg border border-blue-400/30 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        >
                          <span className="flex items-center gap-2">
                            {t('projects.view_more')} 
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer fijo al final */}
      <div className="fixed bottom-0 left-0 right-0 z-10 text-white py-6 bg-black">
        <div className="flex flex-col md:flex-row items-start justify-start gap-4 px-8">
          <div className="flex gap-4">
            <a href="https://github.com/juanparedes26" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg className="w-6 h-6 text-white hover:text-blue-400 transition drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/juan-manuel-paredes-lopez-b7621224b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg className="w-6 h-6 text-white hover:text-blue-400 transition drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;