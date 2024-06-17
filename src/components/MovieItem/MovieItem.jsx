import { Card, Tag, Row, Col, Rate } from 'antd'
import { format } from 'date-fns'

import truncateText from '../truncateText/truncateText'

const { Meta } = Card

export default function MovieItem({
  title = null,
  description = null,
  image,
  genre = null,
  id = null,
  date = null,
  rating = null,
}) {
  const formattedDate = date ? format(new Date(date), 'dd MMMM yyyy') : 'No date'
  const truncatedDescription = truncateText(description, 208)
  return (

    <Card hoverable className="movies-card" key={id}>
      <Row className="movies-card__container">
        <Col className="movies-card__image">
          <img src={image} alt={title} />
        </Col>

        <Col className="movies-card__text">
          <Meta title={title} description={formattedDate} />
          <div className="movies-card__genre">
            {/* {genre.map((genreItem) => ( */}
            <Tag key="genre">{genre}</Tag>
            {/* ))} */}
          </div>
          <p className="movies-card__description">{truncatedDescription}</p>
          <div className="movies-card__rating">
            <Rate defaultValue={rating} count={10} />
          </div>
        </Col>
      </Row>
    </Card>
  )
}
