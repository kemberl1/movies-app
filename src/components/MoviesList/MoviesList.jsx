import { Row, Col, Empty } from 'antd'
import { useContext } from 'react'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import DataContext, { DataProvider } from '../Context/DataContext'
import MovieItem from '../MovieItem/MovieItem'
import Loader from '../Loader/Loader'
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator'

export default function MoviesList({ loading, error, errorMessage, onRate, searchQuery, activeTab }) {
  const movies = useContext(DataContext)

  const dataMessage = activeTab === '2' ? 'You have no rated movies' : 'The search has not given any results'

  if (loading) {
    return <Loader />
  }

  if ((searchQuery !== '' && movies.length === 0) || (activeTab === '2' && movies.length === 0)) {
    return <Empty description={dataMessage} />
  }

  if (error) {
    return <ErrorIndicator message={errorMessage} />
  }

  return (
    <ErrorBoundary>
      <section className="movies-list-container">
        <Row gutter={[36, 36]} justify="center">
          {movies.map((movie) => (
            <Col key={movie.id} xs={24} sm={24} md={12} lg={12} xl={12}>
              <DataProvider value={movie}>
                <MovieItem movie={movie} onRate={onRate} userRating={movie.userRating} />
              </DataProvider>
            </Col>
          ))}
        </Row>
      </section>
    </ErrorBoundary>
  )
}
