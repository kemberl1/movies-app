import { Component } from 'react'
import './App.scss'
import { Tabs, Pagination } from 'antd'

import SearchForm from './components/SearchForm/SearchForm'
import MoviesList from './components/MoviesList/MoviesList'
import APIService from './components/service/APIService'
import { DataProvider } from './components/DataContext/DataContext'
import ErrorMessages from './components/ErrorMessages/ErrorMessages'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      error: false,
      errorMessage: '',
      searchQuery: '',
      activeTab: '1',
      moviesData: [],
      ratedMovies: [],
      guestSessionId: null,
      currentPage: 1,
      totalMovies: 0,
      emptyResults: false,
    }
    this.apiService = new APIService()
  }

  async componentDidMount() {
    window.addEventListener('wheel', this.handleWheel, { passive: true })

    const storedSession = localStorage.getItem('guestSession')
    if (storedSession) {
      const sessionData = JSON.parse(storedSession)
      if (new Date() < new Date(sessionData.expires_at)) {
        this.setState({ guestSessionId: sessionData.guest_session_id })
        return
      }
    }

    try {
      const data = await this.apiService.createGuestSession()
      this.setState({ guestSessionId: data.guest_session_id })
      localStorage.setItem('guestSession', JSON.stringify(data))
    } catch (error) {
      this.onError(ErrorMessages.SESSION_CREATION_ERROR)
    }
  }

  handleSearch = (value) => {
    this.setState({ searchQuery: value, currentPage: 1, emptyResults: false }, () => this.loadMovies(value, 1))
  }

  handlePageChange = (page) => {
    const { searchQuery } = this.state
    this.setState({ currentPage: page }, () => this.loadMovies(searchQuery, page))
    window.scrollTo(0, 0)
  }

  onError = (message) => {
    this.setState({ error: true, loading: false, errorMessage: message })
  }

  setActiveTab(key) {
    const { searchQuery, currentPage } = this.state
    console.log(key)
    this.setState({ activeTab: key }, () => {
      if (key === '1') {
        this.loadMovies(searchQuery, currentPage)
      } else if (key === '2') {
        this.loadMovies('', currentPage, true)
      }
    })
  }

  loadMovies = async (query = '', page = 1, isRated = false) => {
    this.setState({ loading: true })

    try {
      let data
      if (isRated) {
        const { guestSessionId } = this.state
        data = await this.apiService.getRatedMovies(guestSessionId, page)
        this.setState({ ratedMovies: data.results })
      } else {
        data = await this.apiService.getAllMovies(query, page)
        this.setState({ moviesData: data.results })
      }
      this.setState({
        emptyResults: data.totalResults === 0,
        totalMovies: data.totalResults,
      })
    } catch (error) {
      this.onError(ErrorMessages.DATA_FETCH_ERROR)
    } finally {
      this.setState({ loading: false })
    }
  }

  handleRate = async (movieId, rating) => {
    const { guestSessionId, activeTab, moviesData, ratedMovies } = this.state
    try {
      await this.apiService.rateMovie(guestSessionId, movieId, rating)

      const updateMovies = (movies) =>
        movies.map((movie) => {
          if (movie.id === movieId) {
            return { ...movie, userRating: rating }
          }
          return movie
        })

      if (activeTab === '1') {
        this.setState({
          moviesData: updateMovies(moviesData),
        })
      } else if (activeTab === '2') {
        this.setState({ ratedMovies: updateMovies(ratedMovies) })
      }
    } catch (error) {
      console.log(`Ошибка выставления рейтинга: ${error}`)
    }
  }

  render() {
    const {
      activeTab,
      moviesData,
      ratedMovies,
      totalMovies,
      currentPage,
      searchQuery,
      loading,
      error,
      emptyResults,
      errorMessage,
    } = this.state

    const movies = activeTab === '1' ? moviesData : ratedMovies

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
          />
        </DataProvider>
        {movies.length !== 0 && !loading && (
          <Pagination
            current={currentPage}
            total={totalMovies}
            onChange={this.handlePageChange}
            showSizeChanger={false}
          />
        )}
      </section>
    )
  }
}
