import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';

const UsuariosList: React.FC = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [token, setToken] = useState<string | null>(null);

  const login = () => {
    axios.post('192.168.1.77:8000/api/token/', {
      username: 'miguel',
      password: 'miguel'
    })
    .then(response => {
      const { access } = response.data;
      setToken(access);
      fetchUsuarios(access);
    })
    .catch(error => {
      console.error('Error logging in:', error.response ? error.response.data : error);
    });
  };

  const fetchUsuarios = (token: string) => {
    axios.get('192.168.1.77:8000/api/usuarios/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setUsuarios(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Usuarios List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {usuarios.map((usuario) => (
            <IonItem key={usuario.id}>
              <IonLabel>
                <h2>{usuario.username}</h2>
                <p>{usuario.email}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UsuariosList;
