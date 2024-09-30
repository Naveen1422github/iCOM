import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonInput, IonButton, IonText, IonItem, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { eyeOff, eye } from 'ionicons/icons';  // Import icons
import './Login.css';
import { loginUser, registerUser } from '../firebaseConfig';  // Import your Firebase config

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);  // State to toggle between login and signup
  const [email, setEmail] = useState<string>("");  // Now using email for both login and signup
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);  // State to toggle password visibility
  const [errorMessage, setErrorMessage] = useState<string>("");

  const history = useHistory();

  // Login function
  async function login() {
    if(email && password)
    {

      try {
        const res = await loginUser(email, password);
        if (res) {
          history.push('/home');
        } else {
          setErrorMessage('Login failed. Please check your credentials.');
        }
      } catch (error) {
        setErrorMessage(`Login error: `);
      }
    } else {
      setErrorMessage('Incomplete credentials');

    }
  }

  // Sign-up function
  async function signUp() {
    try {
      const res = await registerUser(email, password);
      if (res) {
        alert('Verification email sent. Please check your inbox to verify your account.');
      } else {
        setErrorMessage('Sign-up failed. Try again.');
      }
    } catch (error) {
      setErrorMessage(`Sign-up error: `);
    }
  }

  // Toggle between login and sign-up forms
  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');  // Reset error message when switching forms
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="end" onClick={toggleSignUp}>
            {isSignUp ? "Existing User?" : "New User?"}
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <div className="container">
        <IonContent className="ion-padding">
          <div className="login-container">
            <IonText className="login-title">
              {isSignUp ? "Create a new account" : "Log into your account"}
            </IonText>

            {/* Common Email Input */}
            <IonItem lines="none">
              <IonInput
                type="email"
                placeholder="Enter your Email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                className="email-input"
              />
            </IonItem>

            {/* Password Input with Eye Icon for Toggle */}
            <IonItem lines="none">
              <IonInput
                type={showPassword ? "text" : "password"}  // Toggle between 'text' and 'password'
                placeholder="Enter Password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                className="password-input"
              />
              <IonIcon
                slot="end"
                icon={showPassword ? eyeOff : eye}  // Toggle icon between eyeOff and eye
                onClick={() => setShowPassword(!showPassword)}  // Toggle the state
                style={{ cursor: 'pointer' }}
              />
            </IonItem>

            {/* Conditional rendering for login or sign-up */}
            {isSignUp ? (
              <IonButton expand="block" onClick={signUp} className="otp-button">
                Sign Up
              </IonButton>
            ) : (
              <IonButton expand="block" onClick={login} className="otp-button">
                Login
              </IonButton>
            )}

            {errorMessage && (
              <IonText color="danger" className="error-text">
                {errorMessage}
              </IonText>
            )}
          </div>
        </IonContent>
      </div>
    </IonPage>
  );
};

export default Login;
