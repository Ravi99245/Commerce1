import './index.css'

const SimilarProductItem = props => {
  const {productItem} = props
  const {title, price, rating, imageUrl, brand} = productItem

  return (
    <div className="similar-product-container">
      <img
        src={imageUrl}
        className="similar-product-image"
        alt={`similar product ${title}`}
      />
      <h1 className="similar-products-title">{title}</h1>
      <p className="similar-products-brand">by {brand}</p>
      <div className="similar-products-rating">
        <h1 className="similar-products-price">Rs {price}/- </h1>
        <div className="similar-rating-container">
          <p className="rating1">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            className="star1"
            alt="start"
          />
        </div>
      </div>
    </div>
  )
}

export default SimilarProductItem
