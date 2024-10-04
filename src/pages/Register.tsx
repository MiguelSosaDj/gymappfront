import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IonPage, IonContent, IonInput, IonButton, IonSelect, IonSelectOption, IonAlert } from '@ionic/react';

interface Gimnasio {
  id: number;
  nombre: string;
}

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gimnasio, setGimnasio] = useState<string | null>(null);
  const [gimnasios, setGimnasios] = useState<Gimnasio[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    // Fetch gimnasios
    axios
      .get('http://192.168.1.3:8000/api/gimnasios/')
      .then((response) => setGimnasios(response.data))
      .catch((error) => {
        console.error('Error fetching gimnasios: ', error);
        setAlertMessage('Error al cargar los gimnasios');
        setShowAlert(true);
      });
  }, []);

  const handleRegister = () => {
    if (!username || !password || !gimnasio) {
      setAlertMessage('Todos los campos son obligatorios.');
      setShowAlert(true);
      return;
    }

    axios
      .post('http://192.168.1.3:8000/api/register/', {
        username,
        password,
        gimnasio,
      })
      .then((response) => {
        console.log('Registro exitoso:', response.data);
        setAlertMessage('Registro exitoso');
        setShowAlert(true);
      })
      .catch((error) => {
        console.error('Error en el registro:', error);
        setAlertMessage('Error en el registro');
        setShowAlert(true);
      });
  };

  return (
    <IonPage>
      <IonContent>
        <IonInput placeholder="Username" value={username} onIonChange={(e) => setUsername(e.detail.value!)} />
        <IonInput placeholder="Password" type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
        <IonSelect placeholder="Selecciona Gimnasio" value={gimnasio} onIonChange={(e) => setGimnasio(e.detail.value)}>
          {gimnasios.map((gim) => (
            <IonSelectOption key={gim.id} value={gim.id}>
              {gim.nombre}
            </IonSelectOption>
          ))}
        </IonSelect>
        <IonButton onClick={handleRegister}>Registrarse</IonButton>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Estado'}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
