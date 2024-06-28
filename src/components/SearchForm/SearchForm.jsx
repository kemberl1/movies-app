import { Input } from 'antd'
import { Component } from 'react'
import { debounce } from 'lodash'

export default class SearchForm extends Component {
  constructor(props) {
    super(props)
    this.searchText = 'Type to search...'
    this.state = {
      searchQuery: props.searchQuery,
    }
    const { onSearch } = this.props
    this.debounceSearch = debounce(onSearch, 1000)
  }

  handleInputChange = (event) => {
    const { value } = event.target
    this.setState({ searchQuery: value })
    if (value.trim() !== '') {
      this.debounceSearch(value)
    } else {
      this.debounceSearch.cancel()
    }
  }

  render() {
    const { searchQuery } = this.state
    return (
      <Input
        className="search-form"
        placeholder={this.searchText}
        value={searchQuery}
        onChange={this.handleInputChange}
      />
    )
  }
}
