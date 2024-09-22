import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

interface GestanteInfo {
  identificacion: string;
  nombre: string;
  edad: number;
  estatura: number;
  peso_actual: number;
  pesoPregestacional: number;
  imcPregestacional: string;
  imcGestacional: string;
  semanaGestacion: number;
}

interface BajoPesoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gestanteInfo: GestanteInfo | null;
  setGestanteInfo: React.Dispatch<React.SetStateAction<GestanteInfo | null>>;
  handleSubmit: () => Promise<void>;
}

const GestanteBajoPesoModal: React.FC<BajoPesoModalProps> = ({
  isOpen,
  onClose,
  gestanteInfo,
  setGestanteInfo,
  handleSubmit,
}) => {
  const [imcSaludable, setImcSaludable] = useState(22);
  const [pesoPregestacionalSaludable, setPesoPregestacionalSaludable] = useState(0);
  const [gramosSemana, setGramosSemana] = useState(400);
  const [gananciaPrimerTrimestre, setGananciaPrimerTrimestre] = useState(2);
  const [ganancia2y3TrimestreG, setGanancia2y3TrimestreG] = useState(0);
  const [ganancia2y3TrimestreKg, setGanancia2y3TrimestreKg] = useState(0);
  const [pesoTotalEmbarazo, setPesoTotalEmbarazo] = useState(0);
  const [imcSemana40, setImcSemana40] = useState(0);
  const [gananciaPesoEmbarazo, setGananciaPesoEmbarazo] = useState(0);
  const [ganado, setGanado] = useState(0);
  const [debioGanar, setDebioGanar] = useState(0);
  const [pesoAGanar, setPesoAGanar] = useState(0);
  const [semanasFaltantes, setSemanasFaltantes] = useState(0);
  const [gramosPorSemana, setGramosPorSemana] = useState(0);
  const [tasaMetabolica, setTasaMetabolica] = useState(0);
  const [factorActividadFisica, setFactorActividadFisica] = useState(1.4);
  const [requerimientoEnergia, setRequerimientoEnergia] = useState(0);
  const [metodo1GDia, setMetodo1GDia] = useState(0);
  const [metodo1Kcal, setMetodo1Kcal] = useState(0);
  const [metodo1Amdr, setMetodo1Amdr] = useState(0);
  const [metodo2GDia, setMetodo2GDia] = useState(0);
  const [metodo2Kcal, setMetodo2Kcal] = useState(0);
  const [metodo2Amdr, setMetodo2Amdr] = useState(0);

  // Título 1: Datos personales
  useEffect(() => {
    if (gestanteInfo?.estatura) {
      setPesoPregestacionalSaludable(imcSaludable * (gestanteInfo.estatura / 100) ** 2);
      setSemanasFaltantes(40 - gestanteInfo.semanaGestacion);
    }
  }, [imcSaludable, gestanteInfo]);

  // Título 3: Ganancia de peso (dependiente de gramos por semana)
  useEffect(() => {
    const gananciaGramos = gramosSemana * 27;
    const gananciaKg = gananciaGramos / 1000;
    setGanancia2y3TrimestreG(gananciaGramos);
    setGanancia2y3TrimestreKg(gananciaKg);
    setPesoTotalEmbarazo(gestanteInfo?.pesoPregestacional + gananciaKg + gananciaPrimerTrimestre);
    setImcSemana40(pesoTotalEmbarazo / (gestanteInfo?.estatura / 100) ** 2);
  }, [gramosSemana, gananciaPrimerTrimestre, gestanteInfo]);

  // Título 4: % de peso pregestacional saludable
  useEffect(() => {
    setGananciaPesoEmbarazo(pesoPregestacionalSaludable * 1.2);
  }, [pesoPregestacionalSaludable]);

  // Título 6: Reprogramación
  useEffect(() => {
    const pesoGanado = gestanteInfo ? gestanteInfo.peso_actual - gestanteInfo.pesoPregestacional : 0;
    setGanado(pesoGanado);
    const pesoDebioGanar = (gramosSemana / 1000) * semanasFaltantes;
    setDebioGanar(pesoDebioGanar);
    const pesoRestante = pesoPregestacionalSaludable - pesoGanado;
    setPesoAGanar(pesoRestante);
    const gramosSemanaCalc = (pesoRestante / semanasFaltantes) * 1000;
    setGramosPorSemana(gramosSemanaCalc);
  }, [gramosSemana, semanasFaltantes, gestanteInfo]);

  // Tasa metabólica
  useEffect(() => {
    if (gestanteInfo) {
      const tasa = gestanteInfo.edad < 30
        ? 14.818 * gestanteInfo.peso_actual + 486.6
        : 8.126 * gestanteInfo.peso_actual + 845.6;
      setTasaMetabolica(tasa);
    }
  }, [gestanteInfo]);

  // Requerimiento de energía
  useEffect(() => {
    setRequerimientoEnergia(tasaMetabolica * factorActividadFisica);
  }, [tasaMetabolica, factorActividadFisica]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bajo Peso - {gestanteInfo?.nombre}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {/* Título 1: Datos personales */}
          <h2>Datos personales</h2>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Nombre</IonLabel>
                <IonInput value={gestanteInfo?.nombre} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Edad</IonLabel>
                <IonInput value={gestanteInfo?.edad} readonly />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Estatura</IonLabel>
                <IonInput value={gestanteInfo?.estatura} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Semana de gestación</IonLabel>
                <IonInput value={gestanteInfo?.semanaGestacion} readonly />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Peso actual</IonLabel>
                <IonInput value={gestanteInfo?.peso_actual} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Peso pregestacional</IonLabel>
                <IonInput value={gestanteInfo?.pesoPregestacional} readonly />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>IMC pregestacional</IonLabel>
                <IonInput value={gestanteInfo?.imcPregestacional} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>IMC gestacional</IonLabel>
                <IonInput value={gestanteInfo?.imcGestacional} readonly />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Título 2: Peso de referencia */}
          <h2>Peso de referencia</h2>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>IMC Saludable</IonLabel>
                <IonInput
                  value={imcSaludable}
                  onIonChange={(e) => setImcSaludable(parseFloat(e.detail.value!))}
                />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Peso Pregestacional Saludable</IonLabel>
                <IonInput value={pesoPregestacionalSaludable.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Título 3: Ganancia de peso */}
          <h2>Ganancia de peso</h2>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Gramos por semana</IonLabel>
                <IonInput
                  value={gramosSemana}
                  onIonChange={(e) => setGramosSemana(parseFloat(e.detail.value!))}
                />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Ganancia 1° trimestre</IonLabel>
                <IonSelect
                  value={gananciaPrimerTrimestre}
                  onIonChange={(e) => setGananciaPrimerTrimestre(e.detail.value)}
                >
                  <IonSelectOption value={2}>2</IonSelectOption>
                  <IonSelectOption value={2.1}>2.1</IonSelectOption>
                  <IonSelectOption value={2.2}>2.2</IonSelectOption>
                  <IonSelectOption value={2.3}>2.3</IonSelectOption>
                  <IonSelectOption value={2.4}>2.4</IonSelectOption>
                  <IonSelectOption value={2.5}>2.5</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Ganancia 2° y 3° trimestre (g)</IonLabel>
                <IonInput value={ganancia2y3TrimestreG.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Ganancia 2° y 3° trimestre (kg)</IonLabel>
                <IonInput value={ganancia2y3TrimestreKg.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Peso total en todo el embarazo</IonLabel>
                <IonInput value={pesoTotalEmbarazo.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Título 4: % de peso pregestacional saludable */}
          <h2>% de peso pregestacional saludable</h2>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Ganancia de peso en el embarazo</IonLabel>
                <IonInput value={gananciaPesoEmbarazo.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Título 5: Evaluación de ganancia de peso */}
          <h2>Evaluación de ganancia de peso</h2>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Ganó</IonLabel>
                <IonInput value={ganado.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Debió ganar</IonLabel>
                <IonInput value={debioGanar.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Título 6: Reprogramación */}
          <h2>Reprogramación</h2>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Peso a ganar</IonLabel>
                <IonInput value={pesoAGanar.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Semanas faltantes</IonLabel>
                <IonInput value={semanasFaltantes} readonly />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Gramos por semana</IonLabel>
                <IonInput value={gramosPorSemana.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Título 7: Requerimiento de energía */}
          <h2>Requerimiento de energía</h2>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Tasa metabólica</IonLabel>
                <IonInput value={tasaMetabolica.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Factor de actividad física</IonLabel>
                <IonSelect
                  value={factorActividadFisica}
                  onIonChange={(e) => setFactorActividadFisica(parseFloat(e.detail.value!))}
                >
                  <IonSelectOption value={1.4}>1.4</IonSelectOption>
                  <IonSelectOption value={1.5}>1.5</IonSelectOption>
                  <IonSelectOption value={1.6}>1.6</IonSelectOption>
                  <IonSelectOption value={1.7}>1.7</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Requerimiento de energía</IonLabel>
                <IonInput value={requerimientoEnergia.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Título 8: Aporte proteico */}
          <h2>Aporte proteico</h2>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Método 1 (g/día)</IonLabel>
                <IonInput value={metodo1GDia.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Método 1 (Kcal)</IonLabel>
                <IonInput value={metodo1Kcal.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Método 1 (% AMDR)</IonLabel>
                <IonInput value={metodo1Amdr.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Método 2 (g/día)</IonLabel>
                <IonInput value={metodo2GDia.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Método 2 (Kcal)</IonLabel>
                <IonInput value={metodo2Kcal.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>Método 2 (% AMDR)</IonLabel>
                <IonInput value={metodo2Amdr.toFixed(2)} readonly />
              </IonItem>
            </IonCol>
          </IonRow>

          {/* Botón para guardar los datos */}
          <IonButton expand="block" onClick={handleSubmit}>
            Guardar
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default GestanteBajoPesoModal;
