import { Component } from 'react'
import './App.scss'
import { Header } from 'antd/es/layout/layout'

import MovieList from './components/MoviesList/MoviesList'
import APIService from './components/service/APIService'
import MoviesPagination from './components/MoviesPagination/MoviesPagination'
import ErrorIndicator from './components/ErrorIndicator/ErrorIndicator'
import ErrorMessages from './components/ErrorMessages/ErrorMessages'
import Loader from './components/Loader/Loader'
import SearchForm from './components/SearchForm/SearchForm'
import QueryNormalizer from './components/QueryNormalizer/QueryNormalizer'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moviesData: [],
      currentPage: 1,
      loading: false,
      error: false,
      errorMessage: '',
      totalMovies: 0,
      searchQuery: '',
    }
    this.apiService = new APIService()
  }

  componentDidMount() {
    const { currentPage, searchQuery } = this.state
    this.loadMovies(currentPage, searchQuery)
  }

  loadMovies = (page, query) => {
    if (!query.trim()) {
      this.setState({ moviesData: [], loading: false, totalMovies: 0 })
      return
    }
    this.setState({ loading: true })
    this.apiService
      .getAllMovies(page, query)
      .then((data) => {
        this.setState({ moviesData: data.results, loading: false, totalMovies: data.total_results, error: false })
      })
      .catch(() => {
        this.onError(ErrorMessages.DATA_FETCH_ERROR)
      })
  }

  onError = (message) => {
    this.setState({ error: true, loading: false, errorMessage: message })
  }

  handlePageChange = (page) => {
    const { searchQuery } = this.state
    this.setState({ currentPage: page }, () => {
      this.loadMovies(page, searchQuery)
    })
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 }, () => {
      this.loadMovies(1, query)
    })
  }

  render() {
    const { moviesData, currentPage, loading, error, errorMessage, totalMovies } = this.state
    const errorMessageIndicator = error ? <ErrorIndicator message={errorMessage} /> : null
    const loadingIndicator = loading ? <Loader /> : null

    return (
      <div className="movies-app">
        <section className="main">
          <Header />
          <QueryNormalizer onSearch={this.handleSearch}>
            {(handleSearch) => <SearchForm onSearch={handleSearch} />}
          </QueryNormalizer>
          {errorMessageIndicator}
          {loadingIndicator}
          {!loading && !error && <MovieList movies={moviesData} />}
          <MoviesPagination
            currentPage={currentPage}
            totalMovies={totalMovies}
            moviesPerPage={20}
            onPageChange={this.handlePageChange}
          />
        </section>
      </div>
    )
  }
}
