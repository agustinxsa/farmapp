"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, SkipForward, CheckCircle, Clock, Users, AlertCircle, Plus } from "lucide-react"

interface Turn {
  id: number
  number: string
  customerName: string
  service: string
  timestamp: Date
  status: "waiting" | "current" | "completed" | "skipped"
}

export default function Component() {
  const [turns, setTurns] = useState<Turn[]>([
    {
      id: 1,
      number: "A001",
      customerName: "María García",
      service: "Medicamentos",
      timestamp: new Date(Date.now() - 300000),
      status: "waiting",
    },
    {
      id: 2,
      number: "A002",
      customerName: "Juan Pérez",
      service: "Consulta Farmacéutica",
      timestamp: new Date(Date.now() - 240000),
      status: "waiting",
    },
    {
      id: 3,
      number: "A003",
      customerName: "Ana López",
      service: "Medicamentos",
      timestamp: new Date(Date.now() - 180000),
      status: "waiting",
    },
    {
      id: 4,
      number: "A004",
      customerName: "Carlos Ruiz",
      service: "Inyecciones",
      timestamp: new Date(Date.now() - 120000),
      status: "waiting",
    },
  ])

  const [currentTurn, setCurrentTurn] = useState<Turn | null>(null)
  const [completedTurns, setCompletedTurns] = useState<Turn[]>([])
  const [skippedTurns, setSkippedTurns] = useState<Turn[]>([])
  const [nextTurnNumber, setNextTurnNumber] = useState(5)

  const waitingTurns = turns.filter((turn) => turn.status === "waiting")
  const totalWaiting = waitingTurns.length

  const callNextTurn = () => {
    if (waitingTurns.length === 0) return

    const nextTurn = waitingTurns[0]
    setCurrentTurn(nextTurn)
    setTurns((prev) => prev.map((turn) => (turn.id === nextTurn.id ? { ...turn, status: "current" as const } : turn)))
  }

  const skipCurrentTurn = () => {
    if (!currentTurn) return

    const skippedTurn = { ...currentTurn, status: "skipped" as const }
    setTurns((prev) => prev.filter((turn) => turn.id !== currentTurn.id))
    setSkippedTurns((prev) => [...prev, skippedTurn])
    setCurrentTurn(null)
  }

  const markAsCompleted = () => {
    if (!currentTurn) return

    const completedTurn = { ...currentTurn, status: "completed" as const }
    setTurns((prev) => prev.filter((turn) => turn.id !== currentTurn.id))
    setCompletedTurns((prev) => [...prev, completedTurn])
    setCurrentTurn(null)
  }

  const recallSkippedTurn = (skippedTurn: Turn) => {
    const recalledTurn = { ...skippedTurn, status: "waiting" as const, timestamp: new Date() }
    setTurns((prev) => [...prev, recalledTurn])
    setSkippedTurns((prev) => prev.filter((turn) => turn.id !== skippedTurn.id))
  }

  const addNewTurn = () => {
    const newTurn: Turn = {
      id: Date.now(),
      number: `A${nextTurnNumber.toString().padStart(3, "0")}`,
      customerName: `Cliente ${nextTurnNumber}`,
      service: "Medicamentos",
      timestamp: new Date(),
      status: "waiting",
    }

    setTurns((prev) => [...prev, newTurn])
    setNextTurnNumber((prev) => prev + 1)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getWaitTime = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000)
    return `${minutes} min`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Gestión de Turnos</h1>
          <p className="text-gray-600">Farmacia San Rafael</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalWaiting}</p>
                <p className="text-sm text-gray-600">En espera</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {completedTurns.filter((t) => t.status === "completed").length}
                </p>
                <p className="text-sm text-gray-600">Atendidos hoy</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{skippedTurns.length}</p>
                <p className="text-sm text-gray-600">Saltados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Turn Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Turno Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTurn ? (
                <div className="text-center space-y-4">
                  <div className="bg-blue-100 rounded-lg p-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{currentTurn.number}</div>
                    <div className="text-lg font-semibold text-gray-900">{currentTurn.customerName}</div>
                    <div className="text-sm text-gray-600">{currentTurn.service}</div>
                    <div className="text-xs text-gray-500 mt-2">Esperando: {getWaitTime(currentTurn.timestamp)}</div>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={markAsCompleted} className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marcar como Atendido
                    </Button>

                    <Button
                      onClick={skipCurrentTurn}
                      variant="outline"
                      className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <SkipForward className="mr-2 h-4 w-4" />
                      Saltar Turno
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No hay turno en atención</p>
                  <Button
                    onClick={callNextTurn}
                    disabled={totalWaiting === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Llamar Siguiente Turno
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waiting Queue */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Cola de Espera ({totalWaiting})
              </CardTitle>
              <Button onClick={addNewTurn} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Turno
              </Button>
            </CardHeader>
            <CardContent>
              {waitingTurns.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay turnos en espera</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {waitingTurns.map((turn, index) => (
                    <div
                      key={turn.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        index === 0 ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`text-lg font-bold ${index === 0 ? "text-blue-600" : "text-gray-600"}`}>
                          {turn.number}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{turn.customerName}</div>
                          <div className="text-sm text-gray-600">{turn.service}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-600">{formatTime(turn.timestamp)}</div>
                        <div className="text-xs text-gray-500">Esperando: {getWaitTime(turn.timestamp)}</div>
                        {index === 0 && (
                          <Badge variant="secondary" className="mt-1">
                            Siguiente
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Skipped Turns */}
        {skippedTurns.length > 0 && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertCircle className="mr-2 h-5 w-5" />
                Turnos Saltados ({skippedTurns.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {skippedTurns.map((turn) => (
                  <div
                    key={turn.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-orange-600">{turn.number}</div>
                      <div>
                        <div className="font-medium text-gray-900">{turn.customerName}</div>
                        <div className="text-sm text-gray-600">{turn.service}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => recallSkippedTurn(turn)}
                      size="sm"
                      variant="outline"
                      className="border-orange-300 text-orange-600 hover:bg-orange-100"
                    >
                      <Phone className="mr-1 h-3 w-3" />
                      Volver a Llamar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {completedTurns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Turnos Completados Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedTurns
                  .slice(-5)
                  .reverse()
                  .map((turn) => (
                    <div key={turn.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="font-medium">{turn.number}</span>
                        <span className="text-gray-600">{turn.customerName}</span>
                        <span className="text-sm text-gray-500">{turn.service}</span>
                      </div>
                      <Badge variant="default">Atendido</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
