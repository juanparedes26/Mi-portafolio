import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SiReact, 
  SiJavascript, 
  SiHtml5, 
  SiCss3, 
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiMysql,
  SiGit,
  SiDocker,
  SiGithub,
  SiPostgresql,
  SiFlask,
  SiBootstrap,
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { FaRobot, FaCogs } from 'react-icons/fa';

function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden pt-24 md:pt-20">
    
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60" />
      </div>

      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full px-8 md:px-16 lg:px-24">
          <div className="mx-auto max-w-[1400px] min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col justify-center py-8 lg:py-0 pr-0 lg:pr-16">
              <div className="max-w-lg">
               
              
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none mb-6">
                  {t('about.title')}
                </h1>

              
                <div className="w-16 h-0.5 bg-blue-600 mb-6" />

                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 font-light">
                  {t('about.description')}
                </p>

                {/* Stack Tecnológico */}
                <div className="mb-8">
                  <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wide">
                    {t('about.tech_stack') || 'Stack Tecnológico'}
                  </h3>
                  
                  {/* Frontend */}
                  <div className="mb-6">
                    <h4 className="text-blue-400 text-sm font-medium mb-3 uppercase tracking-wider">
                      {t('about.frontend') || 'Frontend'}
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiReact className="text-blue-400 text-xl" />
                        <span className="text-gray-300 text-sm">React</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiJavascript className="text-yellow-400 text-xl" />
                        <span className="text-gray-300 text-sm">JavaScript</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiHtml5 className="text-orange-500 text-xl" />
                        <span className="text-gray-300 text-sm">HTML5</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiCss3 className="text-blue-500 text-xl" />
                        <span className="text-gray-300 text-sm">CSS3</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiTailwindcss className="text-cyan-400 text-xl" />
                        <span className="text-gray-300 text-sm">Tailwind</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiBootstrap className="text-purple-500 text-xl" />
                        <span className="text-gray-300 text-sm">Bootstrap</span>
                      </div>
                    </div>
                  </div>

                  {/* Backend */}
                  <div className="mb-6">
                    <h4 className="text-green-400 text-sm font-medium mb-3 uppercase tracking-wider">
                      {t('about.backend') || 'Backend'}
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiNodedotjs className="text-green-500 text-xl" />
                        <span className="text-gray-300 text-sm">Node.js</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiPython className="text-yellow-500 text-xl" />
                        <span className="text-gray-300 text-sm">Python</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiFlask className="text-gray-300 text-xl" />
                        <span className="text-gray-300 text-sm">Flask</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiMysql className="text-blue-600 text-xl" />
                        <span className="text-gray-300 text-sm">MySQL</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiPostgresql className="text-blue-500 text-xl" />
                        <span className="text-gray-300 text-sm">PostgreSQL</span>
                      </div>
                    </div>
                  </div>

                  {/* Herramientas */}
                  <div className="mb-6">
                    <h4 className="text-purple-400 text-sm font-medium mb-3 uppercase tracking-wider">
                      {t('about.tools') || 'Herramientas'}
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiGit className="text-orange-600 text-xl" />
                        <span className="text-gray-300 text-sm">Git</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <SiGithub className="text-gray-400 text-xl" />
                        <span className="text-gray-300 text-sm">GitHub</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <VscCode className="text-blue-500 text-xl" />
                        <span className="text-gray-300 text-sm">VS Code</span>
                      </div>
                    </div>
                  </div>

                  {/* Automatización */}
                  <div className="mb-6">
                    <h4 className="text-orange-400 text-sm font-medium mb-3 uppercase tracking-wider">
                      {t('about.automation') || 'Automatización'}
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <FaCogs className="text-blue-600 text-xl" />
                        <span className="text-gray-300 text-sm">Power Automate</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                        <FaRobot className="text-green-500 text-xl" />
                        <span className="text-gray-300 text-sm">RPA</span>
                      </div>
                      
                    </div>
                  </div>
                </div>

                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-0.5 bg-blue-600" />
                    <p className="text-blue-600 text-sm font-light">
                      {t('about.email')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-0.5 bg-blue-600" />
                    <p className="text-blue-600 text-sm uppercase tracking-wider font-light">
                      {t('about.location')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            

         
            <div className="relative h-full min-h-[60vh] lg:min-h-screen flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src="/about-portrait.jpg"
                  alt={t('about.photo_alt') || 'Portrait'}
                  className="w-full h-full object-cover object-center grayscale"
                  onError={(e) => { e.currentTarget.src = '/Retrato.jpg'; }}
                />
             
                <div className="absolute inset-0 bg-black/10" />
              </div>
              
            
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default About;