import React from 'react';
import { IonButton, IonIcon, IonText, IonItem } from '@ionic/react';
import { trash } from 'ionicons/icons';

const OrderItem = ({ product }) => {
  return (
    <div className="order-item">
      <IonItem>
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="order-details">
          <IonText>
            <h2>{product.name}</h2>
            <p>Quantity: {product.quantity}</p>
            <p>Selected Size: {product.selectedSize}</p>
          </IonText>
          <div className="size-options">
            {product.sizes.map(size => (
              <IonButton
                key={size}
                color={size === product.selectedSize ? 'primary' : 'light'}
              >
                {size}
              </IonButton>
            ))}
          </div>
        </div>
        <IonButton color="danger" slot="end">
          <IonIcon icon={trash} />
        </IonButton>
      </IonItem>
    </div>
  );
};

export default OrderItem;
