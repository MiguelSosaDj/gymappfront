import React, { useState } from 'react';
import { IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton } from '@ionic/react';
import axios from 'axios';

const NinoSanoForm = ({ baseInfo }) => {
  const [alimentacion, setAlimentacion] = useState('No Aplica');
  const [pt, setPt] = useState('');
  const [te, setTe] = useState('');
  const [pce, setPce] = useState('');
  const [gananciaPesoGr, setGananciaPesoGr] = useState('');
  const [calorias1gTejido, setCalorias1gTejido] = useState('');
  const [vecesQueGane, setVecesQueGane] = useState(1);

  const handleSubmit = async () => {
    const data = {
      base_info_id: baseInfo.id,
      alimentacion,
      pt,
      te,
      pce,
      ganancia_peso_gr: gananciaPesoGr,
      calorias_1g_tejido: calorias1gTejido,
      veces_que_gane: vecesQueGane,
    };

    try {
      const response = await axios.post('192.168.1.77:8000/api/nino-sano/', data);
      alert('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Error al guardar los datos');
    }
  };

  return (
    <IonContent>
      <h2>Formulario Niño Sano</h2>

      {/* Mostrar Información Básica */}
      <IonItem>
        <IonLabel>Nombre:</IonLabel>
        <IonInput value={baseInfo.nombre} disabled />
      </IonItem>

      <IonItem>
        <IonLabel>Sexo:</IonLabel>
        <IonInput value={baseInfo.sexo} disabled />
      </IonItem>

      <IonItem>
        <IonLabel>Edad:</IonLabel>
        <IonInput value={baseInfo.edad} disabled />
      </IonItem>

      <IonItem>
        <IonLabel>Talla (cm):</IonLabel>
        <IonInput value={baseInfo.talla} disabled />
      </IonItem>

      <IonItem>
        <IonLabel>Peso (kg):</IonLabel>
        <IonInput value={baseInfo.peso} disabled />
      </IonItem>

      <IonItem>
        <IonLabel>Perímetro Cefálico (cm):</IonLabel>
        <IonInput value={baseInfo.perimetro_cefalico} disabled />
      </IonItem>

      {/* Información para Estado Nutricional */}
      <IonItem>
        <IonLabel>Alimentación</IonLabel>
        <IonSelect value={alimentacion} onIonChange={(e) => setAlimentacion(e.detail.value)}>
          <IonSelectOption value="Leche materna exclusiva">Leche materna exclusiva</IonSelectOption>
          <IonSelectOption value="Fórmula infantil">Fórmula infantil</IonSelectOption>
          <IonSelectOption value="Leche materna y fórmula">Leche materna y fórmula</IonSelectOption>
          <IonSelectOption value="No Aplica">No Aplica</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>P/T</IonLabel>
        <IonSelect value={pt} onIonChange={(e) => setPt(e.detail.value)}>
          <IonSelectOption value="&gt; +3">&gt; +3</IonSelectOption>
          <IonSelectOption value="&gt; +2 a &le; +3">&gt; +2 a &le; +3</IonSelectOption>
          <IonSelectOption value="&gt; +1 a &le; +2">&gt; +1 a &le; +2</IonSelectOption>
          <IonSelectOption value="&ge; -1 a &le; +1">&ge; -1 a &le; +1</IonSelectOption>
          <IonSelectOption value="&ge; -2 a &lt; -1">&ge; -2 a &lt; -1</IonSelectOption>
          <IonSelectOption value="&lt; -2 a &ge; -3">&lt; -2 a &ge; -3</IonSelectOption>
          <IonSelectOption value="&lt; -3">&lt; -3</IonSelectOption>
          <IonSelectOption value="No Aplica">No Aplica</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>T/E</IonLabel>
        <IonSelect value={te} onIonChange={(e) => setTe(e.detail.value)}>
          <IonSelectOption value="&ge; -1">&ge; -1</IonSelectOption>
          <IonSelectOption value="&ge; -2 a &lt; -1">&ge; -2 a &lt; -1</IonSelectOption>
          <IonSelectOption value="&lt; -2">&lt; -2</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>PC/E</IonLabel>
        <IonSelect value={pce} onIonChange={(e) => setPce(e.detail.value)}>
          <IonSelectOption value="&gt; +2">&gt; +2</IonSelectOption>
          <IonSelectOption value="&ge; -2 a &le; 2">&ge; -2 a &le; 2</IonSelectOption>
          <IonSelectOption value="&lt; -2">&lt; -2</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>Ganancia de peso (g)</IonLabel>
        <IonInput value={gananciaPesoGr} onIonChange={(e) => setGananciaPesoGr(e.detail.value)} type="number" />
      </IonItem>

      <IonItem>
        <IonLabel>Calorías para 1g de tejido</IonLabel>
        <IonInput value={calorias1gTejido} onIonChange={(e) => setCalorias1gTejido(e.detail.value)} type="number" />
      </IonItem>

      <IonItem>
        <IonLabel>Cuántas veces quiero que gane</IonLabel>
        <IonSelect value={vecesQueGane} onIonChange={(e) => setVecesQueGane(e.detail.value)}>
          <IonSelectOption value={1}>1</IonSelectOption>
          <IonSelectOption value={2}>2</IonSelectOption>
          <IonSelectOption value={3}>3</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonButton onClick={handleSubmit}>Guardar</IonButton>
    </IonContent>
  );
};

export default NinoSanoForm;
