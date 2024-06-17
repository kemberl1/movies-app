export default class APIService {
  apiBase = 'https://api.themoviedb.org/3/search/movie?query=return&include_adult=false&language=en-US'

  imageURL = 'https://image.tmdb.org/t/p/w500'

  imageNoAvailable = 'https://via.placeholder.com/500x750?text=No+Image+Available'

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWUxMjgxOTRmMDk2N2ZhOTU5ZmI3YWQwMjc2OTY5MiIsInN1YiI6IjY2NmRkYzU4ZTAxZmQ2YTRmMmU0YTcxMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DG-yFuP6UlRWDE2slPN_QcPiVOXtf9mo6FRfdQL_LA0',
    },
  }

  async getResource() {
    const res = await fetch(this.apiBase, this.options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${this.apiBase} - status: ${res.status}`)
    }
    return res.json()
  }

  async getAllMovies() {
    const data = await this.getResource()
    return data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      image: movie.poster_path ? `${this.imageURL}${movie.poster_path}` : this.imageNoAvailable,
      genre: 'genre',
      date: movie.release_date,
      rating: movie.vote_average,
    }))
  }
}
