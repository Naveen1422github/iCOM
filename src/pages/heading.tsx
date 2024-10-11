import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonText } from '@ionic/react';

const OffersHeader: React.FC = () => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          <IonText color="primary">
            <h2>Discount</h2>
          </IonText>
          <IonText color="secondary">
            <h3>New Offers</h3>
          </IonText>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default OffersHeader;
