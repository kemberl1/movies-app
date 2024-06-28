import { Card, Rate, Tag } from 'antd'
import Meta from 'antd/es/card/Meta'
import { format } from 'date-fns'
import { useMediaQuery } from 'react-responsive'

export default function MovieItem({ movie }) {
  const { title, description, image, genre, date, rating } = movie
  const formattedDate = date ? format(new Date(date), 'dd MMMM yyyy') : 'No date'
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  const renderImage = () => (
    <div className="movie__image">
      <img src={image} alt={title} />
    </div>
  )

  const handleRate = (value) => {
    console.log(value)
  }

  return (
    <Card className="movie" hoverable>
      <div className="movie-container">
        {isDesktop && renderImage()}
        <div className="movie__meta">
          <section className="movie__meta-top " data-rating={parseFloat(rating.toFixed(1))}>
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
          <Meta className="movie__meta-description" description={description} />
          <Rate className="movie__meta-rating" defaultValue={0} count={10} onChange={handleRate} />
        </div>
      </div>
    </Card>
  )
}
