// OrderDetails.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonSpinner,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Ensure Firestore is imported
import { doc, getDoc } from 'firebase/firestore';
import './OrderDetails.css'
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  img: string;
  selectedSize: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: any;
  status: string;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the order ID from the URL
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async (orderId: string) => {
      try {
        const orderDoc = doc(db, 'orders', orderId);
        const docSnapshot = await getDoc(orderDoc);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setOrder({
            id: docSnapshot.id,
            userId: data.userId,
            items: data.items || [],
            totalAmount: data.total || 0,
            orderDate: data.orderDate,
            status: data.status || 'Unknown',
          });
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails(id);
    }
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/userProfile" />
          </IonButtons>
          <IonTitle>Order Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {isLoading ? (
          <div className="loader"></div>
        ) : error ? (
          <IonText color="danger">{error}</IonText>
        ) : order ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Order ID: {order.id}</IonCardTitle>
              {/* <IonText>Status: {order.status}</IonText> */}
              <div className="progress-container">
  <div className="step completed">
    <span className="circle">✔</span>
    <span className="label">Payment</span>
  </div>
  <div className="divider"></div>
  <div className="step completed">
    <span className="circle">✔</span>
    <span className="label">Shipping</span>
  </div>
  <div className="divider"></div>
  <div className="step current">
    <span className="circle">-</span>
    <span className="label">Delivered</span>
  </div>
</div>

            </IonCardHeader>

            <IonCardContent>
              <IonText>
                Order Date: {order.orderDate ? order.orderDate.toDate().toLocaleDateString() : 'Unknown'}
              </IonText>
              <div>
                <IonText><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</IonText>
              </div>

              <h3>Items:</h3>
              {order.items.map((item, index) => (
                <IonCard key={index}>
                  <IonCardHeader>
                    <IonCardTitle>{item.name}</IonCardTitle>
                  </IonCardHeader>
                  <div className="smallbox">

                  <IonCardContent>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <p>Size: {item.selectedSize}</p>
                    <p>Total: ${(item.quantity * item.price).toFixed(2)}</p>
                  </IonCardContent>
                  <img src={item.img} alt={item.name} style={{ width: '100px' }} />
                  </div>

                </IonCard>
              ))}
            </IonCardContent>
          </IonCard>
        ) : (
          <IonText>No order details found.</IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OrderDetails;
