import React, { useState, useEffect } from 'react';
import NinoSanoForm from './NinoSanoForm';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Importamos useParams

const NinoSanoPage = () => {
  const { nino_id } = useParams(); // Obtenemos el nino_id de los parámetros de la URL
  const [baseInfo, setBaseInfo] = useState(null);

  useEffect(() => {
    const fetchBaseInfo = async () => {
      try {
        const response = await axios.get(`http://192.168.1.3:8000/api/nino-info/${nino_id}`); // Usamos nino_id
        setBaseInfo(response.data);
      } catch (error) {
        console.error('Error fetching base info:', error);
      }
    };

    fetchBaseInfo();
  }, [nino_id]);

  if (!baseInfo) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <NinoSanoForm baseInfo={baseInfo} />
    </div>
  );
};

export default NinoSanoPage;
