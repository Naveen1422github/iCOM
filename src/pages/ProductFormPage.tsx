import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonSplitPane } from '@ionic/react';
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
    reviews: [] // Start with an empty reviews array
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
      <IonContent className="product-form-content" id="main-content">
        <div className="container">
            <div className="row">
          <form className='form'>
              <h4>Product Details</h4>
              {/* Other product fields */}
              <div className="input-group input-group-icon">
                <IonLabel>ID</IonLabel>
                <IonInput name="id" value={product.id} onIonChange={handleInputChange} />
                <div className="input-icon">
                  <i className="fa fa-barcode"></i>
                </div>
              </div>

              <div className="input-group input-group-icon">
                <IonLabel>Name</IonLabel>
                <IonInput name="name" value={product.name} onIonChange={handleInputChange} />
                <div className="input-icon">
                  <i className="fa fa-tag"></i>
                </div>
              </div>

              <div className="input-group input-group-icon">
                <IonLabel>Code</IonLabel>
                <IonInput name="code" value={product.code} onIonChange={handleInputChange} />
                <div className="input-icon">
                  <i className="fa fa-code"></i>
                </div>
              </div>

              <div className="input-group input-group-icon">
                <IonLabel>Price</IonLabel>
                <IonInput name="price" value={product.price} onIonChange={handleInputChange} />
                <div className="input-icon">
                  <i className="fa fa-dollar-sign"></i>
                </div>
              </div>

              <div className="input-group">
                <IonLabel>Image URL</IonLabel>
                <IonInput name="img" value={product.img} onIonChange={handleInputChange} />
              </div>
              <div className="input-group">
                <IonLabel>Description</IonLabel>
                <IonInput name="description" value={product.description} onIonChange={handleInputChange} />
              </div>

              <div className="input-group">
                <IonLabel>Stock Status</IonLabel>
                <IonInput name="stockStatus" value={product.stockStatus} onIonChange={handleInputChange} />
              </div>

              <div className="input-group">
                <IonLabel>Overall Rating</IonLabel>
                <div className="rating_container">
                  <div className="container__items">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star}>
                        <input type="radio" name="overallRating" id={`st${star}`} value={star} onChange={(e) => setProduct(prev => ({ ...prev, rating: e.target.value }))} />
                        <label htmlFor={`st${star}`}>
                          {/* <div className="star-stroke"> */}
                            <div className="star-fill"></div>
                          {/* </div> */}
                          <div className="label-description" data-content={star === 5 ? "Excellent" : star === 4 ? "Good" : star === 3 ? "OK" : star === 2 ? "Bad" : "Terrible"}></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

              {/* User Reviews Section */}
              {product.reviews.map((review, index) => (
                  <div key={index} className="user-review" >
                  <div className="input-group input-group-icon">
                    <IonLabel>Reviewer Username</IonLabel>
                    <IonInput value={review.username} onIonChange={(e) => handleReviewChange(index, 'username', e.target.value)} />
                    <div className="input-icon">
                      <i className="fa fa-user"></i>
                    </div>
                  </div>

                  <div className="input-group input-group-icon">
                    <IonLabel>Review Comment</IonLabel>
                    <IonInput value={review.comment} onIonChange={(e) => handleReviewChange(index, 'comment', e.target.value)} />
                    <div className="input-icon">
                      <i className="fa fa-comment"></i>
                    </div>
                  </div>

                  <div className="input-group input-group-icon">
                    <IonLabel>Rating</IonLabel>
                    <div className="rating_container">
                      <div className="container__items">
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star}>
                            <input type="radio" name={`userRating${index}`} id={`userSt${star}${index}`} value={star} onChange={(e) => handleReviewChange(index, 'rating', e.target.value)} />
                            <label htmlFor={`userSt${star}${index}`}>
                              {/* <div className="star-stroke"> */}
                                <div className="star-fill"></div>
                              {/* </div> */}
                              <div className="label-description" data-content={star === 5 ? "Excellent" : star === 4 ? "Good" : star === 3 ? "OK" : star === 2 ? "Bad" : "Terrible"}></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="input-icon">
                      <i className="fa fa-star"></i>
                    </div>
                </div>
              </div>
              ))}

              </div>
              <IonButton onClick={addReviewField}>Add Review</IonButton>
              <IonButton onClick={handleSubmit}>Submit</IonButton>
              {message && <IonText color="primary">{message}</IonText>}
              </form>
              </div>
              </div>
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;
