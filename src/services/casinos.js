// Use VITE_API_BASE from Vite's environment variables, fallback to localhost if not set
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/casinos/";

export async function getCasinos() {
  try {
    const res = await fetch(`${API_BASE}list`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

export async function createCasinos(data) {
  try {
    const res = await fetch(`${API_BASE}create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}


/* fetch('http://localhost:5000/api/casinos/list')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Fetch error:", err)); */