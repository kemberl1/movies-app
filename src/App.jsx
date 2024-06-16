import { Component } from 'react'

import './App.scss'
import MovieList from './components/MoviesList/MoviesList'
import APIService from './components/service/APIService'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moviesData: [],
    }
    this.apiService = new APIService()
  }

  componentDidMount() {
    this.apiService.getResource().then((moviesData) => {
      this.setState({ moviesData })
    })
  }

  render() {
    const { moviesData } = this.state
    return (
      <div className="movies-app">
        <section className="main">
          <MovieList movies={moviesData} />
        </section>
      </div>
    )
  }
}
