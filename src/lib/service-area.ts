const defaultAllowedCities = [] as string[]

const parseAllowedCities = () => {
  const raw = process.env.SERVICE_AREA_CITIES
  if (!raw) return defaultAllowedCities
  return raw
    .split(',')
    .map((city) => city.trim().toLowerCase())
    .filter(Boolean)
}

const allowedCities = parseAllowedCities()

export function isCityServiceable(city: string) {
  if (!allowedCities.length) return true
  return allowedCities.includes(city.trim().toLowerCase())
}
