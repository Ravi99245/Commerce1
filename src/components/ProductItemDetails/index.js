import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusText = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusText.initial,
    similarProducts: [],
    productDetails: {},
    numberOfProducts: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
    this.setState({apiStatus: apiStatusText.loading})
  }

  getProductItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        availability: fetchedData.availability,
        rating: fetchedData.rating,
      }
      const similarProductsData = fetchedData.similar_products
      console.log(similarProductsData)
      const updatedSimilarProductsData = similarProductsData.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        title: eachItem.title,
        style: eachItem.style,
        price: eachItem.price,
        description: eachItem.description,
        brand: eachItem.brand,
        totalReviews: eachItem.total_reviews,
        rating: eachItem.rating,
        availability: eachItem.availability,
      }))
      console.log(updatedSimilarProductsData)
      this.setState({
        apiStatus: apiStatusText.success,
        productDetails: updatedData,
        similarProducts: updatedSimilarProductsData,
      })
    } else {
      this.setState({apiStatus: apiStatusText.failure})
    }
  }

  decreaseQuantity = () => {
    const {numberOfProducts} = this.state
    if (numberOfProducts > 1) {
      this.setState(
        prevState => ({
          numberOfProducts: prevState.numberOfProducts - 1,
        }),
        this.getProductItemDetails,
      )
    } else {
      this.setState({numberOfProducts: 1})
    }
  }

  increaseQuantity = () => {
    this.setState(prevState => ({
      numberOfProducts: prevState.numberOfProducts + 1,
    }))
  }

  renderProductItem = () => {
    const {similarProducts, productDetails, numberOfProducts} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      availability,
      rating,
    } = productDetails

    return (
      <div className="content-container">
        <div className="product-details-container">
          <img src={imageUrl} className="product-image" alt="product" />
          <div className="product-item-details-container">
            <h1 className="product-item-title">{title}</h1>
            <p className="product-item-price">Rs {price}/- </p>
            <div className="rating-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  className="star"
                  alt="start"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">
              <span className="spanElement">Available: </span>
              {availability}
            </p>
            <p className="availability">
              <span className="spanElement">Brand: </span>
              {brand}
            </p>
            <hr className="line" />
            <div className="no-of-products">
              <button
                className="minus-button"
                type="button"
                aria-label="Decrease quantity"
                onClick={this.decreaseQuantity}
                data-testid="minus"
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="number">{numberOfProducts}</p>
              <button
                className="minus-button"
                type="button"
                aria-label="Decrease quantity"
                onClick={this.increaseQuantity}
                data-testid="plus"
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-heading">Similar Products</h1>
          <div className="similarProducts">
            {similarProducts.map(eachItem => (
              <SimilarProductItem key={eachItem.id} productItem={eachItem} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  changeApiStatus = () => {
    console.log(this.props)
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="product-failure-heading">Product Not Found</h1>
      <button
        className="continue-shopping-button"
        type="button"
        onClick={this.changeApiStatus}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusText.success:
        return this.renderProductItem()
      case apiStatusText.loading:
        return this.renderLoadingView()
      case apiStatusText.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-container">
        <Header />
        <div className="content-container">
          {this.renderProductItemDetails()}
        </div>
      </div>
    )
  }
}

export default ProductItemDetails
