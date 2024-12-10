import axios from 'axios'

const findAll = () => {
  try {
    const request = axios.get(
      'https://studies.cs.helsinki.fi/restcountries/api/all'
    )
    return request.then((response) =>
      response.data.map((country) => country.name.common)
    )
  } catch (error) {
    console.log('Error fetching countries: ', error)
    return null
  }
}

const findOne = async (country) => {
  try {
    const request = await axios.get(
      `https://studies.cs.helsinki.fi/restcountries/api/name/${country}`
    )
    const { capital, languages, area, flags, capitalInfo } = request.data

    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${
      capitalInfo.latlng[0]
    }&lon=${capitalInfo.latlng[1]}&appid=${import.meta.env.VITE_SOME_KEY}`

    const weatherRequest = await axios.get(weatherApi)
    const { main, wind, weather } = weatherRequest.data

    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`

    return {
      capital: capital[0],
      languages: Object.values(languages),
      area,
      flag: flags.png,
      temp: Math.round((main.temp - 273.15) * 100) / 100,
      wind: wind.speed,
      weatherIcon,
    }
  } catch (error) {
    console.log('Error finding country: ', error)
    return null
  }
}

export default { findAll, findOne }
