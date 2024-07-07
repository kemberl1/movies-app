import { Alert } from 'antd'
import { PropTypes } from 'prop-types'

import ErrorIcon from './ErrorIcon.png'

export default function ErrorIndicator({ message = 'An error occurred' }) {
  return (
    <div className="error-indicator">
      <img src={ErrorIcon} alt="error icon" />
      <Alert message="Error" description={message} type="error" showIcon />
    </div>
  )
}
ErrorIndicator.propTypes = {
  message: PropTypes.string.isRequired,
}
