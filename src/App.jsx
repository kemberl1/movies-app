import { Component } from 'react'
import './App.scss'
import { Tabs, Pagination } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'

import SearchForm from './components/SearchForm/SearchForm'
import MoviesList from './components/MoviesList/MoviesList'
import APIService from './components/service/APIService'
import { DataProvider } from './components/DataContext/DataContext'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      searchQuery: '',
      activeTab: '1',
      moviesData: [],
      ratedMovies: [],
      guestSessionId: null,
      currentPage: 1,
      totalMovies: 0,
      totalPages: 0,
    }
    this.apiService = new APIService()
  }

  async componentDidMount() {
    window.addEventListener('wheel', this.handleWheel, { passive: true })
    try {
      const data = await this.apiService.createGuestSession()
      this.setState({ guestSessionId: data.guest_session_id })
    } catch (error) {
      console.log(`Ошибка создания сессии ${error}`)
    }
  }

  handleSearch = (value) => {
    this.setState({ searchQuery: value, currentPage: 1 }, () => this.loadMovies(value, 1))
  }

  handlePageChange = (page) => {
    const { searchQuery } = this.state
    this.setState({ currentPage: page }, () => this.loadMovies(searchQuery, page))
    window.scrollTo(0, 0)
  }

  setActiveTab(key) {
    this.setState({ activeTab: key })
  }

  loadMovies = async (query = '', page = 1) => {
    try {
      this.setState({ loading: true })
      const data = await this.apiService.getAllMovies(query, page)
      this.setState({ moviesData: data.results, totalMovies: data.total_results, totalPages: data.total_pages })
    } catch (error) {
      console.log(error)
      console.log('Ошибка загрузки  moviesData')
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const {
      activeTab,
      moviesData,
      ratedMovies,
      totalMovies,
      guestSessionId,
      currentPage,
      totalPages,
      searchQuery,
      loading,
    } = this.state
    const movies = activeTab === '1' ? moviesData : ratedMovies
    return (
      <section className="movies-app">
        <Tabs activeKey={activeTab} onChange={(key) => this.setActiveTab(key)} centered>
          <TabPane tab="Search" key="1" />
          <TabPane tab="Rated" key="2" />
        </Tabs>
        {activeTab === '1' && <SearchForm searchQuery={searchQuery} onSearch={this.handleSearch} />}
        <DataProvider value={movies}>
          <MoviesList className="movies-list" loading={loading} />
        </DataProvider>
        {movies.length !== 0 && (
          <Pagination
            defaultCurrent={1}
            curren={currentPage}
            total={totalPages}
            onChange={this.handlePageChange}
            showSizeChanger={false}
          />
        )}
      </section>
    )
  }
}
