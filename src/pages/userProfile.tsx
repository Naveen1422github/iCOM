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
  IonText
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Your Firebase config
import { signOut, onAuthStateChanged } from 'firebase/auth';
import './userProfile.css';

const userProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // User state
  const history = useHistory();

  useEffect(() => {
    // Observe user authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
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
        ) : (
          <IonText>Loading user information...</IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default userProfile;
