import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  // Jangan paksa Content-Type di level instance. Axios otomatis set
  // application/json untuk objek JSON, dan multipart/form-data (dengan
  // boundary) saat mengirim FormData. Memaksa application/json di sini
  // bikin upload file gagal (multer tidak bisa parse).
})

// Ubah path lokal (/uploads/...) menjadi URL absolut ke backend.
// URL eksternal (https://...) dibiarkan apa adanya.
export function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('/uploads')) {
    const origin = API_BASE.replace(/\/api\/v1\/?$/, '')
    return `${origin}${path}`
  }
  return path
}

// ── Request Interceptor — tambahkan token otomatis ─────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response Interceptor — handle 401 otomatis ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// ── Portfolio Public API ───────────────────────────────────────────────────

export async function getProfile() {
  const res = await api.get('/profile')
  return res.data
}

export async function getSkills(category?: string) {
  const res = await api.get('/skills', { params: category ? { category } : undefined })
  return res.data
}

export async function getProjects(params?: {
  page?: number
  limit?: number
  type?: string
  status?: string
  featured?: string
}) {
  const res = await api.get('/projects', { params })
  return res.data
}

export async function getExperience() {
  const res = await api.get('/experience')
  return res.data
}

export async function getEducation() {
  const res = await api.get('/education')
  return res.data
}

export async function getCertificates() {
  const res = await api.get('/certificates')
  return res.data
}

export async function sendContact(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const res = await api.post('/contact', data)
  return res.data
}

export default api
