import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import LoginOtp from './pages/LoginOtp';
import Cart from './pages/Cart';
import userProfile from './pages/userProfile';
import Verify from './pages/Verify';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './contexts/CartContext'; // Import CartProvider
import ProductCategoryPage from './pages/ProductCategoryPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';


/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Import Dark Mode if needed */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import OrderDetails from './pages/OrderDetails';
import ProductFormPage from './pages/ProductFormPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <CartProvider> {/* Wrap the entire app with CartProvider */}
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={Login} exact />
          <Route path="/loginOtp" component={LoginOtp} exact />
          <Route path="/signup" component={SignUp} exact />
          <Route path="/home" component={Home} exact />
          <Route path="/cart" component={Cart} exact />
          <Route path="/userProfile" component={userProfile} exact />
          <Route exact path="/verify" component={Verify} />
          <Route path="/ProductDetails" component={ProductDetails} exact />
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <Route path="/orderDetails/:id" component={OrderDetails} exact />
          <Route path="/category/:category" component={ProductCategoryPage} />
          <Route path="/ProductFormPage" component={ProductFormPage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </CartProvider>
  </IonApp>
);

export default App;
