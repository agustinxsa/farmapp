// Tipos que coinciden exactamente con la API del backend

export interface Turn {
  id: number
  code: string
  status: TurnStatus
  createdAt: string // ISO 8601 datetime string
  calledAt: string | null
  attendedAt: string | null
}

export enum TurnStatus {
  CREATED = "CREATED",
  CALLED = "CALLED", 
  SKIPPED = "SKIPPED",
  ATTENDED = "ATTENDED"
}

// Tipos para las respuestas de la API
export interface CreateTurnResponse extends Turn {}

export interface GetPendingTurnsResponse extends Array<Turn> {}

export interface UpdateTurnResponse extends Turn {}

// Tipos para mapeo interno (para mantener compatibilidad con la UI actual)
export interface TurnWithUI extends Turn {
  // Campos adicionales para la UI que no existen en el backend
  customerName?: string
  service?: string
  // Campos calculados para facilitar el uso en la UI
  displayNumber: string // alias de code
  displayStatus: "waiting" | "current" | "completed" | "skipped"
  waitTime: string // tiempo de espera calculado
  formattedTime: string // tiempo formateado para mostrar
}

// Mapeo de estados del backend a estados de la UI
export const mapBackendStatusToUI = (status: TurnStatus): TurnWithUI["displayStatus"] => {
  switch (status) {
    case TurnStatus.CREATED:
      return "waiting"
    case TurnStatus.CALLED:
      return "current"
    case TurnStatus.ATTENDED:
      return "completed"
    case TurnStatus.SKIPPED:
      return "skipped"
    default:
      return "waiting"
  }
}

// Función helper para convertir Turn del backend a TurnWithUI
export const mapBackendTurnToUI = (turn: Turn): TurnWithUI => {
  const createdAt = new Date(turn.createdAt)
  const now = new Date()
  const waitTimeMs = now.getTime() - createdAt.getTime()
  const waitTimeMinutes = Math.floor(waitTimeMs / 60000)
  
  return {
    ...turn,
    displayNumber: turn.code,
    displayStatus: mapBackendStatusToUI(turn.status),
    customerName: `Cliente ${turn.id}`, // Placeholder - en el futuro podría venir del backend
    service: "Medicamentos", // Placeholder - en el futuro podría venir del backend
    waitTime: `${waitTimeMinutes} min`,
    formattedTime: createdAt.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }
} 