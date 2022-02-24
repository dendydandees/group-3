import { RootStateClientConnections } from '~/store/clientConnections'

export interface VuexModuleClientConnections {
  clientConnections: RootStateClientConnections
}

export interface ClientConnections {
  id: string
  name: string
  contactPerson: string
}
