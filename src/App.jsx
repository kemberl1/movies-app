import { Component } from 'react'
import './App.scss'
import { Header } from 'antd/es/layout/layout'

import MovieList from './components/MoviesList/MoviesList'
import APIService from './components/service/APIService'
import MoviesPagination from './components/MoviesPagination/MoviesPagination'
import ErrorIndicator from './components/ErrorIndicator/ErrorIndicator'
import ErrorMessages from './components/ErrorMessages/ErrorMessages'
import Loader from './components/Loader/Loader'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moviesData: [],
      currentPage: 1,
      loading: false,
      error: false,
      errorMessage: '',
    }
    this.apiService = new APIService()
  }

  componentDidMount() {
    this.loadMovies()
  }

  loadMovies = () => {
    this.setState({ loading: true })
    this.apiService
      .getAllMovies()
      .then((moviesData) => {
        this.setState({ moviesData, loading: false })
      })
      .catch(() => {
        this.onError(ErrorMessages.DATA_FETCH_ERROR)
      })
  }

  onError = (message) => {
    this.setState({ error: true, loading: false, errorMessage: message })
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page })
  }

  render() {
    const { moviesData, currentPage, loading, error, errorMessage } = this.state
    const moviesPerPage = 6
    const totalMovies = moviesData.length
    const indexOfLastMovie = currentPage * moviesPerPage
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
    const currentMovies = moviesData.slice(indexOfFirstMovie, indexOfLastMovie)
    const errorMessageIndicator = error ? <ErrorIndicator message={errorMessage} /> : null
    const loadingIndicator = loading ? <Loader /> : null

    return (
      <div className="movies-app">
        <section className="main">
          <Header />
          {errorMessageIndicator}
          {loadingIndicator}
          {!loading && !error && <MovieList movies={currentMovies} />}
          <MoviesPagination
            currentPage={currentPage}
            totalMovies={totalMovies}
            moviesPerPage={moviesPerPage}
            onPageChange={this.handlePageChange}
          />
        </section>
      </div>
    )
  }
}
