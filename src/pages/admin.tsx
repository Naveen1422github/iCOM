import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonGrid, IonRow, IonCol, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonMenu, IonList,
  IonItem, IonLabel, IonMenuButton, IonButtons, IonTitle, IonSplitPane
} from '@ionic/react';
import './admin.css';

const Dashboard: React.FC = () => {
  return (
    <IonPage>
        <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonSplitPane contentId="main-content" when="md">
        {/* Sidebar Menu */}
        

        {/* Main Content */}
        <IonContent id="main-content">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonCard className="welcome-card">
                  <IonCardHeader>
                    <IonCardTitle>Congratulations John! 🎉</IonCardTitle>
                    <IonCardSubtitle>You have done 72% more sales today.</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Check your new raising badge in your profile.</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            <IonRow>
              {/* Total Profit Card */}
              <IonCol sizeLg="6" sizeSm="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Total Profit</IonCardTitle>
                    <IonCardSubtitle>$48,568.20</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Last month balance: $234.40k</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Revenue Card */}
              <IonCol sizeLg="3" sizeSm="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Revenue</IonCardTitle>
                    <IonCardSubtitle>$95k (+12%)</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Revenue Increase</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Transactions Card */}
              <IonCol sizeLg="3" sizeSm="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Transactions</IonCardTitle>
                    <IonCardSubtitle>12.1k (+38%)</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Daily Transactions</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            {/* Other sections */}
            <IonRow>
              <IonCol sizeLg="4" sizeSm="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Total Sales</IonCardTitle>
                    <IonCardSubtitle>$25,980 (+15.6%)</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Calculated in last 7 days</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol sizeLg="4" sizeSm="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Total Revenue</IonCardTitle>
                    <IonCardSubtitle>$35.4k</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Total Revenue</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol sizeLg="4" sizeSm="12">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Website Statistics</IonCardTitle>
                    <IonCardSubtitle>4,590</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>Total Traffic</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonSplitPane>
    </IonPage>
  );
};

export default Dashboard;
