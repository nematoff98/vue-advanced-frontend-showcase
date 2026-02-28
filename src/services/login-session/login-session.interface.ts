export interface LoginSessionsFilter {
  page?: number
  role?: string
  search?: string
}

export interface LoginSession {
  id: number
  userFullName: string
  teamName: string
  roles: string[]
  device: string
  lastActivity: string
  ipAddress: string
  country: string
}
