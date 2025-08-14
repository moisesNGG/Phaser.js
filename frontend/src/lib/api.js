// Utilidad para consumir el backend usando la variable de entorno
const API_URL = process.env.REACT_APP_BACKEND_URL;

export async function fetchApi(route, options = {}) {
  const res = await fetch(`${API_URL}${route}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
