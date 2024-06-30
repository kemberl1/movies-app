import { Component } from 'react'
import { Rate } from 'antd'
import PropTypes from 'prop-types'

export default class MovieRating extends Component {
  static handleRate = (value, id, onRate) => {
    onRate(id, value)
  }

  static updateMovieRating = (moviesArray, movieId, rating) =>
    moviesArray.map((movieItem) => {
      if (movieItem.id === movieId) {
        return { ...movieItem, userRating: rating }
      }
      return movieItem
    })

  static mergeRatings = (moviesData, ratedMovies) => {
    const ratedMap = ratedMovies.reduce((acc, movie) => {
      acc[movie.id] = movie.userRating
      return acc
    }, {})

    return moviesData.map((movie) => ({
      ...movie,
      userRating: ratedMap[movie.id] || movie.userRating,
    }))
  }

  render() {
    const { id, value, count, onRate } = this.props
    return (
      <Rate
        className="movie__meta-rating"
        defaultValue={0}
        value={value}
        count={count}
        onChange={(rate) => MovieRating.handleRate(rate, id, onRate)}
      />
    )
  }
}

MovieRating.propTypes = {
  id: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onRate: PropTypes.func.isRequired,
}
