import React, { useEffect, useState } from 'react';
import './ProductDetails.css';
import { useLocation, useHistory } from 'react-router-dom';
import Nav from './Nav';
import { IonCard, IonCardContent, IonContent, IonIcon, IonLabel, IonProgressBar } from '@ionic/react';
import { useCart } from '../contexts/CartContext';
import { bagHandle } from 'ionicons/icons';

interface Review {
  username: string;
  comment: string;
  rating: number;
}

interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  img: string;
  description: string;
  stockStatus: string;
  rating: number;
  reviews: Review[];
}

const ProductDetails: React.FC = () => {
  const location = useLocation<{ product: Product }>();
  const history = useHistory();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReviewMode, setReviewMode] = useState(true); // State for toggling review section
  const { addToCart } = useCart();

  useEffect(() => {
    if (location.state && location.state.product) {
      setProduct(location.state.product);
      setError(null);
    } else {
      setError('Product not found.');
    }
  }, [location]);

  const handleBackButton = () => {
    history.goBack();
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleBackButton}>Go Back</button>
      </div>
    );
  }

  if (product === null) {
    return <p>Loading product details...</p>;
  }

  return (
    <IonContent>
      <div className="product-container">
        <div className="product-header">
          <button className="back-button" onClick={handleBackButton}>&lt;</button>
          <div className="icons">
            <i className="heart-icon">❤️</i>
            <i className="share-icon">🔗</i>
          </div>
        </div>

        <div className="product-image">
          <img src={product.img} onClick={openModal} alt={product.name} />
        </div>

        <div className="product-info">
          <h1 className="product-brand">{product.name}</h1>
          <p className="product-title">{product.description}</p>
          <div className="rating">
            <span>{product.rating} ★</span>
            <span>({product.reviews.length})</span>
          </div>
          <div className="product-pricing">
            <span className="current-price">₹{product.price}</span>
            <span className="original-price">₹{product.price * 2}</span>
            <span className="discount">50% OFF</span>
          </div>
          <p className="tax-inclusion">inclusive of all taxes</p>
          <p className="people-bought">75 people bought this in the last 7 days</p>
          <div className="tribe-info">
            <span className="tribe-price">₹{(product.price * 0.9).toFixed(2)}</span>
            <span className="tribe-discount">Save Extra ₹40 with TriBe and enjoy FREE delivery</span>
            <button className="get-tribe">Get TriBe</button>
          </div>
        </div>

        <button className="add-to-bag" onClick={() => addToCart(product)}><IonIcon slot="start" icon={bagHandle}></IonIcon>ADD TO BAG</button>

        <IonCard className="review-card">
      <IonCardContent>
        <IonLabel className="reviews-header">Product Reviews</IonLabel>
        <div className="rating-summary">
          <h2>4.5</h2>
          <span>8M+ ratings</span>
          <IonLabel className="recommendation">90% of verified buyers recommend this brand</IonLabel>
        </div>

        <div className="progress-bars">
          <div className="progress-item">
            <span>5 ★</span>
            <IonProgressBar value={0.75} />
            <span>(6M+)</span>
          </div>
          <div className="progress-item">
            <span>4 ★</span>
            <IonProgressBar value={0.25} />
            <span>(2M+)</span>
          </div>
          <div className="progress-item">
            <span>3 ★</span>
            <IonProgressBar value={0.1} />
            <span>(715k+)</span>
          </div>
          <div className="progress-item">
            <span>2 ★</span>
            <IonProgressBar value={0.05} />
            <span>(35k+)</span>
          </div>
          <div className="progress-item">
            <span>1 ★</span>
            <IonProgressBar value={0.03} />
            <span>(64k+)</span>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  ;

        {/* Rating Section */}
        {/* <div className="rating-section">
          <div className="review-toggle">
            <button 
              className={`toggle-button ${isReviewMode ? 'active' : ''}`} 
              onClick={() => setReviewMode(true)}
            >
              Product Reviews
            </button>
            <button 
              className={`toggle-button ${!isReviewMode ? 'active' : ''}`} 
              onClick={() => setReviewMode(false)}
            >
              Write Review
            </button>
          </div>

          {isReviewMode ? (
            <div className="product-review">
              <h3>{product.rating} ({product.reviews.length} ratings)</h3>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="star-rating">
                  <div className="star-label">{star} ★</div>
                  <div className="star-bar">
                    <div 
                      className="star-filled" 
                      style={{ width: `${(star === 5 ? 308 : star === 4 ? 138 : star === 3 ? 60 : star === 2 ? 1 : 6) / product.reviews.length * 100}%` }}
                    />
                  </div>
                  <span className="star-count">{(star === 5 ? 308 : star === 4 ? 138 : star === 3 ? 60 : star === 2 ? 1 : 6)} ratings</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="write-review">
              <h3>Write a Review</h3>
              <textarea placeholder="Write your review here..." />
              <div className="rating-input">
                <label>Rating:</label>
                <select>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <button className="submit-review">Submit Review</button>
            </div>
          )}
        </div> */}

        {/* Modal for displaying the image */}
        {isModalOpen && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-button" onClick={closeModal}>&times;</span>
              <img src={product.img} alt={product.name} />
            </div>
          </div>
        )}

        <Nav />

        
      </div>
    </IonContent>
  );
};

export default ProductDetails;
