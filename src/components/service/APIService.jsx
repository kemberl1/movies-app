import { Component } from 'react'

export default class APIService extends Component {
  apiBase = 'https://api.themoviedb.org/3/'

  apiKey = 'eee128194f0967fa959fb7ad02769692'

  imageURL = 'https://image.tmdb.org/t/p/w500'

  imageNoAvailable = 'https://via.placeholder.com/500x750?text=No+Image+Available'

  static getResource = async (url, options = {}) => {
    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        throw new Error(`failed to fetch: ${res.status}`)
      }
      return await res.json()
    } catch (error) {
      throw new Error(`Could not fetch ${url}, error: ${error.message}`)
    }
  }

  transformMovieData = (data) => ({
    results: data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      image: movie.poster_path ? `${this.imageURL}${movie.poster_path}` : this.imageNoAvailable,
      genre: movie.genre_ids,
      date: movie.release_date,
      globalRating: movie.vote_average,
      userRating: movie.rating || 0,
    })),
    totalResults: data.total_results,
    totalPages: data.total_pages,
  })

  createGuestSession = async () => {
    try {
      const url = `${this.apiBase}authentication/guest_session/new?api_key=${this.apiKey}`
      return APIService.getResource(url)
    } catch (error) {
      throw new Error(`createGuestSession: ${error.status}`)
    }
  }

  getAllMovies = async (query, page = 1) => {
    try {
      const url = `${this.apiBase}search/movie?query=${query}&include_adult=false&language=en-US&page=${page}&api_key=${this.apiKey}`
      const data = await APIService.getResource(url)

      return this.transformMovieData(data)
    } catch (error) {
      throw new Error(`getAllMovies: ${error}`)
    }
  }

  getRatedMovies = async (sessionId, page = 1) => {
    try {
      const url = `${this.apiBase}guest_session/${sessionId}/rated/movies?api_key=${this.apiKey}&language=en-US&page=${page}&sort_by=created_at.asc`
      const data = await APIService.getResource(url)
      return this.transformMovieData(data)
    } catch (error) {
      throw new Error(`getRatedMovies: ${error}`)
    }
  }

  rateMovie = async (sessionId, movieId, rating) => {
    const url = `${this.apiBase}movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${sessionId}`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        value: rating,
      }),
    }
    return APIService.getResource(url, options)
  }

  getGenres = async () => {
    const url = `${this.apiBase}genre/movie/list?api_key=${this.apiKey}&language=en-US`
    try {
      const data = await APIService.getResource(url)
      return data
    } catch (error) {
      throw new Error(`getGenres: ${error}`)
    }
  }
}
