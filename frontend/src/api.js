import axios from "axios";
 
// Works on localhost and in GitHub Codespaces without any setup.
// In Codespaces the page is served from ...-3000.app.github.dev,
// so the backend is the same address with -8000.
export function backendUrl() {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
 
  const { protocol, hostname } = window.location;
  if (hostname.endsWith(".app.github.dev")) {
    return `${protocol}//${hostname.replace(/-3000\./, "-8000.")}`;
  }
  return "http://localhost:8000";
}
 
const api = axios.create({
  baseURL: backendUrl(),
});
 
export default api;
 