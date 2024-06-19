import { Component } from 'react'

export default class QueryNormalizer extends Component {
  static normalizeQuery = (query) => query.trim().replace(/\s{2,}/g, ' ')

  handleSearch = (query) => {
    const { onSearch } = this.props

    if (query.trim('') !== '') {
      const normalizeQuery = QueryNormalizer.normalizeQuery(query)
      onSearch(normalizeQuery)
    } else {
      onSearch('')
    }
  }

  render() {
    const { children } = this.props
    return children(this.handleSearch)
  }
}
