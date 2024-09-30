import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { homeOutline, trashOutline } from 'ionicons/icons';
import './Cart.css';

const Cart: React.FC = () => {
  const history = useHistory();
  const location = useLocation<any>();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);

  // Navigate back to home page
  const goToHomePage = () => {
    history.push('/home');
  };

  // Handle size selection
  const handleSizeSelect = (itemIndex: number, size: string) => {
    const updatedItems = cartItems.map((item: any, index: number) =>
      index === itemIndex ? { ...item, selectedSize: size } : item
    );
    setCartItems(updatedItems);
  };

  // Remove item from the cart
  const removeItem = (itemIndex: number) => {
    const updatedItems = cartItems.filter((_: any, index: number) => index !== itemIndex);
    setCartItems(updatedItems);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <IonList>
            {cartItems.map((item: any, index: number) => (
              <IonCard key={index} className="cartCard">
                
                <IonCardContent>
                  <IonItem>
                    <IonThumbnail slot="start">
                      <img src={item.img} alt={item.name} />
                    </IonThumbnail>
                    <IonLabel>
                      <h3>{item.name}</h3>
                      <h4>Quantity: {item.quantity || 1}</h4>
                      <h5>Selected Size: {item.selectedSize || 'None'}</h5>
                    </IonLabel>
                    <IonCardHeader className='deleteBox'>
                  <IonButton onClick={() => removeItem(index)} className='delete' color="danger">
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </IonCardHeader>
                  </IonItem>

                  {/* Size options */}
                  <div className="cart-item-sizes">
                    {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                      <div
                        key={size}
                        className={`size-box ${item.selectedSize === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(index, size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}

        {/* Place Order Button */}
        <div className="cart-footer">
          <IonButton className="place-order-btn" expand="full">
            Place Order
          </IonButton>
        </div>

        <IonButton color="light" onClick={goToHomePage}>
          <IonIcon icon={homeOutline} />
          Continue Shopping
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Cart;
