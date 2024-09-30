import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonToast,
  IonPopover,
} from '@ionic/react';
import { cameraOutline, cart, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Correct import
import { onAuthStateChanged } from 'firebase/auth';
import './Home.css';
import Nav from './Nav';
import Cart from './Cart';
import userProfile from './userProfile';

const Home: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]); // Cart items state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Auth state
  const [showToast, setShowToast] = useState<boolean>(false); // Toast visibility
  const [showPopover, setShowPopover] = useState(false); // For hover effect on profile icon
  const [username, setUsername] = useState<string>(''); // Username state
  const history = useHistory();

  // Dummy product data
  const products = [
    { id: 1, name: 'Product 1', code: 'P001', img: 'https://images.unsplash.com/photo-1485218126466-34e6392ec754?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, name: 'Product 2', code: 'P002', img: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', code: 'P003', img: 'https://images.unsplash.com/photo-1485218126466-34e6392ec754?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, name: 'Product 4', code: 'P004', img: 'https://via.placeholder.com/150' }
  ];

  useEffect(() => {
    // Set up the authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUsername(user.displayName || 'User'); // Assuming the display name is stored in user.displayName
      } else {
        setIsAuthenticated(false);
        setShowToast(true); // Show toast if not authenticated
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  // Add a product to the cart
  const addToCart = (product: any) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  // Handle navigation to login page
  const navigateToLogin = () => {
    history.push('/login');
  };

  // Handle navigation to user profile page
  const navigateToProfile = () => {
    history.push('/userProfile');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recent Orders</IonTitle>
          
          {/* Profile Icon Section */}
          {isAuthenticated && (
            <div className="profile-container">
              <IonIcon
                icon={personCircleOutline}
                size="large"
                onClick={navigateToProfile}
                // onMouseEnter={() => setShowPopover(true)}
                // onMouseLeave={() => setShowPopover(false)}
              />
              {/* Popover or Tooltip for username */}
              {showPopover && (
                <IonPopover
                  isOpen={showPopover}
                  onDidDismiss={() => setShowPopover(false)}
                  className="profile-popover"
                >
                  <IonText>{username}</IonText>
                </IonPopover>
              )}
            </div>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {isAuthenticated ? (
          <div className="recent-orders">
            <IonGrid>
              <IonRow className="scroll-container">
                {/* Product List */}
                {products.map((product) => (
                  <IonCol size="6" key={product.id}>
                    <IonCard className="cardHome" color="light">
                      <div className='imgContainer'>
                        <img alt={product.name} src={product.img} />
                      </div>
                      <IonCardHeader className='cardText'>
                        <IonCardSubtitle className='order-item-text1'>{product.code}</IonCardSubtitle>
                        <IonCardTitle className='order-item-text2'>{product.name}</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonButton
                          onClick={() => addToCart(product)}
                          className="order-item-btn"
                          color="medium">
                          <IonIcon slot="start" icon={cart} />
                          Add to Cart
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        ) : (
          // Content for unauthenticated users
          <div className="unauthenticated-container">
            <IonText className="unauthenticated-text">Please log in to access this page.</IonText>
            <IonButton onClick={navigateToLogin} color="primary" className="login-button">
              Go to Login
            </IonButton>
          </div>
        )}

        {/* Camera Section */}
        {isAuthenticated && (
          <IonFab className="scannerIcon" vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton color="dark">
              <IonIcon icon={cameraOutline} />
            </IonFabButton>
          </IonFab>
        )}

        {/* Pass cartItems as a prop to Nav and Cart */}
        {isAuthenticated && <Nav cartItems={cartItems} />}
      </IonContent>

      {/* Toast Notification */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Please log in to access this page."
        duration={3000}
        color="warning"
        buttons={[
          {
            text: 'Login',
            handler: () => {
              navigateToLogin();
            }
          }
        ]}
      />
    </IonPage>
  );
};

export default Home;
