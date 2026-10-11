import Country from '#models/country'
import Language from '#models/language'
import { SelectorOption, TableData } from '~/types'

export default function useUtils() {
  const loadLanguageOptions = async (searchTerm: string): Promise<SelectorOption[]> => {
    try {
      const response = await fetch(
        `/api/v1/language?search=${encodeURIComponent(searchTerm)}&page=1`
      )
      console.log('Language Data', response)
      const data = await response.json()
      return data.data.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    } catch (error) {
      console.error('Error loading languages:', error)
      return []
    }
  }

  const loadDefaultLanguageOption = async (id: string): Promise<SelectorOption[]> => {
    try {
      const response = await fetch(`/api/v1/language/${id}`)
      const data: Language | null = await response.json()
      if (!data) {
        return []
      }
      return [
        {
          value: data.id,
          label: data.name,
        },
      ]
    } catch (error) {
      console.error('Error loading language:', error)
      return []
    }
  }

  const loadCountryOptions = async (searchTerm: string): Promise<SelectorOption[]> => {
    try {
      console.log('Coutry loader triggered')
      const response = await fetch(
        `/api/v1/country?search=${encodeURIComponent(searchTerm)}&page=1`
      )
      const data: TableData<Country[]> = await response.json()
      console.log('Coutry Data', data)
      if (!data) {
        return []
      }
      return data.data.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    } catch (error) {
      console.error('Error loading countries:', error)
      return []
    }
  }

  const loadDefaultCountryOption = async (id: string): Promise<SelectorOption[]> => {
    try {
      const response = await fetch(`/api/v1/country/${id}`)
      const data: Country | null = await response.json()

      if (!data) {
        return []
      }
      return [
        {
          value: data.id,
          label: data.name,
        },
      ]
    } catch (error) {
      console.error('Error loading country:', error)
      return []
    }
  }

  const loadEthnicGroupOptions = async (searchTerm: string): Promise<SelectorOption[]> => {
    try {
      const response = await fetch(`/api/v1/ethnic-group?search=${encodeURIComponent(searchTerm)}`)
      const data: { id: string; canonicalName: string }[] = await response.json()
      if (!data) return []
      return data.map((item) => ({
        value: item.id,
        label: item.canonicalName,
      }))
    } catch (error) {
      console.error('Error loading ethnic groups:', error)
      return []
    }
  }

  const loadCultureOptions = async (searchTerm: string): Promise<SelectorOption[]> => {
    try {
      const response = await fetch(`/api/v1/culture?search=${encodeURIComponent(searchTerm)}`)
      const data: { id: string; name: string; ethnicGroupName: string | null }[] =
        await response.json()
      if (!data) return []
      return data.map((item) => ({
        value: item.id,
        label: item.ethnicGroupName ? `${item.name} (${item.ethnicGroupName})` : item.name,
      }))
    } catch (error) {
      console.error('Error loading cultures:', error)
      return []
    }
  }

  return {
    loadLanguageOptions,
    loadDefaultLanguageOption,
    loadCountryOptions,
    loadDefaultCountryOption,
    loadEthnicGroupOptions,
    loadCultureOptions,
  }
}
