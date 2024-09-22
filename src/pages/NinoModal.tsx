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
  ninoInfo: any;
  alimentacion: string;
  setAlimentacion: (value: string) => void;
  lecheMaternaExclusiva: number;
  setLecheMaternaExclusiva: (value: any) => void;
  formulaInfantil: number;
  setFormulaInfantil: (value: any) => void;
  lecheMaternaYFormula: number;
  setLecheMaternaYFormula: (value: any) => void;
  rango1A18: number;
  setRango1A18: (value: any) => void;
  pt: string;
  setPt: (value: string) => void;
  clasificacionPt: string;
  te: string;
  setTe: (value: string) => void;
  clasificacionTe: string;
  pce: string;
  setPce: (value: string) => void;
  clasificacionPce: string;
  gananciaPesoGr: string;
  calorias1gTejido: string;
  caloriasCrecimiento: number;
  vecesQueGane: number;
  setVecesQueGane: (value: any) => void;
  ajusteDeficit: number;
  caloriasTotales: number;
  handleSubmit: () => void;
}

const NinoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ninoInfo,
  alimentacion,
  setAlimentacion,
  lecheMaternaExclusiva,
  setLecheMaternaExclusiva,
  formulaInfantil,
  setFormulaInfantil,
  lecheMaternaYFormula,
  setLecheMaternaYFormula,
  rango1A18,
  setRango1A18,
  pt,
  setPt,
  clasificacionPt,
  te,
  setTe,
  clasificacionTe,
  pce,
  setPce,
  clasificacionPce,
  gananciaPesoGr,
  calorias1gTejido,
  caloriasCrecimiento,
  vecesQueGane,
  setVecesQueGane,
  ajusteDeficit,
  caloriasTotales,
  handleSubmit
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent className="dark-theme">
        <div className="form-container">
          <h2 className="form-title">Formulario Niño Sano</h2>

          <IonItem className="form-item">
            <IonLabel className="form-label">Nombre:</IonLabel>
            <IonInput value={ninoInfo?.nombre} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Sexo:</IonLabel>
            <IonInput value={ninoInfo?.sexo} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Edad:</IonLabel>
            <IonInput value={ninoInfo?.edad} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Talla (cm):</IonLabel>
            <IonInput value={ninoInfo?.talla} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Peso (kg):</IonLabel>
            <IonInput value={ninoInfo?.peso} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Perímetro Cefálico (cm):</IonLabel>
            <IonInput value={ninoInfo?.perimetro_cefalico} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Alimentación:</IonLabel>
            <IonSelect
              value={alimentacion}
              onIonChange={(e) => setAlimentacion(e.detail.value)}
              className="form-input"
            >
              <IonSelectOption value="Leche materna exclusiva">Leche materna exclusiva</IonSelectOption>
              <IonSelectOption value="Fórmula infantil">Fórmula infantil</IonSelectOption>
              <IonSelectOption value="Leche materna y fórmula">Leche materna y fórmula</IonSelectOption>
              <IonSelectOption value="No Aplica">No Aplica</IonSelectOption>
            </IonSelect>
          </IonItem>

          {alimentacion === 'Leche materna exclusiva' && (
            <IonItem className="form-item">
              <IonLabel className="form-label">Leche Materna Exclusiva (0 a 1 años):</IonLabel>
              <IonInput value={lecheMaternaExclusiva} onIonChange={(e) => setLecheMaternaExclusiva(e.detail.value)} />
            </IonItem>
          )}

          {alimentacion === 'Fórmula infantil' && (
            <IonItem className="form-item">
              <IonLabel className="form-label">Fórmula Infantil (0 a 1 años):</IonLabel>
              <IonInput value={formulaInfantil} onIonChange={(e) => setFormulaInfantil(e.detail.value)} />
            </IonItem>
          )}

          {alimentacion === 'Leche materna y fórmula' && (
            <IonItem className="form-item">
              <IonLabel className="form-label">Leche Materna y Fórmula (0 a 1 año):</IonLabel>
              <IonInput value={lecheMaternaYFormula} onIonChange={(e) => setLecheMaternaYFormula(e.detail.value)} />
            </IonItem>
          )}

          {ninoInfo?.edad >= 1 && ninoInfo?.edad <= 18 && (
            <IonItem className="form-item">
              <IonLabel className="form-label">Alimentación (1 a 18 años):</IonLabel>
              <IonInput value={rango1A18} onIonChange={(e) => setRango1A18(e.detail.value)} />
            </IonItem>
          )}

          <IonItem className="form-item">
            <IonLabel className="form-label">P/T:</IonLabel>
            <IonSelect value={pt} onIonChange={(e) => setPt(e.detail.value)} className="form-input">
              <IonSelectOption value="> +3">&gt; +3</IonSelectOption>
              <IonSelectOption value="> +2 a ≤ +3">&gt; +2 a &le; +3</IonSelectOption>
              <IonSelectOption value="> +1 a ≤ +2">&gt; +1 a &le; +2</IonSelectOption>
              <IonSelectOption value="≥ -1 a ≤ +1">&ge; -1 a &le; +1</IonSelectOption>
              <IonSelectOption value="≥ -2 a < -1">&ge; -2 a &lt; -1</IonSelectOption>
              <IonSelectOption value="< -2 a ≥ -3">&lt; -2 a &ge; -3</IonSelectOption>
              <IonSelectOption value="< -3">&lt; -3</IonSelectOption>
            </IonSelect>
            <IonInput value={clasificacionPt} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">T/E:</IonLabel>
            <IonSelect value={te} onIonChange={(e) => setTe(e.detail.value)} className="form-input">
              <IonSelectOption value="≥ -1">&ge; -1</IonSelectOption>
              <IonSelectOption value="≥ -2 a < -1">&ge; -2 a &lt; -1</IonSelectOption>
              <IonSelectOption value="< -2">&lt; -2</IonSelectOption>
            </IonSelect>
            <IonInput value={clasificacionTe} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">PC/E:</IonLabel>
            <IonSelect value={pce} onIonChange={(e) => setPce(e.detail.value)} className="form-input">
              <IonSelectOption value="> +2">&gt; +2</IonSelectOption>
              <IonSelectOption value="≥ -2 a ≤ 2">&ge; -2 a &le; 2</IonSelectOption>
              <IonSelectOption value="< -2">&lt; -2</IonSelectOption>
            </IonSelect>
            <IonInput value={clasificacionPce} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Ganancia de peso por gr:</IonLabel>
            <IonInput value={gananciaPesoGr} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Calorías para almacenar 1g de tejido:</IonLabel>
            <IonInput value={calorias1gTejido} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Calorías para crecimiento:</IonLabel>
            <IonInput value={caloriasCrecimiento.toFixed(1)} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Cuántas veces quiero que gane:</IonLabel>
            <IonSelect value={vecesQueGane} onIonChange={(e) => setVecesQueGane(e.detail.value)} className="form-input">
              <IonSelectOption value={1}>1</IonSelectOption>
              <IonSelectOption value={2}>2</IonSelectOption>
              <IonSelectOption value={3}>3</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Ajuste por déficit (5kcal):</IonLabel>
            <IonInput value={ajusteDeficit.toFixed(1)} disabled className="form-input" />
          </IonItem>

          <IonItem className="form-item">
            <IonLabel className="form-label">Kcalorías totales:</IonLabel>
            <IonInput value={caloriasTotales.toFixed(1)} disabled className="form-input" />
          </IonItem>

          <div className="button-container">
            <button className="button" onClick={handleSubmit}>
              Guardar Información
            </button>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default NinoModal;
