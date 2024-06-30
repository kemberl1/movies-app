import { Row, Col, Empty } from 'antd'
import PropTypes from 'prop-types'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import MovieItem from '../MovieItem/MovieItem'
import Loader from '../Loader/Loader'
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator'

export default function MoviesList({ loading, error, errorMessage, onRate, searchQuery, activeTab, movies }) {
  const dataMessage = activeTab === '1' ? 'The search has not given any results' : 'You have no rated movies'

  if (loading && searchQuery !== '') {
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
              <MovieItem movie={movie} onRate={onRate} userRating={movie.userRating} />
            </Col>
          ))}
        </Row>
      </section>
    </ErrorBoundary>
  )
}

MoviesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onRate: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      date: PropTypes.string,
      globalRating: PropTypes.number.isRequired,
      userRating: PropTypes.number,
      genre: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
}
