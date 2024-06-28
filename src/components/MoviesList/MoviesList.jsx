import { Row, Col, Empty } from 'antd'
import { useContext } from 'react'

import DataContext, { DataProvider } from '../DataContext/DataContext'
import MovieItem from '../MovieItem/MovieItem'

export default function MoviesList() {
  const movies = useContext(DataContext)
  /// hello
  // if (movies.length === 0) {
  //   return <Empty description="The search has not given any results" />
  // }
  return (
    <section className="movies-list-container">
      <Row gutter={[36, 36]} justify="center">
        {movies.map((movie) => (
          <Col key={movie.id} xs={24} sm={24} md={12} lg={12} xl={12}>
            <DataProvider value={movie}>
              <MovieItem movie={movie} />
            </DataProvider>
          </Col>
        ))}
      </Row>
    </section>
  )
}
