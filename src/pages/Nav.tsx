import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { cartOutline, homeOutline } from 'ionicons/icons';
import './Nav.css';
 
interface NavProps {
  cartItems: any[]; // Accept cartItems as a prop
}
 
const Nav: React.FC<NavProps> = ({ cartItems }) => {
  const history = useHistory();
 
  const goToHomePage = () => {
    history.push('/home');
  };
 
  const goToCartPage = () => {
    history.push({
      pathname: '/cart',
      state: { cartItems } // Passing cart items to the cart page
    });
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