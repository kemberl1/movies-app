import { Input } from 'antd'
import React, { Component } from 'react'
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
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    this.inputRef.current.focus()
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
        ref={this.inputRef}
        className="search-form"
        placeholder={this.searchText}
        value={searchQuery}
        onChange={this.handleInputChange}
      />
    )
  }
}
