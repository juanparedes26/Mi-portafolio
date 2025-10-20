import { useTranslation } from 'react-i18next';

export const useProjectContent = (project) => {
  const { i18n } = useTranslation();
  
  if (!project) return { title: '', description: '' };
  
  return {
    title: i18n.language === 'en' && project.title_en 
      ? project.title_en 
      : project.title,
    description: i18n.language === 'en' && project.description_en 
      ? project.description_en 
      : project.description
  };
};