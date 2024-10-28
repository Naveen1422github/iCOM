import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  applyActionCode, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBu8W50tKhrnnDEnF4AvrM6nDZ2PCtSaRs",
  authDomain: "iecom-459d9.firebaseapp.com",
  projectId: "iecom-459d9",
  storageBucket: "iecom-459d9.appspot.com",
  messagingSenderId: "615508686467",
  appId: "1:615508686467:web:f8854b1f36c1f5eb0b8db6",
  measurementId: "G-EGCZGW8FYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore
export const storage = getStorage(app); // Initialize Storage if needed

/**i 
 * Logs in a user using email and password.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves to true if login is successful, otherwise false.
 */
export async function loginUser(email: string, password: string): Promise<boolean> {
    console.log("email", email, "password", password);
    
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login Successful:', res);
    return true;
  } catch (error: any) {
    // Detailed error handling
    if (error.code === 'auth/user-not-found') {
      console.error('User not found. Please check the email.');
    } else if (error.code === 'auth/wrong-password') {
      console.error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email format. Please enter a valid email.');
    } else if (error.code === 'auth/user-disabled') {
      console.error('This user has been disabled.');
    } else if (error.code === 'auth/invalid-credential') {
      console.error('Invalid credential. Please check your email and password.');
    } else {
      console.error('Login Failed:', error.message);
    }
    return false;
  }
}

export async function createCoupon(code: string, discount: number, expirationDate: Date): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'coupons'), {
      code,
      discount,
      expirationDate: Timestamp.fromDate(expirationDate),
      createdAt: Timestamp.now(),
    });
    console.log('Coupon created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating coupon:', error);
    return null;
  }
}

/**
 * Validate a coupon code for discounts.
 * @param code - The coupon code to validate.
 * @returns A promise that resolves to the coupon data if valid, otherwise null.
 */
export async function validateCoupon(code: string): Promise<any | null> {
  const q = query(collection(db, 'coupons'), where('code', '==', code));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const coupon = querySnapshot.docs[0].data();
    if (coupon.expirationDate.toDate() > new Date()) {
      console.log('Coupon is valid:', coupon);
      return coupon;
    } else {
      console.log('Coupon has expired');
      return null;
    }
  } else {
    console.log('Invalid coupon code');
    return null;
  }
}

/**
 * Registers a new user using email and password and sends a verification email.
 * @param email - The email of the new user.
 * @param password - The desired password of the new user.
 * @returns A promise that resolves to true if registration and email verification are successful, otherwise false.
 */
export async function registerUser(email: string, password: string): Promise<boolean> {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Registration Successful:', res);

    // Send verification email
    await sendEmailVerification(res.user, {
      url: 'https://main.d34dwu2oi6m3n8.amplifyapp.com/verify',  // Update this URL for production
    });
    console.log('Verification Email Sent');
    return true;
  } catch (error) {
    console.error('Registration Failed:', error);
    return false;
  }
}
