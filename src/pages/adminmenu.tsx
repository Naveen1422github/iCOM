import React from 'react';
import {
  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel
} from '@ionic/react';

interface DashboardMenuProps {
  onSelectPage: (page: string) => void;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({ onSelectPage }) => {
  return (
    <IonMenu side="start" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sidebar">
        <IonList>
          <IonItem>
            <button
              onClick={() => {
                console.log('Dashboard clicked');
                onSelectPage('dashboard');
              }}
              style={{ all: 'unset', cursor: 'pointer', width: '100%' }}
            >
              <IonLabel>Home</IonLabel>
            </button>
          </IonItem>
          <IonItem>
            <button
              onClick={() => onSelectPage('productForm')}
              style={{ all: 'unset', cursor: 'pointer', width: '100%' }}
            >
              <IonLabel>Add Product</IonLabel>
            </button>
          </IonItem>
          <IonItem>
            <button
              onClick={() => onSelectPage('coupon')}
              style={{ all: 'unset', cursor: 'pointer', width: '100%' }}
            >
              <IonLabel>Coupon</IonLabel>
            </button>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default DashboardMenu;
