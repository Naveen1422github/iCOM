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



  const categoriesRef = useRef<HTMLDivElement[]>([]); // Array of refs for each category
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null); // Keep track of highlighted index

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = categoriesRef.current.indexOf(entry.target as HTMLDivElement);
            setHighlightedIndex(index);
          }
        });
      },
      { threshold: 0.6 } // Trigger when 60% of the element is in view
    );

    categoriesRef.current.forEach((category) => {
      if (category) observer.observe(category);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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

  const handleCategoryClick = (category: string) => {
    history.push(`/category/${category}`);
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
                "category": "Women",
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
                "id": 29,
                "name": "Men S Beige Grey Batman Ombre Oversized T Shirt 617004 1718803064 1",
                "code": "₹1100",
                "price": 20,
                "img": "https://images.bewakoof.com/t320/men-s-beige-grey-batman-ombre-oversized-t-shirt-617004-1718803064-1.jpg",
                "description": "A stylish and comfortable piece for everyday wear.",
                "stockStatus": "In Stock",
                "rating": 4.5,
                "category": "Men",
                "reviews": [
                  {
                    "username": "UserA",
                    "comment": "Great product, really comfortable.",
                    "rating": 5
                  },
                  {
                    "username": "UserB",
                    "comment": "Good fit, but could use better material.",
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
                "category": "Women",
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
                "category": "Women",
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
                "category": "Women",
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
                "id": 30,
                "name": "Men S Beige Straight Fit Cargo Pants 628753 1727429612 1",
                "code": "₹1200",
                "price": 25,
                "img": "https://images.bewakoof.com/t320/men-s-beige-straight-fit-cargo-pants-628753-1727429612-1.jpg",
                "description": "A stylish and comfortable piece for everyday wear.",
                "stockStatus": "In Stock",
                "rating": 4.0,
                "category": "Men",
                "reviews": [
                  {
                    "username": "UserA",
                    "comment": "Great product, really comfortable.",
                    "rating": 5
                  },
                  {
                    "username": "UserB",
                    "comment": "Good fit, but could use better material.",
                    "rating": 4
                  }
                ]
              },
              {
                "id": 31,
                "name": "Men S Black Need Space Snoopy Graphic Printed Oversized T Shirt 630667 1719838040 1",
                "code": "₹1300",
                "price": 30,
                "img": "https://images.bewakoof.com/t320/men-s-black-need-space-snoopy-graphic-printed-oversized-t-shirt-630667-1719838040-1.jpg",
                "description": "A stylish and comfortable piece for everyday wear.",
                "stockStatus": "In Stock",
                "rating": 4.5,
                "category": "Men",
                "reviews": [
                  {
                    "username": "UserA",
                    "comment": "Great product, really comfortable.",
                    "rating": 5
                  },
                  {
                    "username": "UserB",
                    "comment": "Good fit, but could use better material.",
                    "rating": 4
                  }
                ]
              },
              {
                "id": 32,
                "name": "Men S Black Wander Geometry T Shirt 391326 1717060371 1",
                "code": "₹1400",
                "price": 35,
                "img": "https://images.bewakoof.com/t320/men-s-black-wander-geometry-t-shirt-391326-1717060371-1.jpg",
                "description": "A stylish and comfortable piece for everyday wear.",
                "stockStatus": "In Stock",
                "rating": 4.0,
                "category": "Men",
                "reviews": [
                  {
                    "username": "UserA",
                    "comment": "Great product, really comfortable.",
                    "rating": 5
                  },
                  {
                    "username": "UserB",
                    "comment": "Good fit, but could use better material.",
                    "rating": 4
                  }
                ]
              },
              {
                "id": 33,
                "name": "Men S Green Loki Graphic Printed Oversized Acid Wash T Shirt 648728 1728291319 1",
                "code": "₹1500",
                "price": 40,
                "img": "https://images.bewakoof.com/t320/men-s-green-loki-graphic-printed-oversized-acid-wash-t-shirt-648728-1728291319-1.jpg",
                "description": "A stylish and comfortable piece for everyday wear.",
                "stockStatus": "In Stock",
                "rating": 4.5,
                "category": "Men",
                "reviews": [
                  {
                    "username": "UserA",
                    "comment": "Great product, really comfortable.",
                    "rating": 5
                  },
                  {
                    "username": "UserB",
                    "comment": "Good fit, but could use better material.",
                    "rating": 4
                  }
                ]
              },
              {
                "id": 34,
                "name": "Men S Green Move On Graphic Printed T Shirt 587160 1717061149 1",
                "code": "₹1600",
                "price": 45,
                "img": "https://images.bewakoof.com/t320/men-s-green-move-on-graphic-printed-t-shirt-587160-1717061149-1.jpg",
                "description": "A stylish and comfortable piece for everyday wear.",
                "stockStatus": "In Stock",
                "rating": 4.0,
                "category": "Men",
                "reviews": [
                  {
                    "username": "UserA",
                    "comment": "Great product, really comfortable.",
                    "rating": 5
                  },
                  {
                    "username": "UserB",
                    "comment": "Good fit, but could use better material.",
                    "rating": 4
                  }
                ]
              },
              {
                "id": 35,
                "name": "Printed Cotton T-Shirt",
                "code": "₹1500",
                "price": 30,
                "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/28230544/2024/3/13/c00d1a90-00c9-47c5-9c16-3eec91c3a1071710302012409PrintedcottonT-shirt1.jpg",
                "description": "Classic printed cotton t-shirt with a trendy design.",
                "stockStatus": "In Stock",
                "category": "Kids",
                "rating": 4.5,
                "reviews": [
                  {
                    "username": "AliceD",
                    "comment": "Great quality and fits my kid perfectly.",
                    "rating": 5
                  },
                  {
                    "username": "JohnK",
                    "comment": "Nice material but runs a bit small.",
                    "rating": 4
                  }
                ]
              },
              {
                "id": 36,
                "name": "Printed Cotton T-Shirt",
                "code": "₹1200",
                "price": 25,
                "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/28419090/2024/3/22/fa7492f6-9238-4146-bf6d-b7eb8ae469721711086277213PrintedcottonT-shirt1.jpg",
                "description": "Stylish and comfortable printed t-shirt for casual wear.",
                "stockStatus": "In Stock",
                "category": "Kids",
                "rating": 4.0,
                "reviews": [
                  {
                    "username": "MichaelP",
                    "comment": "Good for everyday wear but fades a little after washing.",
                    "rating": 3.5
                  },
                  {
                    "username": "SarahG",
                    "comment": "Loved it! My kid enjoys wearing it.",
                    "rating": 4.5
                  }
                ]
              },
              {
                "id": 37,
                "name": "Printed Cotton T-Shirt",
                "code": "₹1400",
                "price": 35,
                "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/28528286/2024/3/27/f0f7cce1-3aa2-4cfb-9400-0f5e1b3c4c991711522087025PrintedcottonT-shirt1.jpg",
                "description": "Printed t-shirt made with high-quality cotton for everyday comfort.",
                "stockStatus": "In Stock",
                "category": "Kids",
                "rating": 4.2,
                "reviews": [
                  {
                    "username": "LucyH",
                    "comment": "Nice shirt, but could be softer.",
                    "rating": 4
                  },
                  {
                    "username": "TomF",
                    "comment": "Loved the design, my kid is a fan!",
                    "rating": 4.5
                  }
                ]
              },
              {
                "id": 38,
                "name": "Printed Cotton T-Shirt",
                "code": "₹1300",
                "price": 30,
                "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/28528290/2024/3/27/e1852b74-cb3a-44d1-97d1-65c3fd982caa1711523487200PrintedcottonT-shirt1.jpg",
                "description": "Trendy printed cotton t-shirt with a soft feel.",
                "stockStatus": "In Stock",
                "category": "Kids",
                "rating": 4.3,
                "reviews": [
                  {
                    "username": "EmmaS",
                    "comment": "Love the print, feels comfortable.",
                    "rating": 4.5
                  },
                  {
                    "username": "DavidT",
                    "comment": "Good product but a bit overpriced.",
                    "rating": 4
                  }
                ]
              },
              {
                "id": 39,
                "name": "HM Boys Black Cotton T-shirt",
                "code": "₹1800",
                "price": 40,
                "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/10376853/2021/3/4/632718d0-f5d9-48fb-8878-4cac920d0fe21614847223216-HM-Boys-Black-Cotton-T-shirt-1371614847222749-1.jpg",
                "description": "Black cotton t-shirt designed for boys, perfect for casual wear.",
                "stockStatus": "In Stock",
                "category": "Kids",
                "rating": 4.7,
                "reviews": [
                  {
                    "username": "SamB",
                    "comment": "High quality, durable material.",
                    "rating": 5
                  },
                  {
                    "username": "LindaW",
                    "comment": "Perfect for my son, he loves it.",
                    "rating": 4.8
                  }
                ]
              },
             
              {
                "id": 41,
                "name": "Long Sleeved T-Shirt",
                "code": "₹1900",
                "price": 50,
                "img": "https://assets.myntassets.com/f_webp,h_560,q_90,w_420/v1/assets/images/27726124/2024/2/20/d8beab62-2c85-4560-878d-531a871a90091708433609582Long-sleevedT-shirt1.jpg",
                "description": "Long sleeved t-shirt made from premium quality cotton.",
                "stockStatus": "In Stock",
                "category": "Kids",
                "rating": 4.6,
                "reviews": [
                  {
                    "username": "SophiaR",
                    "comment": "Perfect for cooler weather, my kid loves it.",
                    "rating": 4.8
                  },
                  {
                    "username": "HenryV",
                    "comment": "Good quality but a bit expensive.",
                    "rating": 4.4
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
    console.log("navigation start");
 
      
      history.push({
        
        state: { product: product },
        pathname: '/productdetails',
      });
      
    setTimeout(() => {
      window.location.reload();
    }, 200);
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
                

                <div className="categories-container">
        <div className="category" onClick={() => handleCategoryClick('men')}>
          <img src="https://images.bewakoof.com/t1080/men-s-green-move-on-graphic-printed-t-shirt-587160-1717061149-1.jpg" alt="Men" className="category-image" />
          <div className="category-overlay">
            <h2>MEN</h2>
          </div>
        </div>
        <div className="category" onClick={() => handleCategoryClick('women')}>
          <img src="https://images.bewakoof.com/t1080/women-s-black-friends-feelings-t-j-graphic-printed-oversized-t-shirt-591334-1701446976-1.jpg" alt="Women" className="category-image" />
          <div className="category-overlay">
            <h2>WOMEN</h2>
          </div>
        </div>
        <div className="category" onClick={() => handleCategoryClick('kids')}>
          <img src="//cdn.fcglcdn.com/brainbees/images/products/583x720/11083314a.webp" alt="Kids" className="category-image" />
          <div className="category-overlay">
            <h2>KIDS</h2>
          </div>
        </div>
      </div>
    
     
 


      <div className="middlecontainer">

      
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
                          <IonText>    previous  Orders</IonText>
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
