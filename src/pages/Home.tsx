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
  IonSpinner, // For loading indicator
} from '@ionic/react';
import { cameraOutline, cart, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Correct import
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios'; // Import axios
import './Home.css';
import Nav from './Nav';
import Cart from './Cart';
import userProfile from './userProfile';

interface Product {
  id: number;
  name: string;
  code: string;
  img: string;
}

const Home: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]); // Cart items state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Auth state
  const [showToast, setShowToast] = useState<boolean>(false); // Toast visibility
  const [showPopover, setShowPopover] = useState(false); // For hover effect on profile icon
  const [username, setUsername] = useState<string>(''); // Username state
  const [products, setProducts] = useState<Product[]>([]); // Products state
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const history = useHistory();

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace the URL with your backend endpoint
      const response = await axios.get<Product[]>('https://sidmu79054.s3.eu-north-1.amazonaws.com/harsh/obj.json');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a product to the cart
  const addToCart = (product: Product) => {
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
            {isLoading ? (
              <div className="loading-container">
                <IonSpinner name="crescent" />
                <IonText>Loading products...</IonText>
              </div>
            ) : error ? (
              <IonText color="danger">{error}</IonText>
            ) : (
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
            )}
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
