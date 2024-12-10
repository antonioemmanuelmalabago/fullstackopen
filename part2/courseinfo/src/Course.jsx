const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <b>total of {sum} exercises</b>

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Content = ({ parts }) =>
  parts.map((part) => <Part key={part.name} part={part} />)

const Course = ({ course, parts }) => {
  const total = parts.reduce((sum, part) => (sum += part.exercises), 0)
  return (
    <>
      <Header course={course} />
      <Content parts={parts} />
      <Total sum={total} />
    </>
  )
}

export default Course
