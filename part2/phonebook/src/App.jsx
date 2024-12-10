import React from 'react'
import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Notification from './Notification'
import phonebookService from './services/phonebookService'
import './styles/App.css'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  useEffect(() => {
    phonebookService.getAll().then((response) => setPersons(response))
  }, [])

  if (persons === null) {
    return null
  }

  const filteredPersons =
    searchTerm === ''
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(searchTerm)
        )

  const handleSubmit = (event) => {
    event.preventDefault()

    const person = persons.find((person) => person.name === newName)
    if (person) {
      const newPhone = { ...person, number: newNumber }
      handleEdit(newPhone)
    } else {
      const newPerson = { name: newName, number: newNumber }
      phonebookService
        .addPhone(newPerson)
        .then((response) => setPersons(persons.concat(response)))
      setMessageType('success')
      setMessage(`Added ${newName}`)
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  const handleDelete = (deletePerson) => {
    if (confirm(`Delete ${deletePerson.name} ?`)) {
      phonebookService
        .deletePhone(deletePerson.id)
        .then((response) =>
          setPersons(persons.filter((person) => person.id !== response.id))
        )
        .catch((error) => {
          setMessage(
            `Information of ${deletePerson.name} has already been removed from the server`
          )
          setMessageType('error')
        })
    }
  }

  const handleEdit = (newPhone) => {
    if (
      confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      phonebookService.editPhone(newPhone).then((response) => {
        setPersons(
          persons.map((person) =>
            person.id !== newPhone.id ? person : response
          )
        )
      })
      setMessageType('success')
      setMessage(`Number of ${newName} has been changed`)
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <Filter searchTerm={searchTerm} handleSearchTerm={handleSearchTerm} />

      <h3>Add a new</h3>

      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />

      <h3>Numbers</h3>

      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App
