import { Row, Col } from 'antd'

import MovieItem from '../MovieItem/MovieItem'

export default function MoviesList({ movies = [] }) {
  return (
    <section className="movies-list-container">
      <Row gutter={[16, 16]} justify="center">
        {movies.map((movie) => (
          <Col xs={24} sm={24} md={12} lg={12} xl={12} key={movie.id}>
            <MovieItem
              title={movie.title}
              description={movie.description}
              image={movie.image}
              genre={movie.genre}
              date={movie.date}
              id={movie.id}
              rating={movie.rating}
            />
          </Col>
        ))}
      </Row>
    </section>
  )
}
