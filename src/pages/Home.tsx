import React, { useState, useEffect, useRef } from 'react';
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
  IonSpinner,
} from '@ionic/react';
import { cameraOutline, cart, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import './Home.css';
import Nav from './Nav';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { useCart } from '../contexts/CartContext'; // Import useCart
import backgroundSVG from '../assets/login.svg'; // Adjust the path as neede

interface Product {
  id: number;
  name: string;
  code: string;
  img: string;
  price: number;
}

const Home: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { cartItems, addToCart } = useCart(); // Use cart context
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const [showUnauthenticatedMessage, setShowUnauthenticatedMessage] = useState<boolean>(false); // New state for the message

  useEffect(() => {
    // Set up the authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUsername(user.displayName || 'User');
        setShowToast(false); // Ensure toast is hidden when authenticated
        setShowUnauthenticatedMessage(false); // Hide unauthenticated message if authenticated
      } else {
        setIsAuthenticated(false);
        const toastTimeout = setTimeout(() => {
          setShowToast(true);
        }, 1000); // Show toast after 1 second

        const messageTimeout = setTimeout(() => {
          setShowUnauthenticatedMessage(true); // Show unauthenticated message after 1 second
        }, 1000);

        // Cleanup the timeouts on unmount
        return () => {
          clearTimeout(toastTimeout);
          clearTimeout(messageTimeout);
        };
      }
    });

    return () => unsubscribe();
  }, []);



const scrollContainerRef = useRef<HTMLDivElement | [1]>(null); // Type for the scroll container


useEffect(() => {
  setTimeout(() => {
    const scrollContainer = scrollContainerRef.current;
    
    console.log('scrollContainerRef:', scrollContainer);
    
    
    const handleScroll = () => {
    let closestCard: HTMLElement | null = null;
    let closestDistance = Infinity;
    
    if (!scrollContainer) return;
    
    const containerCenter = scrollContainer.clientWidth / 2 + scrollContainer.scrollLeft;
    
    const cards = Array.from(document.querySelectorAll('.cardHome')) as HTMLElement[];
    
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2 + scrollContainer.scrollLeft;
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });
    
    // Add the 'centered' class to the closest card
    cards.forEach((card) => {
      if (card === closestCard) {
        card.className = 'cardHome centered';
      } else {
        card.className = 'cardHome';
      }
    });
  };
  
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll);
  }
  
  return () => {
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', handleScroll);
    }
  };
}, 2000);
}, []);


 
 
