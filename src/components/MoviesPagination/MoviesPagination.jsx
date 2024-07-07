import { Pagination } from 'antd'
import PropTypes from 'prop-types'

export default function MoviesPagination({ currentPage, totalMovies, handlePageChange }) {
  return (
    <Pagination
      current={currentPage}
      total={totalMovies}
      onChange={handlePageChange}
      showSizeChanger={false}
      pageSize={20}
    />
  )
}
MoviesPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalMovies: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
}
