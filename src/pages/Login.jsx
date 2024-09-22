import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonAlert } from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Home.css'; // Asegúrate de que el CSS esté cargado correctamente
import Logo from '/LOGO1.png'; // Actualiza a .png si es el formato correcto

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://192.168.1.77:8000/login/', 


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
            setAlertMessage('¡Inicio de sesión exitoso!');
            setShowAlert(true);
            // Redireccionar a otra página después del inicio de sesión
            history.push('/additional-info');
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

        <div className="header-container">
          <h2 className="welcome-text">¡BIENVENIDO!</h2>
        </div>
        <div className="login-container">
          <IonInput
            className="input"
            placeholder="Usuario / Email"
            value={username}
            onIonChange={e => setUsername(e.detail.value)}
          />
          <IonInput
            className="input"
            placeholder="Contraseña"
            type="password"
            value={password}
            onIonChange={e => setPassword(e.detail.value)}
          />
          <button className="button" onClick={handleLogin}>
            Iniciar Sesión
          </button>

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
