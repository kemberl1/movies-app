import { Component } from 'react'
import './App.scss'
import { Tabs } from 'antd'

import SearchForm from './components/SearchForm/SearchForm'
import MoviesList from './components/MoviesList/MoviesList'
import { GenresProvider } from './components/Context/GenresContext'
import ErrorMessages from './components/ErrorMessages/ErrorMessages'
import MovieRating from './components/MovieRating/MovieRating'
import MoviesPagination from './components/MoviesPagination/MoviesPagination'
import APIService from './components/Service/APIService'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      activeTab: '1',
      loading: false,
      errorMessage: '',
      guestSessionId: null,
      genres: [],
      // searchTab
      moviesData: [],
      searchPage: 1,
      searchTotalMovies: 0,
      searchError: false,
      searchMoviesLoaded: false,
      searchQuery: '',
      // ratedTab
      ratedMovies: [],
      ratedPage: 1,
      ratedTotalMovies: 0,
      ratedError: false,
      ratedMoviesLoaded: false,
    }
    this.apiService = new APIService()
  }

  async componentDidMount() {
    try {
      const genresData = await this.apiService.getGenres()
      this.setState({ genres: genresData.genres })
    } catch (error) {
      this.onError('1', ErrorMessages.SESSION_CREATION_ERROR)
      this.onError('2', ErrorMessages.SESSION_CREATION_ERROR)
      throw new Error(error)
    }
    window.addEventListener('wheel', this.handleWheel, { passive: true })
    this.checkGuestSession()
  }

  checkGuestSession = async () => {
    const storedSession = localStorage.getItem('guestSession')
    if (storedSession) {
      const sessionData = JSON.parse(storedSession)
      if (new Date(sessionData.expires_at) > new Date()) {
        this.setState({ guestSessionId: sessionData.guest_session_id }, () => {
          this.loadMovies('', 1, true)
        })
      } else {
        await this.createGuestSession()
      }
    } else {
      await this.createGuestSession()
    }
  }

  createGuestSession = async () => {
    try {
      const data = await this.apiService.createGuestSession()
      this.setState({ guestSessionId: data.guest_session_id })
      localStorage.setItem('guestSession', JSON.stringify(data))
    } catch (error) {
      this.onError('1', ErrorMessages.SESSION_CREATION_ERROR)
      this.onError('2', ErrorMessages.SESSION_CREATION_ERROR)
    }
  }

  handleSearch = (value) => {
    const { searchError } = this.state
    if (searchError) {
      this.onError('1', ErrorMessages.DATA_FETCH_ERROR)
      return
    }
    this.setState({ searchQuery: value, searchPage: 1, emptyResults: false }, () => this.loadMovies(value, 1))
  }

  handlePageChange = (page) => {
    window.scrollTo(0, 0)
    const { activeTab, searchQuery } = this.state
    if (activeTab === '1') {
      this.setState({ searchPage: page }, () => this.loadMovies(searchQuery, page))
    } else {
      this.setState({ ratedPage: page }, () => this.loadMovies('', page, true))
    }
  }

  onError = (tab, message) => {
    if (tab === '1') {
      this.setState({ searchError: true, loading: false, errorMessage: message })
    } else if (tab === '2') {
      this.setState({ ratedError: true, loading: false, errorMessage: message })
    }
  }

  setActiveTab = (key) => {
    const { searchMoviesLoaded, ratedMoviesLoaded, searchQuery, searchPage, ratedPage } = this.state
    this.setState({ activeTab: key })
    if (key === '1' && !searchMoviesLoaded) {
      this.loadMovies(searchQuery, searchPage)
    } else if (key === '2' && !ratedMoviesLoaded) {
      this.loadMovies('', ratedPage, true)
    }
  }

  loadMovies = async (query = '', page = 1, isRated = false) => {
    this.setState({ loading: true })

    const { guestSessionId, ratedMovies } = this.state

    try {
      let data
      if (isRated) {
        data = await this.apiService.getRatedMovies(guestSessionId, page).catch((error) => {
          if (error.response?.status === 404) {
            this.setState({
              ratedError: false,
              ratedMoviesLoaded: true,
              ratedTotalMovies: 0,
            })
            return null
          }
          throw error
        })

        this.setState({
          ratedMovies: data.results,
          ratedError: false,
          ratedMoviesLoaded: true,
          ratedTotalMovies: data.totalResults,
        })
      } else {
        data = await this.apiService.getAllMovies(query, page)
        this.setState({
          moviesData: MovieRating.mergeRatings(data.results, ratedMovies),
          searchError: false,
          searchMoviesLoaded: true,
          searchTotalMovies: data.totalResults,
        })
      }
    } catch (error) {
      this.onError(isRated ? '2' : '1', ErrorMessages.DATA_FETCH_ERROR)
    } finally {
      this.setState({ loading: false })
    }
  }

  handleRate = async (movieId, rating) => {
    const { guestSessionId } = this.state
    try {
      await this.apiService.rateMovie(guestSessionId, movieId, rating)
      this.setState((prevState) => ({
        moviesData: MovieRating.updateMovieRating(prevState.moviesData, movieId, rating),
        ratedMovies: MovieRating.updateMovieRating(prevState.ratedMovies, movieId, rating),
        ratedMoviesLoaded: false,
        searchMoviesLoaded: false,
      }))
    } catch (error) {
      throw new Error(error)
    }
  }

  render() {
    const {
      activeTab,
      loading,
      emptyResults,
      errorMessage,
      genres,
      // searchTab
      moviesData,
      searchPage,
      searchTotalMovies,
      searchQuery,
      searchError,
      // ratedTab
      ratedMovies,
      ratedPage,
      ratedTotalMovies,
      ratedError,
    } = this.state

    const movies = activeTab === '1' ? moviesData : ratedMovies
    const currentPage = activeTab === '1' ? searchPage : ratedPage
    const error = activeTab === '1' ? searchError : ratedError
    const totalMovies = activeTab === '1' ? searchTotalMovies : ratedTotalMovies

    const tabsItems = [
      {
        label: 'Search',
        key: '1',
      },
      { label: 'Rated', key: '2' },
    ]

    return (
      <GenresProvider value={genres}>
        <section className="movies-app">
          <Tabs centered activeKey={activeTab} onChange={this.setActiveTab} items={tabsItems} />
          {activeTab === '1' && <SearchForm searchQuery={searchQuery} onSearch={this.handleSearch} />}
          <MoviesList
            className="movies-list"
            movies={movies}
            loading={loading}
            emptyResults={emptyResults}
            error={error}
            errorMessage={errorMessage}
            onRate={this.handleRate}
            activeTab={activeTab}
            searchQuery={searchQuery}
          />
          {movies.length !== 0 && !loading && (
            <MoviesPagination
              currentPage={currentPage}
              totalMovies={totalMovies}
              handlePageChange={this.handlePageChange}
            />
          )}
        </section>
      </GenresProvider>
    )
  }
}
