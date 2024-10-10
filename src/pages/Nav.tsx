import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';  
import { useHistory } from 'react-router-dom';
import { cartOutline, homeOutline } from 'ionicons/icons';
import './Nav.css';
import { useCart } from '../contexts/CartContext'; // Import useCart

const Nav: React.FC = () => {
  const history = useHistory();
  const { cartItems } = useCart(); // Use cart context

  const goToHomePage = () => {
    history.push('/home');
  };

  const goToCartPage = () => {
    history.push('/cart');
  };

  return (
    <div className="nav-buttons">
      <IonButton color="light" className="cart-btn" onClick={goToCartPage}>
        <IonIcon icon={cartOutline} />
        ({cartItems.length}) {/* Display cart items count */}
      </IonButton>
      <IonButton color="light" className="cart-btn" onClick={goToHomePage}>
        <IonIcon icon={homeOutline} />
      </IonButton>
    </div>
  );
};

export default Nav;
