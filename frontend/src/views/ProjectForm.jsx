import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../js/store/appContext';

const ProjectForm = ({ project = null, onClose, onSave }) => {
  const { actions } = useContext(Context);
  
  // Estados básicos del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    title_en: '',
    description_en: '',
    techs: '',
    repo_url: '',
    live_url: '',
    images: [],           
    main_image_index: 0   
  });

  // Estados para manejo de imágenes
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [fileErrors, setFileErrors] = useState([]); 

  // Cargar datos del proyecto si estamos editando
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        title_en: project.title_en || '',
        description_en: project.description_en || '',
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
  
      setFormData({
        title: '',
        description: '',
        title_en: '',
        description_en: '',
        techs: '',
        repo_url: '',
        live_url: '',
        images: [],
        main_image_index: 0
      });
    }
  }, [project]);

  // Limpiar URLs de preview al desmontar el componente
  useEffect(() => {
    return () => {
      selectedFiles.forEach(fileObj => {
        URL.revokeObjectURL(fileObj.preview);
      });
    };
  }, [selectedFiles]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar archivos seleccionados
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return `${file.name}: Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WebP)`;
    }
    
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `${file.name}: Archivo muy grande (${sizeMB}MB). Máximo 5MB permitido`;
    }
    
    return null;
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Manejar selección de archivos (sin subir aún)
  const handleFileSelection = (files) => {
    const fileArray = Array.from(files);
    const currentTotalImages = formData.images.length + selectedFiles.length;
    const maxImages = 10;
    
    // Verificar límite total de imágenes
    if (currentTotalImages >= maxImages) {
      setFileErrors([`Ya tienes ${maxImages} imágenes. Elimina algunas antes de agregar más.`]);
      return;
    }
    
    const newErrors = [];
    const validFiles = [];
    
    fileArray.forEach(file => {
      if (currentTotalImages + validFiles.length >= maxImages) {
        newErrors.push(`Se alcanzó el límite máximo de ${maxImages} imágenes`);
        return;
      }
      
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        // Crear preview URL para mostrar la imagen
        const fileWithPreview = {
          file: file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          id: Date.now() + Math.random() // ID único para identificar
        };
        validFiles.push(fileWithPreview);
      }
    });
    
    setFileErrors(newErrors);
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  // Eliminar archivo seleccionado (antes de subir)
  const removeSelectedFile = (fileId) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Limpiar URL de preview para evitar memory leaks
      const removed = prev.find(f => f.id === fileId);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  // Confirmar subida de archivos seleccionados
  const confirmUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    setFileErrors([]);
    
    try {
      const uploadedFiles = [];
      
      for (const fileObj of selectedFiles) {
        const result = await actions.uploadImage(fileObj.file);
        
        if (result.ok) {
          uploadedFiles.push(result.data.file_url);
        } else {
          setFileErrors(prev => [...prev, `Error al subir ${fileObj.name}: ${result.error}`]);
          setUploading(false);
          return;
        }
      }
      
      // Si todos se subieron correctamente
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedFiles]
      }));
      
      // Limpiar archivos seleccionados y sus previews
      selectedFiles.forEach(fileObj => {
        URL.revokeObjectURL(fileObj.preview);
      });
      setSelectedFiles([]);
      
    } catch (error) {
      setFileErrors([`Error al subir imágenes: ${error.message}`]);
    } finally {
      setUploading(false);
    }
  };

  // Limpiar archivos seleccionados
  const clearSelectedFiles = () => {
    selectedFiles.forEach(fileObj => {
      URL.revokeObjectURL(fileObj.preview);
    });
    setSelectedFiles([]);
    setFileErrors([]);
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
      handleFileSelection(Array.from(e.dataTransfer.files));
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
      title_en: formData.title_en.trim() || null,
      description_en: formData.description_en.trim() || null,
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
                Título (Español) *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del proyecto en español"
                required
              />
            </div>

            {/* Título en inglés */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título (English)
              </label>
              <input
                type="text"
                name="title_en"
                value={formData.title_en}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Project title in English"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción (Español) *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tu proyecto en español..."
                required
              />
            </div>

            {/* Descripción en inglés */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción (English)
              </label>
              <textarea
                name="description_en"
                value={formData.description_en}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your project in English..."
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Imágenes del Proyecto
                </label>
                <span className="text-xs text-gray-500">
                  {formData.images.length + selectedFiles.length}/10 imágenes
                </span>
              </div>
              
              {/* Área de Drag & Drop */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-500/10 transform scale-105' 
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
                } ${uploading ? 'pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelection(Array.from(e.target.files))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading || formData.images.length + selectedFiles.length >= 10}
                />
                
                <div className="space-y-3">
                  <div className={`mx-auto transition-colors ${dragActive ? 'text-blue-400' : 'text-gray-400'}`}>
                    <svg className="h-16 w-16 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-gray-300">
                    <span className="font-medium text-blue-400">Haz clic para seleccionar</span> o arrastra imágenes aquí
                  </div>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF, WebP hasta 5MB cada una
                  </p>
                  {formData.images.length + selectedFiles.length >= 10 && (
                    <p className="text-sm text-yellow-400 font-medium">
                      Límite máximo alcanzado (10 imágenes)
                    </p>
                  )}
                </div>

                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg backdrop-blur-sm">
                    <div className="text-white flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium">Subiendo imágenes...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mostrar errores de validación */}
              {fileErrors.length > 0 && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-400 mb-1">Errores en la selección:</h4>
                      <ul className="text-sm text-red-300 space-y-1">
                        {fileErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview de archivos seleccionados (pendientes de subir) */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-yellow-400">
                      Archivos seleccionados ({selectedFiles.length})
                    </h4>
                    <button
                      type="button"
                      onClick={clearSelectedFiles}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Limpiar todo
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {selectedFiles.map((fileObj) => (
                      <div key={fileObj.id} className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded-lg">
                        <img
                          src={fileObj.preview}
                          alt={fileObj.name}
                          className="w-12 h-12 object-cover rounded border border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{fileObj.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(fileObj.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(fileObj.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Eliminar archivo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={confirmUpload}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Subiendo...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span>Subir {selectedFiles.length} imagen{selectedFiles.length > 1 ? 'es' : ''}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={clearSelectedFiles}
                      disabled={uploading}
                      className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:bg-gray-600 text-sm rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Preview de imágenes ya subidas */}
              {formData.images.length > 0 && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h4 className="text-sm font-medium text-green-400">
                      Imágenes subidas ({formData.images.length})
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Imagen ${index + 1}`}
                          className={`w-full h-32 object-cover rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                            formData.main_image_index === index 
                              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/20' 
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        />
                        
                        {/* Indicador de imagen principal */}
                        {formData.main_image_index === index && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                            ⭐ Principal
                          </div>
                        )}
                        
                        {/* Botones de acción */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center space-x-2">
                          {formData.main_image_index !== index && (
                            <button
                              type="button"
                              onClick={() => setMainImage(index)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors shadow-lg"
                              title="Establecer como principal"
                            >
                              Hacer Principal
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors shadow-lg"
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
                disabled={uploading || selectedFiles.length > 0}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
                  uploading || selectedFiles.length > 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title={selectedFiles.length > 0 ? 'Sube o cancela las imágenes seleccionadas antes de continuar' : ''}
              >
                {uploading ? 'Procesando...' : (project ? 'Actualizar' : 'Crear')}
              </button>
            </div>
            
            {/* Mensaje informativo si hay archivos pendientes */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-300">
                    Tienes {selectedFiles.length} imagen{selectedFiles.length > 1 ? 'es' : ''} seleccionada{selectedFiles.length > 1 ? 's' : ''} pendiente{selectedFiles.length > 1 ? 's' : ''} de subir. 
                    Súbelas o cancélalas antes de guardar el proyecto.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;