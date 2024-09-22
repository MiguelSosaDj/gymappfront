import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IonPage, IonContent, IonInput, IonButton, IonSelect, IonSelectOption, IonAlert } from '@ionic/react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gimnasio, setGimnasio] = useState('');
  const [gimnasios, setGimnasios] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Fetch gimnasios
    axios.get('192.168.1.77:8000/api/gimnasios/')
      .then(response => setGimnasios(response.data))
      .catch(error => console.error('Error fetching gimnasios: ', error));
  }, []);

  const handleRegister = () => {
    axios.post('192.168.1.77:8000/api/register/', {
      username,
      password,
      gimnasio: selectedGimnasio
    })
    .then(response => {
      console.log('Registro exitoso:', response.data);
    })
    .catch(error => {
      console.error('Error en el registro:', error);
    });
  };

  return (
    <IonPage>
      <IonContent>
        <IonInput placeholder="Username" value={username} onIonChange={e => setUsername(e.detail.value)} />
        <IonInput placeholder="Password" type="password" value={password} onIonChange={e => setPassword(e.detail.value)} />
        <IonSelect placeholder="Selecciona Gimnasio" value={gimnasio} onIonChange={e => setGimnasio(e.detail.value)}>
          {gimnasios.map(gim => (
            <IonSelectOption key={gim.id} value={gim.id}>{gim.nombre}</IonSelectOption>
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

