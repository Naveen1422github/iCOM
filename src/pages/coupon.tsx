import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonDatetime, IonSplitPane } from '@ionic/react';
import { createCoupon } from '../firebaseConfig'; // Import the Firebase functions
// import './coupon.css'; // Import the CSS file

const Coupon: React.FC = () => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState<number | undefined>(undefined);
  const [expirationDate, setExpirationDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Manual validation
    if (!code || !discount || !expirationDate) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    // If all fields are filled out, create the coupon
    const created = await createCoupon(code, discount, new Date(expirationDate));
    if (created) {
      alert('Coupon created successfully!');
    } else {
      alert('Error creating coupon');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Coupon</IonTitle>
        </IonToolbar>
      </IonHeader>
              <IonSplitPane contentId="main-content" when="md">

      <IonContent className="ion-padding" id="main-content">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Coupon Code</IonLabel>
            <IonInput
              value={code}
              onIonChange={(e) => setCode(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Discount (% or amount)</IonLabel>
            <IonInput
              type="number"
              value={discount}
              onIonChange={(e) => setDiscount(parseFloat(e.detail.value!))}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Expiration Date</IonLabel>
            <IonDatetime
              value={expirationDate}
              onIonChange={(e) => {
                const selectedDate = e.detail.value;
                if (Array.isArray(selectedDate)) {
                  setExpirationDate(selectedDate[0]);
                } else {
                  setExpirationDate(selectedDate || '');
                }
              }}
              presentation="date"
            />
          </IonItem>
          
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display validation error */}

          <IonButton expand="block" type="submit" className="create-coupon-btn">
            Create Coupon
          </IonButton>
        </form>
      </IonContent>
      </IonSplitPane>
    </IonPage>
  );
};

export default Coupon;
