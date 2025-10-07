const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			adminToken: localStorage.getItem('adminToken') || null,
			user: null

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
            }
		}
	};
};

export default getState;