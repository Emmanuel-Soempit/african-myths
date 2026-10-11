export interface AdminEthnicGroup {
  id: string
  name: string
  description: string
  countries: string
  regions: string
  population: string
  subEthnicGroups: number
}


export interface CountryItem {
    id: string
    countryId: string
    populationEstimate: string
    isPrimaryHome: boolean
    source: string
}