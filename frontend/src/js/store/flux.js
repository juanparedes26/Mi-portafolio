const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			adminToken: localStorage.getItem('adminToken') || null,
			user: null,
            projects: [],
            

		},
		actions: {
			 login: async (username, password) => {
                const store = getStore();
                try {
                    const resp = await fetch(`${backendUrl}/admin/login`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({ username, password })
                    });
                    if (!resp.ok) {
                        console.error("Login failed", resp.status);
                        return false;
                    }
                    const data = await resp.json();
                    
                    const token = data.access_token || data.token || null;
                    if (!token) {
                        console.error("No token returned by server", data);
                        return false;
                    }
                   
                    localStorage.setItem('adminToken', token);
                    setStore({ ...store, adminToken: token, user: data.user || null });
                    return token;
                } catch (error) {
                    console.error("Login error:", error);
                    return false;
                }
            },
            logout: () => {
                const store = getStore();
                localStorage.removeItem('adminToken');
                setStore({ ...store, adminToken: null, user: null });
            },
            createProject: async (projectData) => {
                const store = getStore();
                const token = store.adminToken;
                
             
                if (!projectData.title || projectData.title.length > 100) {
                    return { ok: false, error: 'Título requerido (máx. 100 caracteres)' };
                }
                if (!projectData.description || projectData.description.length > 2000) {
                    return { ok: false, error: 'Descripción requerida (máx. 2000 caracteres)' };
                }
                if (!projectData.techs || !Array.isArray(projectData.techs) || projectData.techs.length === 0 || projectData.techs.length > 10) {
                    return { ok: false, error: 'Tecnologías requeridas (máx. 10)' };
                }
                
                if (!token) {
                    return { ok: false, error: 'No estás autenticado' };
                }
                
                try {
                    const resp = await fetch(`${backendUrl}/admin/projects`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(projectData)
                    });
                    
                    if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}));
                        return { ok: false, error: err.error || `Error HTTP ${resp.status}` };
                    }
                    
                    const data = await resp.json();
                    
                    // Actualizar store solo si todo salió bien
                    const currentProjects = store.projects || [];
                    setStore({ ...store, projects: [...currentProjects, data.project] });
                    
                    return { ok: true, data: data.project };
                    
                } catch (error) {
                    return { ok: false, error: error.message };
                }
            },
            getProjects: async () => {
                    const store = getStore();
                    try {
                        const resp = await fetch(`${backendUrl}/admin/projects`, {
                            method: "GET",
                            headers: {"Content-Type": "application/json"}
                        });
                        
                        if (!resp.ok) {
                            const err = await resp.json().catch(() => ({}));
                            return { ok: false, error: err.error || `Error HTTP ${resp.status}` };
                        }
                        
                        const data = await resp.json();
                      
                        setStore({ ...store, projects: data });
                        
                        return { ok: true, data };
                        
                    } catch (error) {
                        console.error("getProjects error:", error);
                        return { ok: false, error: error.message };
                    }
           },
           updateProject: async (projectId, projectData) => {
                const store = getStore();
                const token = store.adminToken;

                if (!token) {
                    return { ok: false, error: 'No estás autenticado' };
                }

                if (!projectId) {
                    return { ok: false, error: 'ID del proyecto requerido' };
                }
                
                if (projectData.title && projectData.title.length > 100) {
                    return { ok: false, error: 'Título no puede superar 100 caracteres' };
                }
                if (projectData.description && projectData.description.length > 2000) {
                    return { ok: false, error: 'Descripción no puede superar 2000 caracteres' };
                }
                if (projectData.techs && (!Array.isArray(projectData.techs) || projectData.techs.length > 10)) {
                    return { ok: false, error: 'Máximo 10 tecnologías permitidas' };
                }
                
                if (!token) {
                    return { ok: false, error: 'No estás autenticado' };
                }
                
                try {
                    const resp = await fetch(`${backendUrl}/admin/projects/${projectId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(projectData)
                    });
                    
                    if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}));
                        return { ok: false, error: err.error || `Error HTTP ${resp.status}` };
                    }
                    
                    const data = await resp.json();
                    
                    // Actualizar el proyecto en el store
                    const updatedProjects = store.projects.map(p => 
                        p.id === parseInt(projectId) ? data.project : p
                    );
                    setStore({ ...store, projects: updatedProjects });
                    
                    return { ok: true, data: data.project };
                    
                } catch (error) {
                    return { ok: false, error: error.message };
                }
            },
            deleteProject: async (projectId) => {
                const store = getStore();
                const token = store.adminToken;
                
                if (!token) {
                    return { ok: false, error: 'No estás autenticado' };
                }
                
                if (!projectId) {
                    return { ok: false, error: 'ID del proyecto requerido' };
                }
                
                try {
                    const resp = await fetch(`${backendUrl}/admin/projects/${projectId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}));
                        return { ok: false, error: err.error || `Error HTTP ${resp.status}` };
                    }
                    
                    
                    const updatedProjects = store.projects.filter(p => p.id !== projectId);
                    setStore({ ...store, projects: updatedProjects });
                    
                    return { ok: true };
                    
                } catch (error) {
                    return { ok: false, error: error.message };
                }
            },
            uploadImage: async (file) => {
                const store = getStore();
                const token = store.adminToken;
                
                if (!token) {
                    return { ok: false, error: 'No estás autenticado' };
                }
                
                if (!file) {
                    return { ok: false, error: 'Archivo requerido' };
                }

                const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    return { ok: false, error: 'Tipo de archivo no permitido. Use PNG, JPG, JPEG o GIF.' };
                }
                
              
                const maxSize = 5 * 1024 * 1024; 
                if (file.size > maxSize) {
                    return { ok: false, error: 'Archivo muy grande. Máximo 5MB.' };
                }
                
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const resp = await fetch(`${backendUrl}/admin/upload`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`
                           
                        },
                        body: formData
                    });
                    
                    if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}));
                        return { ok: false, error: err.error || `Error HTTP ${resp.status}` };
                    }
                    
                    const data = await resp.json();
                    
                    return { ok: true, data: { file_url: data.file_url } };
                    
                } catch (error) {
                    return { ok: false, error: error.message };
                }
            },
        }
    }
}
export default getState;