import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonRadioGroup, IonRadio, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonSelect, IonSelectOption } from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './AdditionalInfo.css'; // Estilos personalizados

const AdditionalInfo = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({});
  const [energiaExtraRequerida, setEnergiaExtraRequerida] = useState('Adecuado'); // Añadido el estado
  const [retencionPostParto, setRetencionPostParto] = useState(0); // Nuevo estado para retención post parto
  const history = useHistory();

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Si los campos "peso_actual" o "peso_pregestacional" cambian, recalculamos la retención post parto
    if (field === 'peso_actual' || field === 'peso_pregestacional') {
      const pesoActual = field === 'peso_actual' ? value : formData.peso_actual || 0;
      const pesoPregestacional = field === 'peso_pregestacional' ? value : formData.peso_pregestacional || 0;
      setRetencionPostParto(pesoActual - pesoPregestacional);
    }
  };
  //sosa
  const handleSubmit = async () => {
    let url = '';
  
    if (userType === 'niño') {
      url = 'http://192.168.1.3:8000/api/save-nino-info/';
    } else if (userType === 'lactante') {
      url = 'http://192.168.1.3:8000/api/save-lactante-info/';
    } else if (userType === 'gestante') {
      url = 'http://192.168.1.3:8000/api/save-gestante-info/';
    }
  
    try {
      const response = await axios.post(url, { ...formData, energia_extra_requerida: energiaExtraRequerida }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (response.status === 201) {
        console.log('Información guardada exitosamente:', response.data);
        history.push('/home');
      }
    } catch (error) {
      console.error('Error al guardar la información:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="header-title">Información Adicional</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="dark-theme">
        <div className="info-container">
          <div className="radio-column">
            <IonRadioGroup value={userType} onIonChange={e => setUserType(e.detail.value)}>
              <IonItem className="radio-item">
                <IonLabel>Gestante</IonLabel>
                <IonRadio slot="start" value="gestante" />
              </IonItem>
              <IonItem className="radio-item">
                <IonLabel>Lactante</IonLabel>
                <IonRadio slot="start" value="lactante" />
              </IonItem>
              <IonItem className="radio-item">
                <IonLabel>Niño</IonLabel>
                <IonRadio slot="start" value="niño" />
              </IonItem>
            </IonRadioGroup>
          </div>
          <div className="form-column">

            {userType === 'gestante' && (
              <>
                <IonLabel className="custom-label">Nombre:</IonLabel>
                <IonInput className="custom-input" placeholder="Nombre" onIonChange={e => handleInputChange('nombre', e.detail.value)} />

                <IonLabel className="custom-label">Edad:</IonLabel>
                <IonInput className="custom-input" placeholder="Edad" type="number" onIonChange={e => handleInputChange('edad', e.detail.value)} />

                <IonLabel className="custom-label">Identificación:</IonLabel>
                <IonInput className="custom-input" placeholder="Identificación" type="number" onIonChange={e => handleInputChange('identification', e.detail.value)} />

                <IonLabel className="custom-label">Estatura:</IonLabel>
                <IonInput className="custom-input" placeholder="Estatura" type="number" onIonChange={e => handleInputChange('estatura', e.detail.value)} />

                <IonLabel className="custom-label">Semana gestacional:</IonLabel>
                <IonInput className="custom-input" placeholder="Semana gestacional" type="number" onIonChange={e => handleInputChange('semana_gestacion', e.detail.value)} />

                <IonLabel className="custom-label">Peso actual:</IonLabel>
                <IonInput className="custom-input" placeholder="Peso actual" type="number" onIonChange={e => handleInputChange('peso_actual', e.detail.value)} />

                <IonLabel className="custom-label">Peso pregestacional:</IonLabel>
                <IonInput className="custom-input" placeholder="Peso pregestacional" type="number" onIonChange={e => handleInputChange('peso_pregestacional', e.detail.value)} />

                {/* Dropdown for "seleccion_multiple" */}
                <IonLabel className="custom-label">Clasificación:</IonLabel>
                  <IonSelect value={formData.seleccion_multiple} placeholder="Seleccione..." onIonChange={e => handleInputChange('seleccion_multiple', e.detail.value)}>
                    <IonSelectOption value="" disabled>Seleccione...</IonSelectOption> {/* Placeholder */}
                    <IonSelectOption value="bajo_peso">Bajo peso</IonSelectOption>
                    <IonSelectOption value="adecuado">Adecuado</IonSelectOption>
                    <IonSelectOption value="sobrepeso">Sobrepeso</IonSelectOption>
                    <IonSelectOption value="obesidad">Obesidad</IonSelectOption>
                    <IonSelectOption value="adolescente">Adolescente</IonSelectOption>
                    <IonSelectOption value="gemelar">Gemelar</IonSelectOption>
                  </IonSelect>

              </>
            )}

            {userType === 'lactante' && (
              <>
                <IonLabel className="custom-label">Nombre:</IonLabel>
                <IonInput className="custom-input" placeholder="Nombre" onIonChange={e => handleInputChange('nombre', e.detail.value)} />

                <IonLabel className="custom-label">Identificación:</IonLabel>
                <IonInput className="custom-input" placeholder="Identificación" type="number" onIonChange={e => handleInputChange('identification', e.detail.value)} />

                <IonLabel className="custom-label">Edad:</IonLabel>
                <IonInput className="custom-input" placeholder="Edad" type="number" onIonChange={e => handleInputChange('edad', e.detail.value)} />

                <IonLabel className="custom-label">Estatura:</IonLabel>
                <IonInput className="custom-input" placeholder="Estatura" type="number" onIonChange={e => handleInputChange('estatura', e.detail.value)} />

                <IonLabel className="custom-label">Peso actual:</IonLabel>
                <IonInput className="custom-input" placeholder="Peso actual" type="number" onIonChange={e => handleInputChange('peso_actual', e.detail.value)} />

                <IonLabel className="custom-label">Peso pregestacional:</IonLabel>
                <IonInput className="custom-input" placeholder="Peso pregestacional" type="number" onIonChange={e => handleInputChange('peso_pregestacional', e.detail.value)} />

                <IonLabel className="custom-label">Retención post parto:</IonLabel>
                <IonInput className="custom-input" value={retencionPostParto} placeholder="Retención post parto" readonly />

                <IonLabel className="custom-label">Días post parto:</IonLabel>
                <IonInput className="custom-input" placeholder="Días post parto" type="number" onIonChange={e => handleInputChange('dias_post_parto', e.detail.value)} />

                <IonItem className="form-item">
                  <IonLabel className="form-label">Detalle retención post parto:</IonLabel>
                  <IonSelect value={energiaExtraRequerida} onIonChange={e => setEnergiaExtraRequerida(e.detail.value)} className="form-input">
                    <IonSelectOption value="Inadecuado">Inadecuado</IonSelectOption>
                    <IonSelectOption value="Adecuado">Adecuado</IonSelectOption>
                    <IonSelectOption value="Exceso">Exceso</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </>
            )}

            {userType === 'niño' && (
              <>
                <IonLabel className="custom-label">Nombre:</IonLabel>
                <IonInput className="custom-input" placeholder="Nombre" onIonChange={e => handleInputChange('nombre', e.detail.value)} />

                <IonLabel className="custom-label">Identificación:</IonLabel>
                <IonInput className="custom-input" placeholder="Identificación" type="number" onIonChange={e => handleInputChange('identification', e.detail.value)} />

                <IonLabel className="custom-label">Sexo:</IonLabel>
                <IonInput className="custom-input" placeholder="Sexo" onIonChange={e => handleInputChange('sexo', e.detail.value)} />

                <IonLabel className="custom-label">Edad:</IonLabel>
                <IonInput className="custom-input" placeholder="Edad" type="number" onIonChange={e => handleInputChange('edad', e.detail.value)} />

                <IonLabel className="custom-label">Talla:</IonLabel>
                <IonInput className="custom-input" placeholder="Talla" type="number" onIonChange={e => handleInputChange('talla', e.detail.value)} />

                <IonLabel className="custom-label">Peso:</IonLabel>
                <IonInput className="custom-input" placeholder="Peso" type="number" onIonChange={e => handleInputChange('peso', e.detail.value)} />

                <IonLabel className="custom-label">Perímetro cefálico:</IonLabel>
                <IonInput className="custom-input" placeholder="Perímetro cefálico" type="number" onIonChange={e => handleInputChange('perimetro_cefalico', e.detail.value)} />
              </>
            )}

            <div className="button-section">
              <button className="button" expand="block" color="primary" onClick={() => history.push("/home")}>Ir al Home</button>
              <button className="button" expand="block" color="secondary" onClick={handleSubmit}>Guardar Información</button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdditionalInfo;
