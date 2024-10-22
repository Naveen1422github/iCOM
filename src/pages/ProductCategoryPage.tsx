import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from "@ionic/react";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../firebaseConfig';  // Import the Firestore db
import './ProductCategoryPage.css';

// Define the product type
interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  img: string;
  description: string;
  stockStatus: string;
  rating: number;
  category: string;
  reviews: {
    username: string;
    comment: string;
    rating: number;
  }[];
}

interface RouteParams {
  category: string;
}

const ProductCategoryPage: React.FC = () => {
  const { category } = useParams<RouteParams>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData: Product[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as unknown as Product[];
        setProducts(productsData.filter((product) => product.category === category));
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow>
            {products.map((product) => (
              <IonCol size="6" key={product.id}>
                <IonCard>
                  <img src={product.img} alt={product.name} />
                  <IonCardHeader>
                    <IonCardSubtitle>{product.category}</IonCardSubtitle>
                    <IonCardTitle>{product.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>{product.description}</p>
                    <p>Price: ₹{product.price}</p>
                    <p>Rating: {product.rating}</p>
                    <p>Status: {product.stockStatus}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ProductCategoryPage;
