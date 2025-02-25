const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  for (let blog of blogs) {
    total += blog.likes
  }

  return blogs.length === 0 ? 0 : total
}

const favoriteBlog = (blogs) => {
  let favorite = blogs[0]
  let highestLikes = blogs[0].likes
  for (let blog of blogs) {
    if (blog.likes > highestLikes) {
      favorite = blog
      highestLikes = blog.likes
    }
  }

  return favorite
}

const mostBlogs = (blogs) => {
  return _(blogs)
    .groupBy('author')
    .map((blogs, author) => ({ author, blogs: blogs.length }))
    .maxBy('blogs')
}

const mostLikes = (blogs) => {
  return _(blogs)
    .groupBy('author')
    .map((blogs, author) => ({ author, likes: _.sumBy(blogs, 'likes') }))
    .maxBy('likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
