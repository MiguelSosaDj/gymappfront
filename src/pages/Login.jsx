import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonAlert } from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Home.css'; 
import Logo from '/LOGO1.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.3:8000/login/', 
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.access) {
        // Guardar los tokens en el almacenamiento local
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Mensaje de éxito y redirección
        setAlertMessage('¡Inicio de sesión exitoso!');
        setShowAlert(true);

        // Redirigir a la página siguiente después de un tiempo
        setTimeout(() => {
          setShowAlert(false);
          history.push('/additional-info');  // Cambiar la ruta a la que quieres redirigir después del login
        }, 1000);
        
      } else {
        setAlertMessage('Fallo en el inicio de sesión. Por favor, revisa tus credenciales.');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('Hubo un problema con la red o el servidor. Por favor, intenta nuevamente.');
      setShowAlert(true);
      console.error("Error en el inicio de sesión:", error);
    }
  };

  return (
    <IonPage>
      <IonContent className="dark-theme">
        {/* Puedes agregar el logo aquí */}
        <div className="header-container">
          <img src={Logo} alt="Logo" className="logo" />
          <h2 className="welcome-text">¡BIENVENIDO!</h2>
        </div>

        {/* Formulario de login */}
        <div className="login-container">
          <IonInput
            className="input"
            placeholder="Usuario / Email"
            value={username}
            onIonChange={e => setUsername(e.detail.value || '')}
          />
          <IonInput
            className="input"
            placeholder="Contraseña"
            type="password"
            value={password}
            onIonChange={e => setPassword(e.detail.value || '')}
          />
          <IonButton expand="block" onClick={handleLogin}>
            Iniciar Sesión
          </IonButton>

          {/* Alerta para mostrar mensajes */}
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Estado'}
            message={alertMessage}
            buttons={['OK']}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
