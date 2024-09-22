import React from 'react';
import {
  IonModal,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lactanteInfo: any;
  handleInputChange: (field: string, value: any) => void;
  factorActividadFisica: string;
  setFactorActividadFisica: (value: string) => void;
  tasaMetabolica: number;
  requerimientoEnergia: number;
  energiaExtraRequerida: number;
  handleSubmitLactante: () => void;
  calcularRequerimientoEnergia: (tasa: number, extra: number) => number;
}

const LactanteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lactanteInfo,
  handleInputChange,
  factorActividadFisica,
  setFactorActividadFisica,
  tasaMetabolica,
  requerimientoEnergia,
  energiaExtraRequerida,
  handleSubmitLactante,
  calcularRequerimientoEnergia,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent className="dark-theme">
        <div className="form-container">
          <h2 className="form-title">Formulario Lactante</h2>

          <IonItem className="form-item">
            <IonLabel className="form-label">Nombre:</IonLabel>
            <IonInput value={lactanteInfo?.nombre} disabled className="form-input" />
          </IonItem>
          <IonItem className="form-item">
            <IonLabel className="form-label">Identificación:</IonLabel>
            <IonInput value={lactanteInfo?.identificacion} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Edad:</IonLabel>
            <IonInput value={lactanteInfo?.edad} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Estatura (cm):</IonLabel>
            <IonInput
              value={lactanteInfo?.estatura}
              onIonChange={(e) => handleInputChange('estatura', e.detail.value)}
              className="form-input"
            />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Peso Actual (kg):</IonLabel>
            <IonInput
              value={lactanteInfo?.peso_actual}
              onIonChange={(e) => handleInputChange('peso_actual', e.detail.value)}
              className="form-input"
            />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">IMC Actual:</IonLabel>
            <IonInput value={lactanteInfo?.imc_actual} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Días Post Parto:</IonLabel>
            <IonInput
              value={lactanteInfo?.dias_post_parto}
              onIonChange={(e) => handleInputChange('dias_post_parto', e.detail.value)}
              className="form-input"
            />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Tasa Metabólica:</IonLabel>
            <IonInput value={tasaMetabolica} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Factor de Actividad Física:</IonLabel>
            <IonSelect
              value={factorActividadFisica}
              onIonChange={(e) => setFactorActividadFisica(e.detail.value)}
              className="form-input"
            >
              <IonSelectOption value="1.40">1.40</IonSelectOption>
              <IonSelectOption value="1.50">1.50</IonSelectOption>
              <IonSelectOption value="1.60">1.60</IonSelectOption>
              <IonSelectOption value="1.70">1.70</IonSelectOption>
              <IonSelectOption value="1.80">1.80</IonSelectOption>
              <IonSelectOption value="1.90">1.90</IonSelectOption>
              <IonSelectOption value="2.00">2.00</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Requerimiento de Energía:</IonLabel>
            <IonInput value={requerimientoEnergia} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Energía extra requerida:</IonLabel>
            <IonInput value={energiaExtraRequerida} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Requerimiento Total de Energía:</IonLabel>
            <IonInput
              value={calcularRequerimientoEnergia(requerimientoEnergia, energiaExtraRequerida)}
              disabled
              className="form-input"
            />
          </IonItem>

          <div className="button-container">
            <button className="button" onClick={handleSubmitLactante}>
              Guardar Información
            </button>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default LactanteModal;
