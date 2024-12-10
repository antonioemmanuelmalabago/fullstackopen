import React from 'react'
import { useState, useEffect } from 'react'
import countryServices from './services/countryServices'
import CountryData from './CountryData'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    countryServices.findAll().then((data) => setCountries(data))
  }, [])

  useEffect(() => {
    const result = countries.filter((country) =>
      country.toLowerCase().startsWith(search.toLowerCase())
    )

    setFiltered(result)
  }, [search])

  return (
    <div>
      <div>
        find countries{' '}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 10 ? 'Too many matches, specify another filter' : ''}

      {filtered.length <= 10 && filtered.length >= 2 ? (
        <>
          {filtered.map((country) => (
            <div key={country}>
              {country} <button onClick={() => setSearch(country)}>show</button>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}

      {filtered.length === 1 && search !== '' ? (
        <CountryData search={filtered[0]} />
      ) : (
        <></>
      )}
    </div>
  )
}

export default App
