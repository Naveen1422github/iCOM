// SignUp.tsx

import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './SignUp.css';
import { registerUser } from '../firebaseConfig'; // Import the updated Firebase config

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cin, setCin] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();

  const handleSignUp = async () => {
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !companyName ||
      !cin ||
      !salesPerson
    ) {
      setToastMessage('Please fill out all fields.');
      setShowToast(true);
      return;
    }

    const success = await registerUser(email, password);
    if (success) {
      setToastMessage('Registration successful! Please check your email to verify your account.');
      setShowToast(true);
      // Optionally, redirect to a different page after successful registration
      // history.push('/verify-email');
    } else {
      setToastMessage('Sign-up failed. Please try again.');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="container">
        <div className="login-container">
          <h1 className="login-title">Create New Account</h1>
          <IonItem>
            <IonInput
              placeholder="First Name"
              value={firstName}
              onIonChange={(e) => setFirstName(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonInput
              placeholder="Last Name"
              value={lastName}
              onIonChange={(e) => setLastName(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonInput
              placeholder="Phone Number"
              type="tel"
              value={phoneNumber}
              onIonChange={(e) => setPhoneNumber(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonInput
              placeholder="Email"
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonInput
              placeholder="Password"
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonInput
              placeholder="Company Name"
              value={companyName}
              onIonChange={(e) => setCompanyName(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonInput
              placeholder="CIN"
              value={cin}
              onIonChange={(e) => setCin(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonInput
              placeholder="Sales Person"
              value={salesPerson}
              onIonChange={(e) => setSalesPerson(e.detail.value!)}
              required
            />
          </IonItem>
          <IonButton expand="full" onClick={handleSignUp}>
            Create Account
          </IonButton>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
