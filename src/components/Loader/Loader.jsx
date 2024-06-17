import { Spin } from 'antd'

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <Spin size="large" />
      </div>
    </div>
  )
}
