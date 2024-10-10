// userProfile.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; // Ensure Firestore is imported
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import './userProfile.css';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: Timestamp | null;
  status: string;
}

const userProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // User state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    // Observe user authentication state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchOrders(currentUser.uid);
      } else {
        setUser(null);
        history.push('/login'); // Redirect to login if not authenticated
      }
    });

    // Clean up the observer
    return () => unsubscribe();
  }, [history]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push('/login'); // Redirect to login page after sign-out
    } catch (error) {
      console.error('Error logging out: ', error);
      // Optionally, display an error toast or message to the user
    }
  };

  const fetchOrders = async (userId: string) => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const userOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Validate that orderDate exists and is of type Timestamp
        let orderDate: Timestamp | null = null;
        if (data.orderDate && data.orderDate instanceof Timestamp) {
          orderDate = data.orderDate;
        } else {
          console.warn(`Order ID ${doc.id} is missing a valid 'orderDate' field.`);
        }

        userOrders.push({
          id: doc.id,
          userId: data.userId,
          items: data.items || [],
          totalAmount: data.totalAmount || 0,
          orderDate: orderDate,
          status: data.status || 'Unknown',
        });
      });

      console.log('Fetched Orders:', userOrders);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError('Failed to load orders. Please try again later.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {user ? (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Welcome, {user.displayName || 'User'}</IonCardTitle>
                <IonCardSubtitle>{user.email}</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                <IonText className="user-info">
                  <p><strong>Username: </strong>{user.displayName || 'N/A'}</p>
                  <p><strong>Email: </strong>{user.email || 'N/A'}</p>
                </IonText>

                <IonButton expand="block" color="danger" onClick={handleLogout}>
                  <IonIcon slot="start" icon={logOutOutline} />
                  Logout
                </IonButton>
              </IonCardContent>
            </IonCard>

            <IonCard>
  <IonCardHeader>
    <IonCardTitle>Previous Orders ({orders.length})</IonCardTitle>
  </IonCardHeader>

  <IonCardContent>
    {isLoadingOrders ? (
      <div className="loading-container">
        <IonText>Loading.. </IonText>
        <IonSpinner name="crescent" />
        <IonText>rders...</IonText>
      </div>
    ) : ordersError ? (
      <IonText color="danger">{ordersError}</IonText>
    ) : orders.length === 0 ? (
      <IonText>No previous orders found.</IonText>
    ) : (
      <IonList>
        {orders.map((order) => (
          <IonCard key={order.id} className="order-card" button onClick={() => history.push(`/orderDetails/${order.id}`)}>
            <IonCardHeader>
              <IonCardTitle className="orderID">Order ID: {order.id}</IonCardTitle>
              <IonCardSubtitle>
                Date: {order.orderDate ? order.orderDate.toDate().toLocaleDateString() : 'Unknown Date'} | Status: {order.status}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {order.items.map((item, index) => (
                  <IonItem key={index} className="item-row">
                    <IonLabel>
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-details">Quantity: {item.quantity} | Price: ${item.price.toFixed(2)}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
              <div className="order-total">
                <IonText>
                  <strong>Total Amount: </strong>${order.totalAmount.toFixed(2)}
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </IonList>
    )}
  </IonCardContent>
</IonCard>

          </>
        ) : (
          <div className="loader"></div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default userProfile;
