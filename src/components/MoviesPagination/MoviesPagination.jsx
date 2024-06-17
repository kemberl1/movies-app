import { Pagination, Row } from 'antd'

export default function MoviesPagination({ currentPage, totalMovies, moviesPerPage, onPageChange }) {
  return (
    <Pagination
      className="movies-pagination"
      current={currentPage}
      total={totalMovies}
      pageSize={moviesPerPage}
      onChange={onPageChange}
    />
  )
}
