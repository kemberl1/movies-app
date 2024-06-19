import { Input } from 'antd'
import { Component } from 'react'
import { debounce } from 'lodash'

export default class SearchForm extends Component {
  constructor(props) {
    super(props)
    this.searchText = 'Type to search...'
    this.state = {
      label: '',
    }
    const { onSearch } = this.props
    this.debounceSearch = debounce(onSearch, 1000)
  }

  onLabelChange = (event) => {
    const { value } = event.target
    this.setState({ label: value })
    if (value.trim() !== '') {
      this.debounceSearch(value)
    } else {
      this.debounceSearch.cancel()
    }
  }

  render() {
    const { label } = this.state
    return <Input className="search-form" placeholder={this.searchText} onChange={this.onLabelChange} value={label} />
  }
}
