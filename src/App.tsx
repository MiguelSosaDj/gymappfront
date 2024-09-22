import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Login from './pages/Login.jsx'; 
import AdditionalInfo from './pages/AdditionalInfo.jsx';
import NinoSanoPage from './pages/NinoSanoPage.jsx'; // Importamos la página NinoSanoPage
import Home from './pages/Home';
import UsuariosList from './pages/UsuariosList';

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
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/additional-info" component={AdditionalInfo} />
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/usuarios">
          <UsuariosList />
        </Route>
        {/* Usamos NinoSanoPage en lugar de NinoSanoForm directamente */}
        <Route exact path="/nino-sano-form/:nino_id">
          <NinoSanoPage />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
