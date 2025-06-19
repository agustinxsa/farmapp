// Configuración de la API

export const API_CONFIG = {
  // URL base de la API (cambiar según el entorno)
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  
  // Endpoints de la API
  ENDPOINTS: {
    TURNS: {
      CREATE: '/api/turns',
      GET_PENDING: '/api/turns/pending',
      CALL: (id: number) => `/api/turns/${id}/call`,
      SKIP: (id: number) => `/api/turns/${id}/skip`,
      ATTEND: (id: number) => `/api/turns/${id}/attend`,
    }
  }
} as const

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Headers por defecto para las peticiones
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const 