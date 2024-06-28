import { Component } from 'react'

import ErrorIndicator from '../ErrorIndicator/ErrorIndicator'
import ErrorMessages from '../ErrorMessages/ErrorMessages'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  componentDidCatch() {
    this.setState({ hasError: true })
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state
    const errorMessage = ErrorMessages.DEFAULT_ERROR
    if (hasError) {
      return <ErrorIndicator message={errorMessage} />
    }
    return children
  }
}
