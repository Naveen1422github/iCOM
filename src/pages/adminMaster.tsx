import React, { useState } from 'react';
import { IonPage, IonSplitPane, IonContent } from '@ionic/react';
import './admin.css';
import Dashboard from './admin';
import DashboardMenu from './adminmenu';
import Coupon from './coupon';
import ProductFormPage from './ProductFormPage';

type PageType = 'dashboard' | 'productForm' | 'coupon';

const AdminMaster: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<PageType>('dashboard');

  return (
    <IonPage>
      <IonSplitPane contentId="main-content" when="md">
        {/* Use DashboardMenu directly without IonPage wrapper */}
        <DashboardMenu onSelectPage={(page: string) => setSelectedPage(page as PageType)} />
        
        {/* Main content area */}
        <IonContent id="main-content">
          {selectedPage === 'dashboard' && <Dashboard />}
          {selectedPage === 'productForm' && <ProductFormPage />}
          {selectedPage === 'coupon' && <Coupon />}
          {selectedPage !== 'dashboard' && selectedPage !== 'productForm' && selectedPage !== 'coupon' && <div>Page not found</div>}
        </IonContent>
      </IonSplitPane>
    </IonPage>
  );
};

export default AdminMaster;
