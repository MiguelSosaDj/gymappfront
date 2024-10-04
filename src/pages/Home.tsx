import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonButtons,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonLabel,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './home_two.css';
import './BajoPesoModal.css';


// Importar modales
import LactanteModal from './LactanteModal';
import NinoModal from './NinoModal';
import GestanteBajoPesoModal from './GestanteBajoPesoModal';
import GestanteSobrePesoModal from './GestanteSobrePesoModal';

interface Persona {
  id: number;
  nombre: string;
}

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
  seleccion_multiple: string;

}


interface LactanteInfo {
  nombre: string;
  identificacion: string;
  edad: number;
  estatura: number;
  peso_actual: number;
  peso_pregestacional: number;
  imc_actual: string;
  dias_post_parto: number;
  retencion_post_parto_detalle: string;
  retencion_post_parto: string;
}

interface NinoInfo {
  id: number;
  nombre: string;
  edad: number;
  estatura: number;
  sexo: string;
  peso: number;
  talla: number;
  perimetro_cefalico: number;
}

const Home: React.FC = () => {
  const [categoria, setCategoria] = useState<string | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<number | null>(null);
  const [gestanteInfo, setGestanteInfo] = useState<GestanteInfo | null>(null);
  const [lactanteInfo, setLactanteInfo] = useState<LactanteInfo | null>(null);
  const [ninoInfo, setNinoInfo] = useState<NinoInfo | null>(null);
  const [isModalNinoOpen, setIsModalNinoOpen] = useState(false);
  const [isModalLactanteOpen, setIsModalLactanteOpen] = useState(false);
  const [isModalGestanteOpen, setIsModalGestanteOpen] = useState(false);

  // Estado para Niño Sano
  const [alimentacion, setAlimentacion] = useState('No Aplica');
  const [pt, setPt] = useState('');
  const [te, setTe] = useState('');
  const [pce, setPce] = useState('');
  const [clasificacionPt, setClasificacionPt] = useState('');
  const [clasificacionTe, setClasificacionTe] = useState('');
  const [clasificacionPce, setClasificacionPce] = useState('');
  const [gananciaPesoGr, setGananciaPesoGr] = useState('39.9');
  const [calorias1gTejido, setCalorias1gTejido] = useState('6');
  const [vecesQueGane, setVecesQueGane] = useState(1);
  const [caloriasCrecimiento, setCaloriasCrecimiento] = useState(0);
  const [ajusteDeficit, setAjusteDeficit] = useState(0);
  const [caloriasTotales, setCaloriasTotales] = useState(0);

  // Estado para Lactante
  const [lecheMaternaExclusiva, setLecheMaternaExclusiva] = useState(0);
  const [formulaInfantil, setFormulaInfantil] = useState(0);
  const [lecheMaternaYFormula, setLecheMaternaYFormula] = useState(0);
  const [rango1A18, setRango1A18] = useState(0);

  // Estado compartido entre Lactante y Niño
  const [factorActividadFisica, setFactorActividadFisica] = useState('1.40');
  const [energiaExtraRequerida, setEnergiaExtraRequerida] = useState<number>(500);
  const [tasaMetabolica, setTasaMetabolica] = useState<number>(0);
  const [requerimientoEnergia, setRequerimientoEnergia] = useState<number>(0);

  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    history.push('/login');
  };

  const calcularIMC = (peso: number, estatura: number) => {
    if (estatura > 0) {
      const estaturaMetros = estatura / 100; // Convertir a metros
      return (peso / (estaturaMetros * estaturaMetros)).toFixed(2); // Calcular y retornar con dos decimales
    }
    return null;
  };

  // Función para calcular la tasa metabólica basada en edad y peso
  const calcularTasaMetabolica = (edad: number, peso: number) => {
    if (edad < 30) {
      return (14.818 * peso) + 486.6;
    } else {
      return (8.126 * peso) + 845.6;
    }
  };

  // Función para calcular el requerimiento energético
  const calcularRequerimientoEnergia = (tasaMetabolica: number, factorActividad: number) => {
    return tasaMetabolica + factorActividad;
  };

  // Manejar el cálculo de energía para lactante
  const handleCalculoEnergia = () => {
    if (lactanteInfo && lactanteInfo.edad && lactanteInfo.peso_actual) {
      const tasa = calcularTasaMetabolica(lactanteInfo.edad, lactanteInfo.peso_actual);
      setTasaMetabolica(tasa);
      const requerimiento = calcularRequerimientoEnergia(tasa, parseFloat(factorActividadFisica));
      setRequerimientoEnergia(requerimiento);
    } else {
      alert('Faltan datos de edad o peso para calcular la tasa metabólica.');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setLactanteInfo((prevState) => {
      if (prevState) {
        const updatedLactanteInfo = { ...prevState, [field]: value };

        if (field === 'peso_actual' || field === 'estatura') {
          const nuevoIMC = calcularIMC(updatedLactanteInfo.peso_actual, updatedLactanteInfo.estatura);
          updatedLactanteInfo.imc_actual = nuevoIMC ? nuevoIMC : '';
        }

        return updatedLactanteInfo;
      }
      return null;
    });
  };

  useEffect(() => {
    if (categoria) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Error: No se encontró el token de autenticación. Inicia sesión nuevamente.');
        history.push('/login');
        return;
      }

      axios
        .get(`http://192.168.1.3:8000/api/home-data/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          if (categoria === 'gestante') {
            setPersonas(data.gestante_info);
          } else if (categoria === 'lactante') {
            setPersonas(data.lactante_info);
          } else if (categoria === 'nino') {
            setPersonas(data.nino_info);
          }
        })
        .catch((error) => {
          console.error('Error fetching personas: ', error);
        });
    }
  }, [categoria]);

  useEffect(() => {
    if (selectedPersona !== null) {
      const persona = personas.find((p) => p.id === selectedPersona);

      if (categoria === 'gestante') {
        setGestanteInfo(persona as unknown as GestanteInfo);
        setLactanteInfo(null);
        setNinoInfo(null);
      } else if (categoria === 'lactante') {
        setLactanteInfo(persona as unknown as LactanteInfo);
        setGestanteInfo(null);
        setNinoInfo(null);
      } else if (categoria === 'nino') {
        setNinoInfo(persona as unknown as NinoInfo);
        setGestanteInfo(null);
        setLactanteInfo(null);
      }
    }
  }, [selectedPersona, categoria, personas]);

  useEffect(() => {
    if (lactanteInfo) {
      handleCalculoEnergia();
    }
  }, [lactanteInfo, factorActividadFisica]);

  useEffect(() => {
    const caloriasCrecimiento = parseFloat(gananciaPesoGr) * parseFloat(calorias1gTejido) * vecesQueGane;
    setCaloriasCrecimiento(caloriasCrecimiento);

    const ajusteDeficit = caloriasCrecimiento - 5;
    setAjusteDeficit(ajusteDeficit);

    const caloriasTotales = caloriasCrecimiento + ajusteDeficit;
    setCaloriasTotales(caloriasTotales);
  }, [gananciaPesoGr, calorias1gTejido, vecesQueGane]);

  const handleSubmitGestante = async () => {
    const token = localStorage.getItem('access_token');
  
    if (!gestanteInfo) {
      alert('No hay información de gestante disponible para guardar.');
      return;
    }
  
    const data = {
      identificacion: gestanteInfo.identificacion,
      nombre: gestanteInfo.nombre,
      edad: gestanteInfo.edad,
      estatura: gestanteInfo.estatura,
      peso_actual: gestanteInfo.peso_actual,
      peso_pregestacional: gestanteInfo.pesoPregestacional,
      imc_pregestacional: gestanteInfo.imcPregestacional,
      imc_gestacional: gestanteInfo.imcGestacional,
      semana_gestacion: gestanteInfo.semanaGestacion,
    };
  
    if (!token) {
      alert('No se encontró un token de autenticación. Inicia sesión.');
      return;
    }
  
    try {
      await axios.post('http://192.168.1.3:8000/gestante/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Datos de gestante guardados correctamente');
    } catch (error) {
      console.error('Error al guardar los datos de gestante:', error);
      alert('Error al guardar los datos de gestante');
    }
  };
  
  const handleSubmitLactante = async () => {
    const token = localStorage.getItem('access_token');

    if (!lactanteInfo) {
      alert('No hay información de lactante disponible para guardar.');
      return;
    }

    const data = {
      identificacion: lactanteInfo.identificacion,
      nombre: lactanteInfo.nombre,
      edad: lactanteInfo.edad,
      estatura: lactanteInfo.estatura,
      peso_actual: lactanteInfo.peso_actual,
      peso_pregestacional: lactanteInfo.peso_pregestacional,
      imc_actual: lactanteInfo.imc_actual,
      dias_post_parto: lactanteInfo.dias_post_parto,
      retencion_post_parto: lactanteInfo.retencion_post_parto,
      retencion_post_parto_detalle: lactanteInfo.retencion_post_parto_detalle,
      tasa_metabolica: tasaMetabolica,
      requerimiento_energia: requerimientoEnergia,
      energia_extra_requerida: energiaExtraRequerida,
      factor_actividad_fisica: factorActividadFisica,
      requerimiento_total_energia: calcularRequerimientoEnergia(requerimientoEnergia, energiaExtraRequerida),
    };

    if (!token) {
      alert('No se encontró un token de autenticación. Inicia sesión.');
      return;
    }

    try {
      await axios.post('http://192.168.1.3:8000/lactante/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Datos de lactante guardados correctamente');
    } catch (error) {
      console.error('Error al guardar los datos de lactante:', error);
      alert('Error al guardar los datos de lactante');
    }
  };

  const calcularClasificacionPt = (valor: string) => {
    if (valor === '> +3') return 'Obesidad';
    if (valor === '> +2 a ≤ +3') return 'Sobrepeso';
    if (valor === '> +1 a ≤ +2') return 'Riesgo de sobrepeso';
    if (valor === '≥ -1 a ≤ +1') return 'Adecuado para la talla';
    if (valor === '≥ -2 a < -1') return 'Riesgo de desnutrición aguda';
    if (valor === '< -2 a ≥ -3') return 'Desnutrición aguda moderada';
    if (valor === '< -3') return 'Desnutrición aguda severa';
    return 'No Aplica';
  };

  const calcularClasificacionTe = (valor: string) => {
    if (valor === '≥ -1') return 'Adecuado para la edad';
    if (valor === '≥ -2 a < -1') return 'Riesgo de talla baja';
    if (valor === '< -2') return 'Retraso en talla';
    return 'No Aplica';
  };

  const calcularClasificacionPce = (valor: string) => {
    if (valor === '> +2') return 'Riesgo para neurodesarrollo';
    if (valor === '≥ -2 a ≤ 2') return 'Normal';
    if (valor === '< -2') return 'Riesgo para neurodesarrollo';
    return 'No Aplica';
  };

  useEffect(() => {
    setClasificacionPt(calcularClasificacionPt(pt));
  }, [pt]);

  useEffect(() => {
    setClasificacionTe(calcularClasificacionTe(te));
  }, [te]);

  useEffect(() => {
    setClasificacionPce(calcularClasificacionPce(pce));
  }, [pce]);

  const handleSubmitNinoSano = async () => {
    const token = localStorage.getItem('access_token');

    const data = {
      base_info_id: ninoInfo?.id,
      alimentacion,
      pt,
      te,
      pce,
      clasificacion_pt: clasificacionPt,
      clasificacion_te: clasificacionTe,
      clasificacion_pce: clasificacionPce,
      ganancia_peso_gr: parseFloat(gananciaPesoGr),
      calorias_1g_tejido: parseFloat(calorias1gTejido),
      // Verificamos que los valores no sean nulos o indefinidos antes de convertirlos.
      veces_que_gane: vecesQueGane ? parseInt(vecesQueGane.toString(), 10) : 0,
      calorias_crecimiento: caloriasCrecimiento ? parseFloat(caloriasCrecimiento.toString()) : 0,
      ajuste_deficit: ajusteDeficit ? parseFloat(ajusteDeficit.toString()) : 0,
      kcal_totales: caloriasTotales ? parseFloat(caloriasTotales.toString()) : 0,
      leche_materna_exclusiva: lecheMaternaExclusiva ? parseFloat(lecheMaternaExclusiva.toString()) : 0,
      formula_infantil: formulaInfantil ? parseFloat(formulaInfantil.toString()) : 0,
      leche_materna_y_formula: lecheMaternaYFormula ? parseFloat(lecheMaternaYFormula.toString()) : 0,
      rango_1_18_anos: rango1A18 ? parseFloat(rango1A18.toString()) : 0,
    };

    if (!token) {
      alert('No se encontró un token de autenticación. Inicia sesión.');
      return;
    }

    try {
      await axios.post('http://192.168.1.3:8000/api/nino-sano/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Error al guardar los datos');
    }
  };

  const handleNinoSano = () => {
    if (ninoInfo) {
      setIsModalNinoOpen(true);
    }
  };

  const handleLactanteInfo = () => {
    if (lactanteInfo) {
      setIsModalLactanteOpen(true);
    }
  };

  const handleGestanteInfo = () => {
    if (gestanteInfo) {
      setIsModalGestanteOpen(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar">
          <IonTitle>Información de Usuarios</IonTitle>
          <IonButtons slot="end">
            <IonButton className="logout-button" onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
              Cerrar Sesión
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="dark-theme">
        <div className="section-select">
          <IonLabel>Selecciona una categoría:</IonLabel>
          <IonSelect placeholder="Selecciona Categoría" onIonChange={(e) => setCategoria(e.detail.value)}>
            <IonSelectOption value="gestante">Gestante</IonSelectOption>
            <IonSelectOption value="lactante">Lactante</IonSelectOption>
            <IonSelectOption value="nino">Niño</IonSelectOption>
          </IonSelect>
        </div>

        {categoria && (
          <div className="section-select">
            <IonLabel>Selecciona una persona:</IonLabel>
            <IonSelect placeholder="Selecciona Persona" onIonChange={(e) => setSelectedPersona(e.detail.value)}>
              {personas.map((persona) => (
                <IonSelectOption key={persona.id} value={persona.id}>
                  {persona.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
        )}

        {gestanteInfo && (
          <IonCard className="card">
            <IonCardHeader>
              <IonCardTitle className="card-title">{gestanteInfo.nombre}</IonCardTitle>
              <IonCardSubtitle className="card-subtitle">Información de Gestante</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                <strong>Edad:</strong> {gestanteInfo.edad} años
              </p>
              <p>
                <strong>Estatura:</strong> {gestanteInfo.estatura} cm
              </p>
              <p>
                <strong>Semana de Gestación:</strong> {gestanteInfo.semanaGestacion || 'No disponible'}
              </p>
              <p>
                <strong>Peso Actual:</strong> {gestanteInfo.peso_actual} kg
              </p>
              <p>
                <strong>IMC Pregestacional:</strong> {gestanteInfo.imc_pregestacional}
              </p>
              <p>
                <strong>IMC Gestacional:</strong> {gestanteInfo.imc_gestacional}
                <strong>IMC Gestacional:</strong> {gestanteInfo.seleccion_multiple}
              </p>
              {gestanteInfo.seleccion_multiple === 'bajo_peso' && (
                <IonButton expand="full" onClick={handleGestanteInfo}>
                  Evaluación de Bajo Peso
                </IonButton>
              )}

              {gestanteInfo.seleccion_multiple === 'Sobrepeso' && (
                <IonButton expand="full" onClick={handleGestanteInfo}>
                  Evaluación de Sobrepeso
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>
        )}

        {lactanteInfo && (
          <IonCard className="card">
            <IonCardHeader>
              <IonCardTitle className="card-title">{lactanteInfo.nombre}</IonCardTitle>
              <IonCardSubtitle className="card-subtitle">Información de Lactante</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                <strong>Edad:</strong> {lactanteInfo.edad} años
              </p>
              <p>
                <strong>Estatura:</strong> {lactanteInfo.estatura} cm
              </p>
              <p>
                <strong>Peso Actual:</strong> {lactanteInfo.peso_actual} kg
              </p>
              <p>
                <strong>Peso Pregestacional:</strong> {lactanteInfo.peso_pregestacional} kg
              </p>
              <p>
                <strong>IMC Actual:</strong> {lactanteInfo.imc_actual}
              </p>
              <p>
                <strong>Días Post Parto:</strong> {lactanteInfo.dias_post_parto}
              </p>
              <p>
                <strong>Retención Post Parto:</strong> {lactanteInfo.retencion_post_parto}
              </p>
              <p>
                <strong>Retención Post Parto detalle:</strong> {lactanteInfo.retencion_post_parto_detalle}
              </p>

              <IonButton expand="full" onClick={handleLactanteInfo}>
                Información Lactante
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {ninoInfo && (
          <IonCard className="card">
            <IonCardHeader>
              <IonCardTitle className="card-title">{ninoInfo.nombre}</IonCardTitle>
              <IonCardSubtitle className="card-subtitle">Información de Niño</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                <strong>Edad:</strong> {ninoInfo.edad} años
              </p>
              <p>
                <strong>Estatura:</strong> {ninoInfo.talla} cm
              </p>
              <p>
                <strong>Sexo:</strong> {ninoInfo.sexo}
              </p>
              <p>
                <strong>Peso:</strong> {ninoInfo.peso} kg
              </p>
              <p>
                <strong>Perímetro Cefálico:</strong> {ninoInfo.perimetro_cefalico} cm
              </p>
              <IonButton expand="full" onClick={handleNinoSano}>
                Niño Sano
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* Modal para Niño Sano */}
        <NinoModal
          isOpen={isModalNinoOpen}
          onClose={() => setIsModalNinoOpen(false)}
          ninoInfo={ninoInfo}
          alimentacion={alimentacion}
          setAlimentacion={setAlimentacion}
          pt={pt}
          setPt={setPt}
          te={te}
          setTe={setTe}
          pce={pce}
          setPce={setPce}
          clasificacionPt={clasificacionPt}
          clasificacionTe={clasificacionTe}
          clasificacionPce={clasificacionPce}
          gananciaPesoGr={gananciaPesoGr}
          calorias1gTejido={calorias1gTejido}
          vecesQueGane={vecesQueGane}
          setVecesQueGane={setVecesQueGane}
          caloriasCrecimiento={caloriasCrecimiento}
          ajusteDeficit={ajusteDeficit}
          caloriasTotales={caloriasTotales}
          lecheMaternaExclusiva={lecheMaternaExclusiva}
          setLecheMaternaExclusiva={setLecheMaternaExclusiva}
          formulaInfantil={formulaInfantil}
          setFormulaInfantil={setFormulaInfantil}
          lecheMaternaYFormula={lecheMaternaYFormula}
          setLecheMaternaYFormula={setLecheMaternaYFormula}
          rango1A18={rango1A18}
          setRango1A18={setRango1A18}
          handleSubmit={handleSubmitNinoSano}
        />

        {/* Modal para Lactante */}
        <LactanteModal
          isOpen={isModalLactanteOpen}
          onClose={() => setIsModalLactanteOpen(false)}
          lactanteInfo={lactanteInfo}
          handleInputChange={handleInputChange}
          tasaMetabolica={tasaMetabolica}
          factorActividadFisica={factorActividadFisica}
          setFactorActividadFisica={setFactorActividadFisica}
          requerimientoEnergia={requerimientoEnergia}
          energiaExtraRequerida={energiaExtraRequerida}
          calcularRequerimientoEnergia={calcularRequerimientoEnergia}
          handleSubmitLactante={handleSubmitLactante}
        />

      <GestanteBajoPesoModal
        isOpen={isModalGestanteOpen}
        onClose={() => setIsModalGestanteOpen(false)}
        gestanteInfo={gestanteInfo} // Información de la gestante
        setGestanteInfo={setGestanteInfo} // Para actualizar la información
      />
       <GestanteSobrePesoModal
        isOpen={isModalGestanteOpen}
        onClose={() => setIsModalGestanteOpen(false)}
        gestanteInfo={gestanteInfo} // Información de la gestante
        setGestanteInfo={setGestanteInfo} // Para actualizar la información
      />


      </IonContent>
    </IonPage>
  );
};

export default Home;
