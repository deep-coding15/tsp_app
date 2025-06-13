import API_BASE_URL from "./config";

export async function getCities() {
    const response = await fetch(`${API_BASE_URL}/cities`);
    return response.json();
}

export async function getOptimizedRoute(cities) {
  const response = await fetch(`${API_BASE_URL}/optimize-trip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cities }),
  });
  return await response.json();
}