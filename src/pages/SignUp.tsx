import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './SignUp.css'; // Import the CSS file

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cin, setCin] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const handleSignUp = () => {
    if (!email || !phoneNumber || !firstName || !lastName || !companyName || !cin || !salesPerson) {
      setShowToast(true);
      return;
    }
    history.push('/home');
  };

  return (
    <IonPage>
      <IonContent className="container">
        <div className="login-container">
          <h1 className="login-title">Create New Account</h1>
          <div className="namesCon">

          <IonItem>
            <IonInput
            placeholder="First Name"
            value={firstName}
            onIonChange={(e) => setFirstName(e.detail.value!)}
            required
            className="names"
            />
          </IonItem>
          <IonItem>
            <IonInput
            placeholder="Last Name"
            value={lastName}
            onIonChange={(e) => setLastName(e.detail.value!)}
            required
            className="names"
            />
          </IonItem>
            </div>
          <IonItem>
            
            <IonInput
            placeholder="Phone Number"
              type="tel"
              value={phoneNumber}
              onIonChange={(e) => setPhoneNumber(e.detail.value!)}
              required
              className="phone-input"
            />
          </IonItem>
          <IonItem>
        
            <IonInput
            placeholder="Email"
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              required
              className="phone-input"
            />
          </IonItem>
          <IonItem>
            <IonInput
            placeholder="Comapany Name"
              value={companyName}
              onIonChange={(e) => setCompanyName(e.detail.value!)}
              required
              className="phone-input"
            />
          </IonItem>
          <IonItem>
            <IonInput
            placeholder="CIN"
              value={cin}
              onIonChange={(e) => setCin(e.detail.value!)}
              required
              className="phone-input"
            />
          </IonItem>
          <IonItem>
            <IonInput
            placeholder="Sales Person"
              value={salesPerson}
              onIonChange={(e) => setSalesPerson(e.detail.value!)}
              required
              className="phone-input"
            />
          </IonItem>
          <IonButton  expand="full" className="otp-button" onClick={handleSignUp}>
            Create Account
          </IonButton>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Please fill out all fields."
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
