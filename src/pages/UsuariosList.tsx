import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';

// Interfaz para tipificar los usuarios
interface Usuario {
  id: number;
  username: string;
  email: string;
}

const UsuariosList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Tipificamos usuarios
  const [token, setToken] = useState<string | null>(null);

  // Función de login para obtener el token
  const login = () => {
    axios.post('http://192.168.1.3:8000/api/token/', {
      username: 'miguel',
      password: 'miguel'
    })
    .then(response => {
      const { access } = response.data;
      setToken(access);
      fetchUsuarios(access); // Llamar a la función de obtener usuarios
    })
    .catch(error => {
      console.error('Error logging in:', error.response ? error.response.data : error);
    });
  };

  // Función para obtener la lista de usuarios con el token
  const fetchUsuarios = (token: string) => {
    axios.get('http://172.18.0.3:8000/api/usuarios/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setUsuarios(response.data); // Asignamos los usuarios a nuestro estado
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  // Efecto que se ejecuta al montar el componente para hacer login
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
