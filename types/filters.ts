import { RootStateFilter } from '~/store/filters';

export interface VuexModuleFilters {
  filters: RootStateFilter;
}

export interface Zone {
  id: string,
  country: string,
  zoneName: string;
}

export interface ServiceType {
  id: string,
  name: string;
}
