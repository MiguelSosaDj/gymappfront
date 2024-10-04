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
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale);
import './BajoPesoModal.css';

interface GestanteInfo {
  identificacion: string;
  nombre: string;
  edad: number;
  estatura: number;
  peso_actual: number;
  peso_pregestacional: number;
  imc_pregestacional: number;
  imc_gestacional: number;
  semana_gestacion: number;
  imc_pregestacional_cat: string;
}

interface SobrePesoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gestanteInfo: GestanteInfo | null;
  setGestanteInfo: React.Dispatch<React.SetStateAction<GestanteInfo | null>>;
}

const inputStyle = {
  borderRadius: '15px',
  color: '#fff',
  textAlign: 'center',
  backgroundColor: '#1c1c1e', /* Para los campos readonly */
};

const inputStyleEditable = {
  borderRadius: '15px',
  color: '#fff',
  textAlign: 'center',
  backgroundColor: '#5a5af5', /* Para los campos editables */
};




const GestanteSobrePesoModal: React.FC<SobrePesoModalProps> = ({
  isOpen,
  onClose,
  gestanteInfo,
  setGestanteInfo,
}) => {
  const [imcSaludable, setImcSaludable] = useState(22);
  const [pesoPregestacionalSaludable, setPesoPregestacionalSaludable] = useState(0);
  const [gramosSemana, setGramosSemana] = useState(400); // valor quemado
  const [gananciaPrimerTrimestre, setGananciaPrimerTrimestre] = useState(2);
  const [gananciaPrimerTrimestre2, setGananciaPrimerTrimestre2] = useState(2);
  const [ganancia2y3TrimestreG, setGanancia2y3TrimestreG] = useState(0);
  const [ganancia2y3TrimestreKg, setGanancia2y3TrimestreKg] = useState(0);
  const [pesoTotalEmbarazoTitulo3, setPesoTotalEmbarazoTitulo3] = useState(0); // Título 3 Peso Total
  const [pesoTotalEmbarazoTitulo4, setPesoTotalEmbarazoTitulo4] = useState(0); // Título 4 Peso Total
  const [imcSemana40, setImcSemana40] = useState(0);
  const [gananciaPesoEmbarazo, setGananciaPesoEmbarazo] = useState(0);
  const [ganado, setGanado] = useState(0);
  const [debioGanar, setDebioGanar] = useState(0);
  const [pesoAGanar, setPesoAGanar] = useState(0);
  const [semanasFaltantes, setSemanasFaltantes] = useState(20); // valor quemado
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
  const [chartData, setChartData] = useState<any>(null);
  const [gananciaTipo, setGananciaTipo] = useState('g/sem'); // Estado para el primer select (g/sem o %pps)
  const [clasificacionGramos, setClasificacionGramos] = useState('Adecuado');
  const [adicionGestante, setAdicionGestante] = useState(500); // Valor inicial 500



  const handleSubmit = async () => {
    if (gestanteInfo) {
      const postData = {
        identificacion: gestanteInfo.identificacion,
        nombre: gestanteInfo.nombre,
        edad: gestanteInfo.edad,
        estatura: gestanteInfo.estatura,
        peso_actual: gestanteInfo.peso_actual,
        peso_pregestacional: gestanteInfo.peso_pregestacional,
        imc_pregestacional: gestanteInfo.imc_pregestacional,
        imc_gestacional: gestanteInfo.imc_gestacional,
        semana_gestacion: gestanteInfo.semana_gestacion,
        imc_pregestacional_cat: gestanteInfo.imc_pregestacional_cat,
  
        // Título 2: Peso de referencia
        imc_saludable: imcSaludable,
        peso_pregestacional_saludable: pesoPregestacionalSaludable,
  
        // Título 3: Ganancia de peso
        gramos_semana: gramosSemana,
        ganancia_1_trimestre: gananciaPrimerTrimestre,
        ganancia_2_y_3_trimestre_gramos: ganancia2y3TrimestreG,
        ganancia_2_y_3_trimestre_kg: ganancia2y3TrimestreKg,
        peso_total_embarazo: pesoTotalEmbarazoTitulo3,
        peso_final: (ganancia2y3TrimestreKg + gananciaPrimerTrimestre).toFixed(1),
  
        // Título 4: % de peso pregestacional saludable
        ganancia_peso_embarazo: gananciaPesoEmbarazo, // Campo 1
        ganancia_peso_clasificacion: g_peso_cla, // Campo 2
        ganancia_primer_trimestre: gananciaPrimerTrimestre2, // Campo 3
        ganancia_2y3_trimestre_gsem: ((gananciaPesoEmbarazo - gananciaPrimerTrimestre2) / 27 * 1000).toFixed(2), // Campo 4
        peso_total_embarazo_titulo_4: pesoTotalEmbarazoTitulo4.toFixed(0), // Campo 5
        imc_semana_40: (gestanteInfo?.estatura ? (gestanteInfo.peso_pregestacional + gananciaPesoEmbarazo) / (gestanteInfo.estatura) ** 2 : 0).toFixed(0), // Campo 6
  
        // Título 5: Evaluación de ganancia de peso
        ganancia_tipo: gananciaTipo, // Campo 1
        gano: ganado.toFixed(0), // Campo 2
        debio_ganar: debioGanar.toFixed(0), // Campo 3
  
        // Título 6: Reprogramación
        peso_a_ganar: pesoAGanar.toFixed(1), // Campo 1
        semanas_faltantes: semanasFaltantes, // Campo 2
        gramos_por_semana: gramosPorSemana.toFixed(0), // Campo 3
        clasificacion_gramos: clasificacionGramos, // Campo 4
  
        // Título 7: Requerimiento de energía
        tasa_metabolica: tasaMetabolica,
        factor_actividad_fisica: factorActividadFisica,
        requerimiento_energia_total: requerimientoEnergia,
        adicion_gestante: adicionGestante,
        total_energia_adicion: (requerimientoEnergia + adicionGestante).toFixed(1),
  
        // Título 8: Aporte proteico
        metodo1_g_dia: metodo1GDia,
        metodo1_kcal: metodo1Kcal,
        metodo1_amdr: metodo1Amdr,
        metodo2_g_dia: metodo2GDia,
        metodo2_kcal: metodo2Kcal,
        metodo2_amdr: metodo2Amdr,
      };
  
      try {
        const response = await fetch('http://192.168.1.3:8000/sobrepeso/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
  
        if (response.ok) {
          console.log('Datos guardados correctamente');
        } else {
          console.error('Error al guardar los datos');
        }
      } catch (error) {
        console.error('Error en la solicitud', error);
      }
    }
  };
  

  // Cálculo de puntos para el gráfico
  useEffect(() => {
    if (gestanteInfo) {
      const imcGestacional = gestanteInfo.imc_gestacional;
      const imcPregestacional = gestanteInfo.imc_pregestacional;
      const semanasGestacion = gestanteInfo.semana_gestacion;
      const semana40 = 40; // Semana final de gestación
      const imcSemana40 = imcPregestacional + (imcGestacional - imcPregestacional) * (semana40 / semanasGestacion); // Calcular IMC en la semana 40 en función de la progresión del IMC actual

      // Configuración de los datos del gráfico
      setChartData({
        labels: [10, 16, 28, 40], // Semanas de gestación
        datasets: [
          {
            label: 'IMC en semanas clave',
            data: [
              { x: 10, y: imcPregestacional }, // Semana 10 (IMC pregestacional)
              { x: 16, y: imcGestacional }, // Semana 16 (IMC gestacional)
              { x: 28, y: imcGestacional + 1 }, // Semana 28 (IMC ajustado como ejemplo)
              { x: semana40, y: imcSemana40 }, // Semana 40 calculada
            ],
            borderColor: 'black',
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: ['black', 'black', 'green', 'green'], // Colores para los puntos
          },
        ],
      });
    }
  }, [gestanteInfo]);

  // Añadir una imagen de fondo
  const loadBackgroundImage = (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;

    const backgroundImage = new Image();
    backgroundImage.src = '/atalah.jpg'; // Ajusta la ruta de la imagen (según tu estructura de archivos)

    backgroundImage.onload = () => {
      // Dibuja la imagen de fondo dentro del área del gráfico
      ctx.drawImage(
        backgroundImage,
        chartArea.left,
        chartArea.top,
        chartArea.right - chartArea.left,
        chartArea.bottom - chartArea.top
      );
      chart.update();
    };
  };

  useEffect(() => {
    Chart.register({
      id: 'backgroundPlugin',
      beforeDraw: (chart) => {
        loadBackgroundImage(chart);
      },
    });
  }, []);

  // Título 1: Datos personales
  useEffect(() => {
    if (gestanteInfo?.estatura) {
      setPesoPregestacionalSaludable(imcSaludable * (gestanteInfo.estatura ) ** 2);
      setSemanasFaltantes(40 - (gestanteInfo.semana_gestacion || 0));
    }
  }, [imcSaludable, gestanteInfo]);

  // Título 3: Ganancia de peso (dependiente de gramos por semana)
  useEffect(() => {
    const gananciaGramos = gramosSemana * 27;
    const gananciaKg = gananciaGramos / 1000;
    setGanancia2y3TrimestreG(gananciaGramos);
    setGanancia2y3TrimestreKg(gananciaKg);

    if (gestanteInfo?.peso_pregestacional) {
      const pesoTotalTitulo3 = gestanteInfo.peso_pregestacional + (ganancia2y3TrimestreKg + gananciaPrimerTrimestre);
      setPesoTotalEmbarazoTitulo3(pesoTotalTitulo3); // Título 3 Peso Total
      setImcSemana40(gestanteInfo.estatura ? pesoTotalTitulo3 / (gestanteInfo.estatura / 100) ** 2 : 0);
    }
  }, [gramosSemana, gananciaPrimerTrimestre, gestanteInfo]);

  // Título 4: % de peso pregestacional saludable
  useEffect(() => {
    setGananciaPesoEmbarazo(Math.round(pesoPregestacionalSaludable * 0.30));
    if (gestanteInfo?.peso_pregestacional) {
      setPesoTotalEmbarazoTitulo4(gestanteInfo.peso_pregestacional + gananciaPesoEmbarazo); // Título 4 Peso Total
    }
  }, [pesoPregestacionalSaludable, gestanteInfo]);
  let gananciaPeso = Math.round(pesoPregestacionalSaludable * 0.30); // Calcula la ganancia de peso
  let g_peso_cla;

  if (gananciaPeso <= 7) {
    g_peso_cla = "Ganancia inadecuada por défit";
  } else if (gananciaPeso >= 10) {
    g_peso_cla = "Ganancia inadecuada por exceso";
  } else if (gananciaPeso > 7 && gananciaPeso < 10) {
    g_peso_cla = "Adecuado";
  }

  // Nueva fórmula según selección de gananciaTipo (g/sem o %pps)
  useEffect(() => {
    let resultadoFormula;
    if (gananciaTipo === 'g/sem') {
      resultadoFormula = (gramosSemana / 1000) * semanasFaltantes; // Fórmula para g/sem
    } else if (gananciaTipo === '%pps') {
      resultadoFormula = (pesoPregestacionalSaludable * semanasFaltantes) / 1000; // Fórmula para %pps
    }

    // Suma el valor seleccionado en gananciaPrimerTrimestre2
    const resultadoFinal = resultadoFormula + gananciaPrimerTrimestre2;
    setDebioGanar(resultadoFinal);
  }, [gananciaTipo, gramosSemana, semanasFaltantes, gananciaPrimerTrimestre2]);

  // Título 6: Reprogramación
  useEffect(() => {
    if (gestanteInfo) {
      const pesoGanado = gestanteInfo.peso_actual - (gestanteInfo.peso_pregestacional || 0);
      setGanado(pesoGanado);
  
      const pesoDebioGanar = (gramosSemana / 1000) * semanasFaltantes;
      setDebioGanar(pesoDebioGanar);
  
      let pesoRestante;
  
      // Condición basada en el tipo de ganancia seleccionado
      if (gananciaTipo === 'g/sem') {
        // Si es "g/sem", el cálculo será "PESO FINAL - GANO"
        const pesoFinal = (ganancia2y3TrimestreKg + gananciaPrimerTrimestre).toFixed(1); // Peso final calculado
        pesoRestante = pesoFinal - pesoGanado;
      } else if (gananciaTipo === '%pps') {
        // Si es "%pps", el cálculo será "Ganancia de peso en el embarazo - GANO"
        pesoRestante = gananciaPesoEmbarazo - pesoGanado;
      }
      setPesoAGanar(pesoRestante);
  
      const gramosSemanaCalc = semanasFaltantes ? (pesoRestante / semanasFaltantes) * 1000 : 0;
      setGramosPorSemana(gramosSemanaCalc);
  
      // Clasificación de gramos por semana
      let clasificacion;
      if (gramosPorSemana < 200) {
        clasificacion = "Riesgo de bajo peso";
      } else if (gramosPorSemana > 700) {
        clasificacion = "Riesgo de sobrepeso";
      } else {
        clasificacion = "Adecuado";
      }
      setClasificacionGramos(clasificacion);
  
    }
  }, [gananciaTipo, gramosSemana, semanasFaltantes, gestanteInfo, gananciaPesoEmbarazo]);
  
  

  // Tasa metabólica
  useEffect(() => {
    if (gestanteInfo) {
      const tasa = gestanteInfo.edad < 30
        ? 14.818 * pesoPregestacionalSaludable.toFixed(2) + 486.6
        : 8.126 * pesoPregestacionalSaludable.toFixed(2) + 845.6;
      setTasaMetabolica(tasa);
    }
  }, [gestanteInfo]);

  // Requerimiento de energía
  useEffect(() => {
    setRequerimientoEnergia(tasaMetabolica * factorActividadFisica);
  }, [tasaMetabolica, factorActividadFisica]);

  // Aporte proteico - Métodos
  useEffect(() => {
    if (gestanteInfo?.peso_actual && requerimientoEnergia) {
      // Método 1
      const metodo1GramosDia = 1.53 * gestanteInfo.peso_actual;
      const metodo1Kcal = metodo1GramosDia * 4;
      const metodo1Amdr = metodo1Kcal / requerimientoEnergia;
      setMetodo1GDia(metodo1GramosDia);
      setMetodo1Kcal(metodo1Kcal);
      setMetodo1Amdr(metodo1Amdr);

      // Método 2
      const metodo2GramosDia = 1.1 * gestanteInfo.peso_actual + 35;
      const metodo2Kcal = metodo2GramosDia * 4;
      const metodo2Amdr = metodo2Kcal / requerimientoEnergia;
      setMetodo2GDia(metodo2GramosDia);
      setMetodo2Kcal(metodo2Kcal);
      setMetodo2Amdr(metodo2Amdr);
    }
  }, [gestanteInfo, requerimientoEnergia]);

  // Estilos para diseño dark y moderno
  const itemStyle = {
    background: '#222',
    borderRadius: '15px',
    marginBottom: '10px',
  };

  const labelStyle = {
    color: '#fff',
    fontSize: '14px',
    marginTop: '5px',
  };

  const inputStyle = {
    borderRadius: '15px',
    color: '#fff',
    textAlign: 'center' as const,
    backgroundColor: '#333',
  };

  const titleStyle = {
    textAlign: 'center' as const,
    color: '#fff',
    marginTop: '20px',
    marginBottom: '10px',
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
  <IonHeader>
    <IonToolbar>
      <IonTitle>Sobre Peso - {gestanteInfo?.nombre}</IonTitle>
    </IonToolbar>
  </IonHeader>
  <IonContent>
    <IonGrid>
      {/* Título 1: Datos personales */}
      <h2 style={titleStyle}>Datos personales</h2>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Nombre</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.nombre} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Edad</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.edad} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Estatura</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.estatura} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Semana de gestación</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.semana_gestacion} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Peso<br /> actual</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.peso_actual} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Peso<br /> pregestacional</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.peso_pregestacional} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>IMC<br /> gestacional</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.imc_gestacional?.toFixed(1)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>IMC <br />pregestacional</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.imc_pregestacional?.toFixed(1)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>IMC<br /> Categoría</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gestanteInfo?.imc_pregestacional_cat} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>

      {/* Título 2: Peso de referencia */}
      <h2 style={titleStyle}>Peso de referencia</h2>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>IMC<br /> Saludable</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput
              value={imcSaludable}
              onIonChange={(e) => setImcSaludable(parseFloat(e.detail.value!))}
              style={inputStyleEditable}
            />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Peso Pregestacional Saludable</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={pesoPregestacionalSaludable.toFixed(1)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>

      {/* Título 3: Ganancia de peso */}
      <h2 style={titleStyle}>Ganancia de peso</h2>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Gramos por semana</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput
              value={gramosSemana}
              onIonChange={(e) => setGramosSemana(parseFloat(e.detail.value!))}
              style={inputStyleEditable}
            />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Ganancia 1° trimestre</IonLabel>
          <IonItem style={itemStyle}>
            <IonSelect
              value={gananciaPrimerTrimestre}
              onIonChange={(e) => setGananciaPrimerTrimestre(e.detail.value)}
              style={inputStyleEditable}
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
          <IonLabel position="stacked" style={labelStyle}>Ganancia 2° y 3° trimestre <br />(g)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={ganancia2y3TrimestreG.toFixed(2)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Ganancia 2° y 3° trimestre (kg)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={ganancia2y3TrimestreKg.toFixed(2)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Peso<br /> Final</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput 
              value={(ganancia2y3TrimestreKg + gananciaPrimerTrimestre).toFixed(1)}
              readonly
              style={inputStyle}
            />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Peso total en todo el embarazo (Título 3)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={pesoTotalEmbarazoTitulo3.toFixed(1)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>

      {/* Título 4: % de peso pregestacional saludable */}
      <h2 style={titleStyle}>% de peso pregestacional saludable</h2>
      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonLabel position="stacked" style={labelStyle}>Ganancia de peso en el embarazo</IonLabel>
            <IonItem style={itemStyle}>
              <IonInput value={gananciaPesoEmbarazo.toFixed(1)} readonly style={inputStyle} />
            </IonItem>
          </IonCol>
          <IonCol size="6">
            <IonLabel position="stacked" style={labelStyle}>Ganancia de peso clasificación </IonLabel>
            <IonItem style={itemStyle}>
              <IonInput value={g_peso_cla} readonly style={inputStyle} />
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="6">
            <IonLabel position="stacked" style={labelStyle}>Ganancia 1° <br />trimestre</IonLabel>
            <IonItem style={itemStyle}>
              <IonSelect
                value={gananciaPrimerTrimestre2}
                onIonChange={(e) => setGananciaPrimerTrimestre2(e.detail.value)}
                style={inputStyleEditable}
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
          <IonCol size="6">
            <IonLabel position="stacked" style={labelStyle}>Ganancia 2° y 3° trimestre (g/sem)</IonLabel>
            <IonItem style={itemStyle}>
              <IonInput
                value={((gananciaPesoEmbarazo - gananciaPrimerTrimestre2) / 27 * 1000).toFixed(2)}
                readonly
                style={inputStyle}
              />
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          
          <IonCol size="6">
            <IonLabel position="stacked" style={labelStyle}>Peso total en todo el embarazo (Título 4)</IonLabel>
            <IonItem style={itemStyle}>
              <IonInput value={pesoTotalEmbarazoTitulo4.toFixed(0)} readonly style={inputStyle} />
            </IonItem>
          </IonCol>
          <IonCol size="6">
            <IonLabel position="stacked" style={labelStyle}>IMC<br /> semana 40</IonLabel>
            <IonItem style={itemStyle}>
              <IonInput
                value={(gestanteInfo?.estatura ? (gestanteInfo.peso_pregestacional + gananciaPesoEmbarazo) / (gestanteInfo.estatura) ** 2 : 0).toFixed(0)}
                readonly
                style={inputStyle}
              />
            </IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>

      {/* Título 5: Evaluación de ganancia de peso */}
      <h2 style={titleStyle}>Evaluación de ganancia de peso</h2>
          <IonItem style={itemStyle}>
              <IonSelect
                value={gananciaTipo}
                onIonChange={(e) => setGananciaTipo(e.detail.value)}
                style={inputStyleEditable}
              >
                <IonSelectOption value={'g/sem'}>g/sem</IonSelectOption>
                <IonSelectOption value={'%pps'}>%pps</IonSelectOption>
              </IonSelect>
            </IonItem>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Ganó</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={ganado.toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Debió ganar</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={debioGanar.toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>

      {/* Título 6: Reprogramación */}
      <h2 style={titleStyle}>Reprogramación</h2>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Peso a ganar</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={pesoAGanar.toFixed(1)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Semanas faltantes</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={semanasFaltantes} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Gramos por semana</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={gramosPorSemana.toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Gramos Clasificación</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={clasificacionGramos} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>


      {/* Título 7: Requerimiento de energía */}
      <h2 style={titleStyle}>Requerimiento de energía</h2>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Tasa metabólica</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={tasaMetabolica.toFixed(2)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Factor de actividad física</IonLabel>
          <IonItem style={itemStyle}>
            <IonSelect
              value={factorActividadFisica}
              onIonChange={(e) => setFactorActividadFisica(parseFloat(e.detail.value!))}
              style={inputStyleEditable}
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
          <IonLabel position="stacked" style={labelStyle}>Requerimiento de energía</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={requerimientoEnergia.toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>

        {/* Adición gestante */}
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Adición<br /> gestante</IonLabel>
          <IonItem style={itemStyle}>
            <IonSelect
              value={adicionGestante}
              onIonChange={(e) => setAdicionGestante(e.detail.value)}
              style={inputStyleEditable}
            >
              <IonSelectOption value={500}>500</IonSelectOption>
              <IonSelectOption value={360}>360</IonSelectOption>
              <IonSelectOption value={250}>250</IonSelectOption>
              <IonSelectOption value={200}>200</IonSelectOption>
              <IonSelectOption value={100}>100</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonCol>

        {/* Suma de Requerimiento de energía y Adición gestante */}
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Total energía + Adición</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={(requerimientoEnergia + adicionGestante).toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>


      {/* Título 8: Aporte proteico */}
      <h2 style={titleStyle}>Aporte proteico</h2>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Método 1 <br />(g/día)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={metodo1GDia.toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Método 1<br /> (Kcal)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={metodo1Kcal.toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Método 1 <br />(% AMDR)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={`${(metodo1Amdr * 100).toFixed(0)}%`} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Método 2<br /> (g/día)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={metodo2GDia.toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Método 2<br /> (Kcal)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={metodo2Kcal.toFixed(0)} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
        <IonCol>
          <IonLabel position="stacked" style={labelStyle}>Método 2<br /> (% AMDR)</IonLabel>
          <IonItem style={itemStyle}>
            <IonInput value={`${(metodo2Amdr * 100).toFixed(0)}%`} readonly style={inputStyle} />
          </IonItem>
        </IonCol>
      </IonRow>

          {/* Gráfico de Atalah */}
          {chartData && (
            <IonRow>
              <IonCol>
                <h2 style={titleStyle}>Gráfico de IMC - Atalah</h2>
                <Line
                  data={chartData}
                  options={{
                    scales: {
                      x: { type: 'linear', title: { display: true, text: 'Semanas de gestación' } },
                      y: { title: { display: true, text: 'IMC' } },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (tooltipItem) => {
                            const semana = tooltipItem.raw.x;
                            const imc = tooltipItem.raw.y;
                            return `Semana ${semana}: IMC ${imc}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </IonCol>
            </IonRow>
          )}
          {/* Botón para guardar los datos */}
          <IonButton expand="block" onClick={handleSubmit}>
            Guardar
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default GestanteSobrePesoModal;

