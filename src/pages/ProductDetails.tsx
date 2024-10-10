import React, { useEffect, useState } from 'react';
import './ProductDetails.css';
import { useLocation, useHistory } from 'react-router-dom';
import Nav from './Nav';
import { IonContent } from '@ionic/react';
import { useCart } from '../contexts/CartContext'; // Import useCart

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
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const { addToCart } = useCart(); // Use cart context

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

        <button className="add-to-bag" onClick={() => addToCart(product)}>ADD TO BAG</button>
      </div>
      
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
    </IonContent>
  );
};

export default ProductDetails;
