import { Component } from 'react'
import './App.scss'
import { Tabs, Pagination } from 'antd'

import SearchForm from './components/SearchForm/SearchForm'
import MoviesList from './components/MoviesList/MoviesList'
import APIService from './components/service/APIService'
import { DataProvider } from './components/DataContext/DataContext'
import ErrorMessages from './components/ErrorMessages/ErrorMessages'
import MovieRating from './components/MovieRating/MovieRating'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      activeTab: '1',
      loading: false,
      errorMessage: '',
      guestSessionId: null,
      // searchTab
      moviesData: [],
      searchPage: 1,
      searchTotalMovies: 0,
      searchQuery: '',
      searchError: false,
      searchMoviesLoaded: false,

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
    window.addEventListener('wheel', this.handleWheel, { passive: true })
    this.checkGuestSession()
  }

  checkGuestSession = async () => {
    const storedSession = localStorage.getItem('guestSession')
    if (storedSession) {
      const sessionData = JSON.parse(storedSession)
      if (new Date(sessionData.expires_at) > new Date()) {
        this.setState({ guestSessionId: sessionData.guest_session_id })
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
    this.setState({ searchQuery: value, searchPage: 1, emptyResults: false }, () => this.loadMovies(value, 1))
  }

  handlePageChange = (page) => {
    const { activeTab, searchQuery } = this.state
    if (activeTab === '1') {
      this.setState({ searchPage: page }, () => this.loadMovies(searchQuery, page))
    } else {
      this.setState({ ratedPage: page }, () => this.loadMovies('', page, true))
    }
    window.scrollTo(0, 0)
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

    try {
      let data
      if (isRated) {
        const { guestSessionId } = this.state
        data = await this.apiService.getRatedMovies(guestSessionId, page)
        this.setState({
          ratedMovies: data.results,
          ratedError: false,
          ratedMoviesLoaded: true,
          ratedTotalMovies: data.totalResults,
        })
      } else {
        const { ratedMovies } = this.state
        data = await this.apiService.getAllMovies(query, page)
        this.setState({
          moviesData: MovieRating.mergeRatings(data.results, ratedMovies),
          searchError: false,
          searchMoviesLoaded: true,
          searchTotalMovies: data.totalResults,
        })
      }
    } catch (error) {
      if (isRated) {
        this.onError('2', ErrorMessages.DATA_FETCH_ERROR)
      } else {
        this.onError('1', ErrorMessages.DATA_FETCH_ERROR)
      }
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
      console.log(`Ошибка выставления рейтинга: ${error}`)
    }
  }

  render() {
    const {
      activeTab,
      loading,
      emptyResults,
      errorMessage,
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

    const items = [
      {
        label: 'Search',
        key: '1',
      },
      { label: 'Rated', key: '2' },
    ]

    return (
      <section className="movies-app">
        <Tabs
          destroyInactiveTabPane
          activeKey={activeTab}
          onChange={(key) => this.setActiveTab(key)}
          centered
          items={items}
        />
        {activeTab === '1' && <SearchForm searchQuery={searchQuery} onSearch={this.handleSearch} />}
        <DataProvider value={movies}>
          <MoviesList
            className="movies-list"
            loading={loading}
            emptyResults={emptyResults}
            error={error}
            errorMessage={errorMessage}
            onRate={this.handleRate}
            activeTab={activeTab}
          />
        </DataProvider>
        {movies.length !== 0 && !loading && (
          <Pagination
            current={currentPage}
            pageSize={20}
            total={totalMovies}
            onChange={this.handlePageChange}
            showSizeChanger={false}
          />
        )}
      </section>
    )
  }
}
