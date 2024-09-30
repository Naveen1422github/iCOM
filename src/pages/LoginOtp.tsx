import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonInput, IonButton, IonText, IonItem } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './LoginOtp.css';

const LoginOtp: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");  // State for error message

  const history = useHistory();
  const handleVerifyOtp = () => {
    // if (otp != "0000") {
    //     setOtp("");  // Clear phone number
    //   setErrorMessage("Please enter a valid OTP");
    //     return;
    //   }

      setErrorMessage("");
      setOtp("");
      history.push('/signup');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonTitle>OTP Verification</IonTitle> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="otp-container">
          <IonText className="otp-title">Verification Code</IonText>
          <IonText className="otp-subtitle">Please type the verification code sent to your phone number</IonText>
          <div className="otp-inputs">
            <IonItem lines="none">
              <IonInput
                type="text"
                maxlength={4}  // Assuming 4-digit OTP
                placeholder="Enter OTP"
                value={otp}
                onIonChange={(e) => setOtp(e.detail.value!)}
                className="otp-input"
              />
              
            </IonItem>
            
          </div>
          {/* Show error message if validation fails */}
          {errorMessage && <IonText color="danger">{errorMessage}</IonText>}
          <IonButton expand="block" onClick={handleVerifyOtp} className="verify-button">
            Verify
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginOtp;
