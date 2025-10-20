import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../js/store/appContext';


export default function Navbar() {
  const { store, actions } = useContext(Context);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
    // Persistir el idioma seleccionado en localStorage
    localStorage.setItem('preferred-language', newLanguage);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false); 
  };

  return (
     <nav className="fixed top-0 left-0 right-0 text-white z-[9999] w-full py-4 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8">
        

        <div className="hidden md:flex space-x-8 items-center">
          <button
            className="bg-transparent border-none hover:!text-blue-600 text-white font-semibold transition-colors duration-200 cursor-pointer"
            onClick={() => navigate('/')}
          >
            {t('navbar.home')}
          </button>

          <button
            className="bg-transparent border-none text-white hover:!text-blue-600 font-semibold transition-colors duration-200 cursor-pointer"
            onClick={() => navigate('/about')}
          >
            {t('navbar.about')}
          </button>

          <button
            className="bg-transparent border-none text-white hover:!text-blue-600 font-semibold transition-colors duration-200 cursor-pointer"
            onClick={() => navigate('/projects')}
          >
            {t('navbar.projects')}
          </button>


  
          {store.adminToken && (
            <button
              className="bg-transparent border-none text-white hover:!text-blue-600 font-semibold transition-colors duration-200 cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              Admin
            </button>
          )}
        </div>


        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 bg-transparent text-blue-600 rounded text-sm font-semibold hover:bg-blue-100 transition"
          >
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>

         
          {store.adminToken && (
            <button
              onClick={() => {
                actions.logout();
                navigate('/');
              }}
              className="px-2 py-1 bg-transparent text-red-400 rounded text-xs font-medium hover:bg-red-400 hover:text-white transition-all duration-200"
              title="Cerrar sesión"
            >
              Salir
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-transparent text-blue-600 rounded text-sm font-semibold hover:bg-blue-100 transition"
            >
              {i18n.language === 'es' ? 'EN' : 'ES'}
            </button>

            {/* Logout móvil */}
            {store.adminToken && (
              <button
                onClick={() => {
                  actions.logout();
                  navigate('/');
                }}
                className="px-2 py-1 bg-transparent text-red-400 rounded text-xs font-medium hover:bg-red-400 hover:text-white transition-all duration-200"
                title="Cerrar sesión"
              >
                Salir
              </button>
            )}
          </div>
          
          <button
            onClick={toggleMenu}
            className="text-white hover:text-blue-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
          <div className="flex flex-col space-y-4 px-8 py-6">
            <button
              className="text-left bg-transparent border-none hover:!text-blue-600 text-white font-semibold transition-colors duration-200 cursor-pointer"
              onClick={() => handleNavigate('/')}
            >
              {t('navbar.home')}
            </button>

            <button
              className="text-left bg-transparent border-none text-white hover:!text-blue-600 font-semibold transition-colors duration-200 cursor-pointer"
              onClick={() => handleNavigate('/about')}
            >
              {t('navbar.about')}
            </button>

            <button
              className="text-left bg-transparent border-none text-white hover:!text-blue-600 font-semibold transition-colors duration-200 cursor-pointer"
              onClick={() => handleNavigate('/projects')}
            >
              {t('navbar.projects')}
            </button>

            <button
              className="text-left bg-transparent border-none text-white hover:!text-blue-600 font-semibold transition-colors duration-200 cursor-pointer"
              onClick={() => handleNavigate('/cv')}
            >
              {t('navbar.skills')}
            </button>
            {store.adminToken && (
              <button
                className="text-left bg-transparent border-none text-white hover:!text-blue-600 font-semibold transition-colors duration-200 cursor-pointer"
                onClick={() => handleNavigate('/admin')}
              >
                Admin
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}