// ProductFormPage.jsx
import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText } from '@ionic/react';
import { addDoc, collection } from 'firebase/firestore'; // Already initialized in your Firebase config
import { db } from '../firebaseConfig'; // Import db from your existing config
import './ProductFormPage.css';

const ProductFormPage = () => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    code: '',
    price: '',
    img: '',
    description: '',
    stockStatus: '',
    rating: '',
    category: '',
    reviews: [{ username: '', comment: '', rating: '' }]
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleReviewChange = (index, field, value) => {
    const updatedReviews = [...product.reviews];
    updatedReviews[index][field] = value;
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: updatedReviews,
    }));
  };

  const addReviewField = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: [...prevProduct.reviews, { username: '', comment: '', rating: '' }]
    }));
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "products"), product);
      setMessage("Product successfully added to Firebase!");
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Error adding product.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Product</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="product-form-content" >
      <IonItem className='items'>
  <div className='input-group'>
    <IonLabel>ID</IonLabel>
    <IonInput name="id" value={product.id} onIonChange={handleInputChange} />
  </div>
</IonItem>
<IonItem className='items'>
  <div className='input-group'>
    <IonLabel>Name</IonLabel>
    <IonInput name="name" value={product.name} onIonChange={handleInputChange} />
  </div>
</IonItem>
<IonItem className='items'>
  <div className='input-group'>
    <IonLabel>Code</IonLabel>
    <IonInput name="code" value={product.code} onIonChange={handleInputChange} />
  </div>
</IonItem>
<IonItem className='items'>
  <div className='input-group'>
    <IonLabel>Price</IonLabel>
    <IonInput name="price" value={product.price} onIonChange={handleInputChange} />
  </div>
</IonItem>

        <IonItem className='items'>
          <IonLabel>Image URL</IonLabel>
          <IonInput name="img" value={product.img} onIonChange={handleInputChange} />
        </IonItem>
        <IonItem className='items'>
          <IonLabel>Description</IonLabel>
          <IonInput name="description" value={product.description} onIonChange={handleInputChange} />
        </IonItem>
        <IonItem className='items'>
          <IonLabel>Stock Status</IonLabel>
          <IonInput name="stockStatus" value={product.stockStatus} onIonChange={handleInputChange} />
        </IonItem>
        <IonItem className='items'>
          <IonLabel>Rating</IonLabel>
          <IonInput name="rating" value={product.rating} onIonChange={handleInputChange} />
        </IonItem>
        <IonItem className='items'>
          <IonLabel>Category</IonLabel>
          <IonInput name="category" value={product.category} onIonChange={handleInputChange} />
        </IonItem>
        
        {product.reviews.map((review, index) => (
          <div key={index}>
            <IonItem className='items'>
              <IonLabel>Reviewer Username</IonLabel>
              <IonInput value={review.username} onIonChange={(e) => handleReviewChange(index, 'username', e.target.value)} />
            </IonItem>
            <IonItem className='items'>
              <IonLabel>Review Comment</IonLabel>
              <IonInput value={review.comment} onIonChange={(e) => handleReviewChange(index, 'comment', e.target.value)} />
            </IonItem>
            <IonItem className='items'>
              <IonLabel>Rating</IonLabel>
              <IonInput value={review.rating} onIonChange={(e) => handleReviewChange(index, 'rating', e.target.value)} />
            </IonItem>
          </div>
        ))}

        <IonButton onClick={addReviewField}>Add Review</IonButton>

        <IonButton onClick={handleSubmit}>Submit</IonButton>

        {message && <IonText color="primary">{message}</IonText>}
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;
