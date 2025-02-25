const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    user: new User({ name: 'Michael Chan' }),
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    user: new User({ name: 'Edsger W. Dijkstra' }),
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
]

const blogsInDb = () => {
  return Blog.find({})
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((a) => a.toJSON())
}

const resetDb = async () => {
  await Promise.all([Blog.deleteMany({}), User.deleteMain({})])
}

module.exports = { initialBlogs, blogsInDb, usersInDb }
