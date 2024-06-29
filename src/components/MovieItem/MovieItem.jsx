import { Card, Rate, Tag } from 'antd'
import Meta from 'antd/es/card/Meta'
import { format } from 'date-fns'
import { useMediaQuery } from 'react-responsive'

import MovieRating from '../MovieRating/MovieRating'
import truncateText from '../truncateText/truncateText'

export default function MovieItem({ movie, onRate }) {
  const { title, description, image, genre, date, globalRating, id, userRating } = movie
  const formattedDate = date ? format(new Date(date), 'dd MMMM yyyy') : 'No date'
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  const renderImage = () => (
    <div className="movie__image">
      <img src={image} alt={title} />
    </div>
  )

  return (
    <Card className="movie" hoverable>
      <div className="movie-container">
        {isDesktop && renderImage()}
        <div className="movie__meta">
          <section className="movie__meta-top " data-rating={parseFloat(globalRating.toFixed(1))}>
            {!isDesktop && renderImage()}
            <Meta
              className="movie__meta-info"
              title={title}
              description={
                <>
                  <div className="movie__meta-date">{formattedDate}</div>
                  <Tag className="movie__meta-genre">{genre}</Tag>
                  <Tag className="movie__meta-genre">{genre}</Tag>
                </>
              }
            />
          </section>
          <Meta className="movie__meta-description" description={truncateText(description, 120)} />
          <MovieRating className="movie__meta-rating" id={id} value={userRating} count={10} onRate={onRate} />
        </div>
      </div>
    </Card>
  )
}
