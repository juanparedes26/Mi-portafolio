import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../js/store/appContext';

const ProjectForm = ({ project = null, onClose, onSave }) => {
  const { actions } = useContext(Context);
  
  // Estados básicos del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techs: '',
    repo_url: '',
    live_url: '',
    images: [],           // Array de URLs de imágenes
    main_image_index: 0   // Índice de la imagen principal
  });

  // Estados para manejo de imágenes
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Cargar datos del proyecto si estamos editando
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        techs: Array.isArray(project.techs) 
          ? project.techs.join(', ') 
          : (typeof project.techs === 'string' && project.techs.includes(',') 
              ? project.techs 
              : project.techs || ''),
        repo_url: project.repo_url || '',
        live_url: project.live_url || '',
        images: project.images || [],
        main_image_index: project.main_image_index || 0
      });
    } else {
      // Resetear formulario para nuevo proyecto
      setFormData({
        title: '',
        description: '',
        techs: '',
        repo_url: '',
        live_url: '',
        images: [],
        main_image_index: 0
      });
    }
  }, [project]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar subida de múltiples imágenes
  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedFiles = [];
      
      // Usar uploadImage para cada archivo individualmente
      for (const file of files) {
        const result = await actions.uploadImage(file);
        
        if (result.ok) {
          uploadedFiles.push(result.data.file_url);
        } else {
          alert('Error al subir imagen: ' + result.error);
          setUploading(false);
          return;
        }
      }
      
      // Si todos los archivos se subieron correctamente
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedFiles]
      }));
      
    } catch (error) {
      alert('Error al subir imágenes: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Manejar drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  };

  // Remover imagen
  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newMainIndex = prev.main_image_index >= newImages.length ? 0 : prev.main_image_index;
      return {
        ...prev,
        images: newImages,
        main_image_index: newMainIndex
      };
    });
  };

  // Establecer imagen principal
  const setMainImage = (index) => {
    setFormData(prev => ({
      ...prev,
      main_image_index: index
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }
    if (!formData.description.trim()) {
      alert('La descripción es obligatoria');
      return;
    }
    if (!formData.techs.trim()) {
      alert('Las tecnologías son obligatorias');
      return;
    }

    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      techs: formData.techs.split(',').map(tech => tech.trim()).filter(tech => tech),
      repo_url: formData.repo_url.trim() || "",
      live_url: formData.live_url.trim() || "",
      images: formData.images,
      main_image_index: formData.main_image_index
    };

    try {
      let result;
      
      if (project) {
        // Editar proyecto existente
        result = await actions.updateProject(project.id, projectData);
      } else {
        // Crear nuevo proyecto
        result = await actions.createProject(projectData);
      }

      if (result.ok) {
        alert(project ? 'Proyecto actualizado exitosamente' : 'Proyecto creado exitosamente');
        if (onSave) onSave();
        onClose();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del proyecto"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tu proyecto..."
                required
              />
            </div>

            {/* Tecnologías */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tecnologías *
              </label>
              <input
                type="text"
                name="techs"
                value={formData.techs}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, Python... (separadas por comas)"
                required
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL del Repositorio
                </label>
                <input
                  type="url"
                  name="repo_url"
                  value={formData.repo_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/usuario/repo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL Demo/Live
                </label>
                <input
                  type="url"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://miproyecto.com"
                />
              </div>
            </div>

            {/* Subida de Imágenes Múltiples */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imágenes del Proyecto
              </label>
              
              {/* Área de Drag & Drop */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                <div className="space-y-2">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-gray-300">
                    <span className="font-medium text-blue-400">Haz clic para subir</span> o arrastra imágenes aquí
                  </div>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF hasta 5MB cada una (máx. 10 imágenes)</p>
                </div>

                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-white flex items-center space-x-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Subiendo imágenes...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview de imágenes */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-3">Imágenes subidas ({formData.images.length}):</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Imagen ${index + 1}`}
                          className={`w-full h-24 object-cover rounded-lg border-2 transition-all ${
                            formData.main_image_index === index 
                              ? 'border-blue-500 ring-2 ring-blue-500/20' 
                              : 'border-gray-600'
                          }`}
                        />
                        
                        {/* Indicador de imagen principal */}
                        {formData.main_image_index === index && (
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                        
                        {/* Botones de acción */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          {formData.main_image_index !== index && (
                            <button
                              type="button"
                              onClick={() => setMainImage(index)}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              title="Establecer como principal"
                            >
                              Principal
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            title="Eliminar imagen"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {project ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;