import React, { useEffect, useState } from 'react'
import countryServices from './services/countryServices'

const CountryData = ({ search }) => {
  const [countryData, setCountryData] = useState(null)

  useEffect(() => {
    countryServices.findOne(search).then((data) => setCountryData(data))
  }, [])

  if (countryData === null) {
    return null
  }

  return (
    <div>
      <h1>{search}</h1>
      <p>capital {countryData.capital}</p>
      <p>area {countryData.area}</p>
      <h3>languages:</h3>
      <ul>
        {countryData.languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={countryData.flag} alt={`Flag of ${search}`} />
      <h2>Weather in {countryData.capital}</h2>
      <p>temperature {countryData.temp} Celsius</p>
      <img src={countryData.weatherIcon} alt="Weather Icon" />
      <p>wind {countryData.wind} m/s</p>
    </div>
  )
}

export default CountryData
