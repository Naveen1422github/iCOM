import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonText, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getAuth, applyActionCode, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const Verify: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('Verifying your email...');
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    // Get the action code from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const oobCode = queryParams.get('oobCode');

    if (oobCode) {
      applyActionCode(auth, oobCode)
        .then(async () => {
          setMessage('Email verified successfully! Logging you in...');
          setLoading(true);

          // Wait for user auth state change and check email verification status
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              await user.reload();
              if (user.emailVerified) {
                // Automatically log the user in and redirect to home
                history.push('/home');
              }
            } else {
              setMessage('User not found. Please log in manually.');
              setLoading(false);
            }
          });
        })
        .catch((error) => {
          setMessage('Invalid verification link.');
          setLoading(false);
          console.error('Error verifying email:', error);
        });
    } else {
        history.push('/home');
      setMessage('No verification code found.');
      setLoading(false);
    }
  }, [auth, history]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        
      </IonContent>
    </IonPage>
  );
};

export default Verify;
