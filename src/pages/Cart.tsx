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
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonLoading,
  IonToast,
  IonInput,
} from '@ionic/react';
import { homeOutline, trashOutline, chevronDown, chevronUp } from 'ionicons/icons';
import './Cart.css';
import { useHistory } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { db, auth, validateCoupon } from '../firebaseConfig'; // Import validateCoupon
import { collection, addDoc } from 'firebase/firestore';
import { Order } from '../types/Order'; // Import Order types

const Cart: React.FC = () => {
  const history = useHistory();
  const { cartItems, removeFromCart, updateCartItem, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; color?: string }>({ show: false, message: '' });
  const [showOrderSummary, setShowOrderSummary] = useState(false); // State for toggling order summary
  const [couponCode, setCouponCode] = useState<string>(''); // State for coupon code
  const [discount, setDiscount] = useState<number>(0); // State for discount amount

  // Navigate back to home page
  const goToHomePage = () => {
    history.push('/home');
  };

  // Handle size selection
  const handleSizeSelect = (productId: number, size: string) => {
    updateCartItem(productId, { selectedSize: size });
  };

  // Handle quantity selection
  const handleQuantitySelect = (productId: number, quantity: number) => {
    updateCartItem(productId, { quantity });
  };

  // Remove item from the cart
  const removeItem = (productId: number) => {
    removeFromCart(productId);
  };

  // Calculate total price
  const calculateTotal = () => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.price * (item.quantity || 1);
      return acc + price;
    }, 0);
    return total - discount; // Apply discount
  };

  // Handle coupon code submission
  const handleApplyCoupon = async () => {
    const coupon = await validateCoupon(couponCode);
    if (coupon) {
      setDiscount(coupon.discount); // Set discount if coupon is valid
      setToast({ show: true, message: `Coupon applied! Discount: ₹${coupon.discount}`, color: 'success' });
    } else {
      setToast({ show: true, message: 'Invalid or expired coupon code.', color: 'danger' });
    }
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    const user = auth.currentUser;
    if (!user) {
      setToast({ show: true, message: 'You must be logged in to place an order.', color: 'warning' });
      history.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      setToast({ show: true, message: 'Your cart is empty.', color: 'warning' });
      return;
    }

    setLoading(true);

    const order: Order = {
      userId: user.uid,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        img: item.img,
        price: item.price,
        quantity: item.quantity || 1,
        selectedSize: item.selectedSize || 'None',
      })),
      total: calculateTotal(),
      status: 'Pending',
    };

    try {
      const ordersCollection = collection(db, 'orders');
      await addDoc(ordersCollection, order);
      
      setToast({ show: true, message: 'Order placed successfully!', color: 'success' });
      clearCart();
      history.push('/home');
    } catch (error: any) {
      console.error('Error placing order:', error);
      setToast({ show: true, message: 'Failed to place order. Please try again.', color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message={'Placing your order...'} />
        <IonToast
          isOpen={toast.show}
          onDidDismiss={() => setToast({ ...toast, show: false })}
          message={toast.message}
          color={toast.color}
          duration={3000}
        />
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          <>
            <IonList>
              {cartItems.map((item) => (
                <IonCard key={item.id} className="cartCard">
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
                      <IonButton onClick={() => removeItem(item.id)} className="delete" color="danger">
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                    </IonItem>

                    {/* Size options */}
                    <div className="cart-item-sizes">
                      {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                        <div
                          key={size}
                          className={`size-box ${item.selectedSize === size ? 'selected' : ''}`}
                          onClick={() => handleSizeSelect(item.id, size)}
                        >
                          {size}
                        </div>
                      ))}
                    </div>

                    {/* Quantity options */}
                    <div className="cart-item-quantities">
                      {[1, 2, 3].map((quantity) => (
                        <div
                          key={quantity}
                          className={`quantity-box ${item.quantity === quantity ? 'selected' : ''}`}
                          onClick={() => handleQuantitySelect(item.id, quantity)}
                        >
                          {quantity}
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>

            {/* Coupon input field */}
            <div className="coupon-container">
              <IonInput
                value={couponCode}
                placeholder="Enter coupon code"
                onIonChange={(e) => setCouponCode(e.detail.value!)}
                clearInput
              />
              <IonButton onClick={handleApplyCoupon}>Apply Coupon</IonButton>
            </div>

            {/* Bill-like structure for total price with toggle */}
            <div className="cart-bill">
              <div className="order-summary-header" onClick={() => setShowOrderSummary(!showOrderSummary)}>
                <h2>Order Summary</h2>
                <IonIcon
                  icon={showOrderSummary ? chevronUp : chevronDown}
                  className={`toggle-icon ${showOrderSummary ? 'rotated' : ''}`}
                />
              </div>
              {showOrderSummary && (
                <table className="bill-table" color="light">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity || 1}</td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>₹{(item.price * (item.quantity || 1)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Subtotal</td>
                      <td style={{ fontWeight: 'bold' }}>₹{calculateTotal() + discount}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Discount</td>
                      <td style={{ fontWeight: 'bold' }}>- ₹{discount}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                      <td style={{ fontWeight: 'bold' }}>₹{calculateTotal().toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {/* Place Order Button */}
            <div className="cart-footer">
              <IonButton shape="round" className="place-order-btn" expand="full" onClick={handlePlaceOrder}>
                Place Order
              </IonButton>
              <IonButton shape="round" expand="full" color="light" onClick={goToHomePage}>
                <IonIcon icon={homeOutline} />
                Go to Home
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Cart;