///////
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const openScanner = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
        });

        if (image.webPath) {
          setCapturedImage(image.webPath);
        }
      } catch (error) {
        console.error('Error opening camera:', error);
      }
    } else {
      const useWebCam = window.confirm("Do you want to open the webcam? Click 'Cancel' to upload an image instead.");
      if (useWebCam) {
        openWebCam();
      } else {
        uploadFile();
      }
    }
  };

  const openWebCam = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.autoplay = true;
          videoElement.style.position = 'fixed';
          videoElement.style.top = '50%';
          videoElement.style.left = '50%';
          videoElement.style.transform = 'translate(-50%, -50%)';
          videoElement.style.zIndex = '1001';
          videoElement.id = 'webcam-video';

          const closeButton = document.createElement('button');
          closeButton.innerText = 'Close';
          closeButton.style.position = 'fixed';
          closeButton.style.top = '10px';
          closeButton.style.right = '10px';
          closeButton.style.zIndex = '1002';
          closeButton.onclick = () => {
            stream.getTracks().forEach(track => track.stop());
            videoElement.remove();
            closeButton.remove();
          };

          document.body.appendChild(videoElement);
          document.body.appendChild(closeButton);
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });
    } else {
      alert('Webcam not supported in this browser.');
    }
  };

  const uploadFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageSrc = e.target?.result as string;
          setCapturedImage(imageSrc);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace the URL with your backend endpoint\
      setTimeout(async () => {


        // const response = await axios.get<Product[]>('http://localhost:3001/products');
        const response = {
          "products": [
            {
              "id": 6,
              "name": "Boyfriend Tee - Women",
              "code": "₹1206",
              "price": 20.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-boyfriend-tee-women-1729006649.jpg",
              "description": "A casual boyfriend tee perfect for a relaxed look. Made from soft fabric for all-day comfort.",
              "stockStatus": "In Stock",
              "rating": 4.5,
              "reviews": [
                {
                  "username": "ChrisH",
                  "comment": "Very comfortable and stylish.",
                  "rating": 5
                },
                {
                  "username": "KellyJ",
                  "comment": "A bit oversized but looks great.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 7,
              "name": "Cargos - Women",
              "code": "₹1207",
              "price": 30.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-cargos-women-1729006650.jpg",
              "description": "Stylish and comfortable cargos, great for everyday wear and outdoor adventures.",
              "stockStatus": "Low Stock",
              "rating": 4.2,
              "reviews": [
                {
                  "username": "AnnaB",
                  "comment": "Very practical and comfy.",
                  "rating": 4
                },
                {
                  "username": "NinaL",
                  "comment": "Love the color and fit!",
                  "rating": 5
                }
              ]
            },
            {
              "id": 8,
              "name": "Dresses - Women",
              "code": "₹1208",
              "price": 40.50,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-dresses-women-1729006649.jpg",
              "description": "Chic and comfortable dresses, perfect for a casual day out or a special event.",
              "stockStatus": "In Stock",
              "rating": 4.6,
              "reviews": [
                {
                  "username": "EmmaR",
                  "comment": "Loved the style and material.",
                  "rating": 5
                },
                {
                  "username": "LisaM",
                  "comment": "Fits well but a bit long.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 9,
              "name": "Hoodies - Women",
              "code": "₹1209",
              "price": 35.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-hoodies-women--1--1729006650.jpg",
              "description": "Soft and cozy hoodies, perfect for a casual day or cool evenings.",
              "stockStatus": "In Stock",
              "rating": 4.8,
              "reviews": [
                {
                  "username": "OliviaP",
                  "comment": "Warm and comfy, great for layering.",
                  "rating": 5
                },
                {
                  "username": "SophiaK",
                  "comment": "A bit big but still love it.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 10,
              "name": "Jackets - Women",
              "code": "₹1210",
              "price": 55.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-jackets-women-1729006632.jpg",
              "description": "Lightweight and versatile jackets, ideal for layering in any weather.",
              "stockStatus": "In Stock",
              "rating": 4.7,
              "reviews": [
                {
                  "username": "EllaD",
                  "comment": "Very stylish and practical.",
                  "rating": 5
                },
                {
                  "username": "MiaS",
                  "comment": "Fits well but could be warmer.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 11,
              "name": "Jeans - Women",
              "code": "₹1211",
              "price": 45.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-jeans-women-1729006631.jpg",
              "description": "Classic and comfortable jeans, great for casual or semi-formal outfits.",
              "stockStatus": "Low Stock",
              "rating": 4.4,
              "reviews": [
                {
                  "username": "GraceT",
                  "comment": "Great fit and quality.",
                  "rating": 5
                },
                {
                  "username": "ZoeL",
                  "comment": "Could use a little more stretch.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 12,
              "name": "Joggers - Women",
              "code": "₹1212",
              "price": 29.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-joggers-women-1729006631.jpg",
              "description": "Comfortable and stylish joggers, perfect for lounging or running errands.",
              "stockStatus": "In Stock",
              "rating": 4.3,
              "reviews": [
                {
                  "username": "ChloeM",
                  "comment": "Very comfy and breathable.",
                  "rating": 4
                },
                {
                  "username": "LilyB",
                  "comment": "Good for both gym and casual wear.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 13,
              "name": "Oversized Tee - Women",
              "code": "₹1213",
              "price": 18.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-oversized-tee-women-1729006630.jpg",
              "description": "Loose-fitting oversized tee, great for a relaxed, casual look.",
              "stockStatus": "In Stock",
              "rating": 4.5,
              "reviews": [
                {
                  "username": "AvaW",
                  "comment": "So comfortable and stylish!",
                  "rating": 5
                },
                {
                  "username": "IsabellaC",
                  "comment": "Loved the fit, great for everyday wear.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 14,
              "name": "PP Collection - Women",
              "code": "₹1214",
              "price": 39.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-pp-women-1729006612.jpg",
              "description": "Premium PP collection, designed for comfort and style.",
              "stockStatus": "Low Stock",
              "rating": 4.7,
              "reviews": [
                {
                  "username": "EmilyT",
                  "comment": "Very stylish and comfortable.",
                  "rating": 5
                },
                {
                  "username": "CharlotteK",
                  "comment": "Worth every penny.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 15,
              "name": "Shirts - Women",
              "code": "₹1215",
              "price": 28.50,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-shirts-women-1729006613.jpg",
              "description": "Classic shirts perfect for a professional or casual look.",
              "stockStatus": "In Stock",
              "rating": 4.6,
              "reviews": [
                {
                  "username": "AmeliaS",
                  "comment": "Great fit, very comfortable.",
                  "rating": 5
                },
                {
                  "username": "SophiaD",
                  "comment": "Good for office wear.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 16,
              "name": "Sweatshirts - Women",
              "code": "₹1216",
              "price": 32.99,
              "img": "https://images.bewakoof.com/uploads/grid/app/desktop-sweatshirts-women--1--1729007380.jpg",
              "description": "Cozy and warm sweatshirts, ideal for casual outings or lounging.",
              "stockStatus": "Low Stock",
              "rating": 4.7,
              "reviews": [
                {
                  "username": "ArianaG",
                  "comment": "Very cozy, perfect for winter.",
                  "rating": 5
                },
                {
                  "username": "StellaR",
                  "comment": "Great quality, but a bit pricey.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 21,
              "name": "Product 1",
              "code": "₹1201",
              "price": 50.99,
              "img": "https://images.unsplash.com/photo-1485218126466-34e6392ec754?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==",
              "description": "This is a high-quality product made from premium materials. Perfect for daily use.",
              "stockStatus": "In Stock",
              "rating": 4.7,
              "reviews": [
                {
                  "username": "JohnDoe",
                  "comment": "Absolutely loved the product!",
                  "rating": 5
                },
                {
                  "username": "JaneSmith",
                  "comment": "Good value for money.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 1,
              "name": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
              "code": "₹1201",
              "price": 109.95,
              "img": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
              "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
              "stockStatus": "In Stock",
              "rating": 4.8,
              "reviews": [
                {
                  "username": "AliceM",
                  "comment": "Great for work and school!",
                  "rating": 5
                },
                {
                  "username": "BobK",
                  "comment": "Durable but a bit expensive.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 2,
              "name": "Mens Casual Premium Slim Fit T-Shirts",
              "code": "₹1202",
              "price": 22.3,
              "img": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
              "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket. Lightweight and soft fabric.",
              "stockStatus": "Low Stock",
              "rating": 4.3,
              "reviews": [
                {
                  "username": "MikeJ",
                  "comment": "Good fit, comfortable material.",
                  "rating": 4
                },
                {
                  "username": "SaraD",
                  "comment": "Color faded after a few washes.",
                  "rating": 3
                }
              ]
            },
            {
              "id": 3,
              "name": "Mens Cotton Jacket",
              "code": "₹1203",
              "price": 55.99,
              "img": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
              "description": "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing.",
              "stockStatus": "In Stock",
              "rating": 4.6,
              "reviews": [
                {
                  "username": "AdamL",
                  "comment": "Stylish and comfortable.",
                  "rating": 5
                },
                {
                  "username": "NancyP",
                  "comment": "Good for light weather.",
                  "rating": 4
                }
              ]
            },
            {
              "id": 4,
              "name": "Mens Casual Slim Fit",
              "code": "₹1204",
              "price": 15.99,
              "img": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
              "description": "The color could be slightly different between on the screen and in practice.",
              "stockStatus": "Out of Stock",
              "rating": 4.1,
              "reviews": [
                {
                  "username": "PaulS",
                  "comment": "Nice but wish the color was better.",
                  "rating": 4
                },
                {
                  "username": "KimB",
                  "comment": "Fit wasn't perfect, but overall decent.",
                  "rating": 3
                }
              ]
            },
            {
              "id": 5,
              "name": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
              "code": "₹1205",
              "price": 695,
              "img": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
              "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
              "stockStatus": "In Stock",
              "rating": 4.9,
              "reviews": [
                {
                  "username": "CatherineM",
                  "comment": "Elegant and timeless.",
                  "rating": 5
                },
                {
                  "username": "EmmaW",
                  "comment": "A bit pricey but worth it.",
                  "rating": 4
                }
              ]
            }
          ]
        }

        // setProducts(response.data);
        setProducts(response.products);
      }, 1000);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setTimeout(() => {

        setIsLoading(false);
      }, 900);
    }
  };

  const navigateToLogin = () => {
    history.push('/login');
  };

  const navigateToProfile = () => {
    history.push('/userProfile');
  };

  const cardProduct = (product: Product) => {
    history.push({
      pathname: '/productdetails',
      state: { product: product },
    });
  };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar >
          {isAuthenticated && (
            <div className="profile-container">

              <IonIcon
                // icon={personCircleOutline}
                style={{
                  backgroundImage: `url(${backgroundSVG})`,
                  backgroundSize: '',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                }}
                size="large"
                onClick={navigateToProfile}
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
              <IonTitle>
                <div className="toolbar-title">
                  Best Product now at 25% OFF
                </div>
              </IonTitle>
            </div>
          )}

        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* <div className="loader"></div> */}

        {isAuthenticated ? (
          <div className="recent-orders">
            {isLoading ? (
              <div className="loader"></div>
            ) : error ? (
              <IonText color="danger">{error}</IonText>
            ) : (
              <IonGrid>
{/* <div className="scroll-container">      {products.map((product) => (        <div key ={product.id} className="cardHome">
  <img src = {product.img} alt ={product.name}/>
  <h3>{product.name}</h3>
  <p>{product.code}</p>
</div>
 ))} </div> */}

                <IonRow >
                  



                <div className="scroll-container" ref={scrollContainerRef} style={{overflow:'scroll', whiteSpace: 'nowrap'}}>
                {products.map((product) => (
    <IonCol size="6" key={product.id} className='ioncol'>
      <IonCard className="cardHome" color="light" onClick={() => cardProduct(product)}>
        <div className='imgContainer'>
          <img alt={product.name} src={product.img} />
        </div>
        <IonCardHeader className='cardText'>
          <IonCardSubtitle className='order-item-text1'>{product.code}</IonCardSubtitle>
          <IonCardTitle className='order-item-text2'>
            {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering card click
              addToCart(product);
            }}
            className="order-item-btn"
            color="medium"
            fill="outline"
          >
            <IonIcon slot="start" icon={cart} />
            Add to Cart
          </IonButton>
        </IonCardContent>
      </IonCard>
    </IonCol>
  ))}
</div>

                </IonRow>
                
                <div className="midll">

                  <IonRow >
                    <IonCol size="6">
                      <IonCard className="dashboard-card">
                        <IonCardContent>
                          <IonText>Bestselling Category</IonText>
                          <h2>Tshirt</h2>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                    <IonCol size="6">
                      <IonCard className="dashboard-card">
                        <IonCardContent>
                          <IonText>    Active  Orders</IonText>
                          <h2>4</h2>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="6">
                      <IonCard className="dashboard-card">
                        <IonCardContent>
                          <IonText>Live Customers</IonText>
                          <h2>2</h2>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                    <IonCol size="6">
                      <IonCard className="dashboard-card">
                        <IonCardContent>
                          <IonText>Active Products</IonText>
                          <h2>6</h2>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  </IonRow>
                </div>
              </IonGrid>

            )}
          </div>

        ) : (
          // Content for unauthenticated users
          showUnauthenticatedMessage && ( // Show message based on new state
            <div className="unauthenticated-container">
              <IonText className="unauthenticated-text">Please log in to access this page.</IonText>
              <IonButton onClick={navigateToLogin} color="primary" className="login-button">
                Go to Login
              </IonButton>
            </div>)
        )}

        {/* Camera Section */}
        {isAuthenticated && (
          <IonFab className="scannerIcon" vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton color="dark" onClick={openScanner}>
              <IonIcon icon={cameraOutline} />
            </IonFabButton>
          </IonFab>
        )}

        {/* Nav Component */}
        {isAuthenticated && <Nav />}
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
