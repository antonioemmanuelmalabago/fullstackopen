import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const addPhone = (newPhone) => {
  const request = axios.post(baseUrl, newPhone)
  return request.then((response) => response.data)
}

const deletePhone = (phoneId) => {
  const request = axios.delete(`${baseUrl}/${phoneId}`)
  return request.then((response) => response.data)
}

const editPhone = (newPhone) => {
  const request = axios.put(`${baseUrl}/${newPhone.id}`, newPhone)
  return request.then((response) => response.data)
}

export default { getAll, addPhone, deletePhone, editPhone }
