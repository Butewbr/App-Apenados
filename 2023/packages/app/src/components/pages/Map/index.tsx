import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  LogBox,
  Modal,
  Image,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import MapLibreGL, { Logger } from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const api = axios.create({
  baseURL: 'http://172.20.160.1:5000/'
});

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faMapMarkerAlt,
  faArrowLeft,
  faLocationArrow,
  faEye,
  faEyeSlash,
  faXmark,
  faSync,
  faThumbTack,
  faLocationPinLock,
  faLocationPin,
  faLocationDot,
  faArrowsToDot,
  faArrowsToCircle,
  faList
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);

Logger.setLogCallback(log => {
  const { message } = log;

  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true;
  }
  return false;
});

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function Map() {
  const [centerPoint, setCenterPoint] = useState<number | null>(null);
  const [locationAccess, setLocationAccess] = useState<number | null>(null);
  const [dados, setDados] = useState({});
  const [usuario, setUsuario] = useState<any>({});
  const [altPenal, setAltPenal] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [visitaVisible, setVisitaVisible] = useState(false);
  const [estavaEmCasa, setEstavaEmCasa] = useState(true);
  const [conectado, setConectado] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [observacao, setObservacao] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [visitasCount, setVisitasCount] = useState(0);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const usuario = await AsyncStorage.getItem('usuario');
        if (!usuario) {
          navigation.navigate('Login');
        }
        setUsuario(JSON.parse(usuario));
      } catch (error) {
        console.log(error);
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    userLocation && altPenal && altPenal.length > 0 && setAltPenal(altPenal.map((p: any) => {
      p.distance = haversineDistance(
        {latitude: userLocation.latitude, longitude: userLocation.longitude},
        {latitude: p.info_geo?.coordinates[1], longitude: p.info_geo?.coordinates[0]}
      );
      return p;
    }));
  }, [userLocation]);

  useEffect(() => {
    dados.AltPenal && dados.AltPenal.length>0 && setAltPenal(dados.AltPenal.map(altPenal => {
      altPenal.crimes = dados.Crime.filter(crime=> altPenal.id == crime.id_altpenal);      
      altPenal.visitas = dados.Visita.filter(visita=> altPenal.id_altpenal == visita.id_altpenal);      
      userLocation && (altPenal.distance = haversineDistance(
        {latitude: userLocation?.latitude, longitude: userLocation?.longitude},
        {latitude: altPenal.info_geo?.coordinates[1], longitude: altPenal.info_geo?.coordinates[0]}
      ));

    return altPenal
    }));
  }, [dados]);

  useEffect(() => {
    if (conectado) syncVisitas();
  }, [conectado]);

  useEffect(() => {
    const fetchVisitasCount = async () => {
      let visitas = await getStoredData('visitas');
      if (visitas && visitas.length > 0) {
        setVisitasCount(visitas.length);
      }
    };

    fetchVisitasCount();
  }, []);

  function watchPosition() {
    Geolocation.requestAuthorization(
      () => {
        setLocationAccess(1);
        setCenterPoint(1);
      },
      () => setLocationAccess(0)
    );
  }

  function clearLocationAccess() {
    locationAccess !== null && Geolocation.clearWatch(locationAccess);
    setLocationAccess(null);
    setCenterPoint(null);
  }

  async function syncVisitas()  {
    let visitas = await getStoredData('visitas');
    if (visitas && visitas.length > 0) {          
      try {
        const response = await api.post('/api/sync_visits', visitas);
        Alert.alert('Success', 'Visitas sincronizadas com sucesso');
        await storeData('visitas', []);
        setVisitasCount(0);
      } catch (error) {
        Alert.alert('Success', 'Erro ao enviar visitas');
        console.error('Error sending data:', error);
      }
    }
  }

  async function fetchData()  {
    let storedData = await getStoredData('dados');
    if (storedData) {
      setDados(storedData);
    }    
    
    await syncVisitas();

    api.get('/api/syncdata').then(async response => {
        setConectado(true)
        setDados(response.data);        
        storeData('dados', response.data);       
        console.log(response.data);
        Alert.alert('Success', 'Dados recebidos com sucesso');
      })
      .catch(error => {
        setConectado(false)
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Erro ao buscar dados');
      });
  }

  function centratePoint() {
    if (userLocation) {
      setCenterPoint(1);
      // Força o reposicionamento da câmera no mapa
      this.mapCamera.flyTo([userLocation.longitude, userLocation.latitude], 1000);
    }
  }

  function stopFollowing() {
    setCenterPoint(null);
  }

  function formatarData(data) {
    const dateObj = new Date(data);

    const dia = dateObj.getDate().toString().padStart(2, '0');
    const mes = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dateObj.getFullYear().toString();

    return `${dia}/${mes}/${ano}`;
  }

  useEffect(() => {
    clearLocationAccess();
    watchPosition();
    fetchData();
  }, []);
  

  async function handleSubmitVisita(): void {
    try {
      // Get the existing visitas from storage
      const storedVisitas = await AsyncStorage.getItem('visitas');
      let visitas = storedVisitas ? JSON.parse(storedVisitas) : [];

      // Create a new visita object
      const newVisita = {
        observacao,
        id_endereco: selectedPerson.id_endereco,        
        id_apenado: selectedPerson.id_apenado,           
        id_altpenal: selectedPerson.id_altpenal,     
        matricula_usuario: usuario.matricula,
        estava_em_casa: estavaEmCasa,
      };

      // Add the new visita to the array
      visitas.push(newVisita);

      // Store the updated visitas array back to storage
      await AsyncStorage.setItem('visitas', JSON.stringify(visitas));

      // Log the updated visitas array
      console.log('Updated visitas:', visitas);
      setVisitasCount(visitas.length);

      setVisitaVisible(false)
      setModalVisible(false)
      setObservacao('');
      setEstavaEmCasa(true);
    } catch (error) {
      console.log('Error:', error);
    }
  }

  const navigation = useNavigation();
    const handlePress = () => {
      api.get('/logout').then(responsse => {
        console.error('succesful logout:');
      }).catch(error => {
        console.error('Error logging out:', error);
      })
      AsyncStorage.removeItem('matricula');
      AsyncStorage.removeItem('usuario');
      navigation.goBack();

    };

  return (
    <View style={styles.page}>
      <TouchableOpacity style={styles.backButton} onPress={handlePress}>
        <View style={styles.rectangle}>
        <Image
          source={require('../../../../assets/brasao.png')}
          style={styles.mapImage}
        />
          <View style={{flexDirection: 'column',margin:10, marginRight:20}}>
            <Text style={styles.helloText}>{usuario.nome}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.listItemText}>
              {conectado ? 'Conectado' : 'Não conectado'}
            </Text>
            <View
              style={[
                styles.listItemIndicator,
                {backgroundColor: conectado ? '#16FF88' : '#FF0000'}
              ]}
            />
            {visitasCount > 0 ? <Text style={styles.listItemText}>
              {visitasCount+' visita'+(visitasCount>1?'s':'')+' não sincronizada'+(visitasCount>1?'s':'')+''} 
            </Text> : null}
          </View>
            <Text style={styles.welcomeText}>Clique para sair</Text>
          </View>
        </View>
      </TouchableOpacity>
      <MapLibreGL.MapView
        ref={ref => {
          this.mapView = ref;
        }}
        contentInset={[0, 0, 0, 0]}
        style={styles.map}
        logoEnabled={false}
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=8BO4NhEjNmKwVKxsVu8b`}
        attributionPosition={{bottom: 8, right: 8}}>
        <MapLibreGL.Camera
          ref={ref => {
            this.mapCamera = ref;
          }}
          followUserLocation={centerPoint ? true : false}
          defaultSettings={{
            centerCoordinate: [-49.48226570746353, -28.933063538181845],
            zoomLevel: 10
          }}
        />
        {altPenal.map((p: any) => {
          return (
            <MapLibreGL.MarkerView
              key={`${p.id}-${p.cpf}`}
              coordinate={
                p.info_geo && p.info_geo.coordinates
                  ? p.info_geo.coordinates
                  : [-49.48226570746353, -28.933063538181845]
              }
              onPress={() => {
                setModalVisible(true);
                setSelectedPerson(p);
              }}>
              <TouchableOpacity
                style={{maxWidth: 40}}//, borderWidth: 1, borderRadius: 50, borderColor: '#000', backgroundColor: '#FFF', padding: 5, alignItems: 'center', justifyContent: 'center'}}
                onPress={() => {
                  setModalVisible(true);
                  setSelectedPerson(p);
                }}
                activeOpacity={0.8}>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  size={22}
                  color={
                    p.relevancia === 1
                      ? '#FFDE14'
                      : p.relevancia === 2
                      ? '#FF8800'
                      : '#E30613'
                  }
                />
                {p.distance ? (
                  <Text style={styles.distanceText}>
                    {p.distance.toFixed(2)} km
                  </Text>
                ) : null}
              </TouchableOpacity>
            </MapLibreGL.MarkerView>
          );
        })}

        <MapLibreGL.UserLocation
          androidRenderMode="compass"
          renderMode="native"
          visible={locationAccess ? true : false}
        />
      </MapLibreGL.MapView>

      <Animatable.View
        style={styles.syncButtonContainer}
        animation={'slideInUp'}
        easing={'ease-in-out'}>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={fetchData}
          activeOpacity={0.9}>
          <FontAwesomeIcon icon={faSync} color="#000" size={22} />
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View
        style={styles.listButtonContainer}
        animation={'slideInUp'}
        easing={'ease-in-out'}>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => setListModalVisible(true)}
          activeOpacity={0.9}>
          <FontAwesomeIcon icon={faList} color="#000" size={22} />
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View
        style={styles.centerButton}
        animation={'slideInUp'}
        easing={'ease-in-out'}>
        {centerPoint !== null ? (
          <TouchableOpacity
            style={styles.roundButton}
            onPress={stopFollowing}
            activeOpacity={0.9}>
            <FontAwesomeIcon icon={faArrowsToDot} color="#000" size={22} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.roundButton}
            onPress={centratePoint}
            activeOpacity={0.9}>
            <FontAwesomeIcon icon={faArrowsToDot} color="#000" size={22} />
          </TouchableOpacity>
        )}
      </Animatable.View>

      {modalVisible ? (
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.condenado}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.condButton}
              onPress={() => {
                setModalVisible(false);
              }}>
              <FontAwesomeIcon icon={faArrowLeft} color="#26117A" size={20} />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Perfil do Indivíduo</Text>
            <View style={styles.head_infos}>
              <Image
                source={require('../../../../assets/profile_image.png')}
                style={{
                  maxWidth: 110,
                  maxHeight: 110,
                  borderRadius: 70,
                  borderWidth: 5,
                  borderColor: '#73BA96'
                }}
              />

              <View style={styles.datas}>
                <Text
                  style={[
                    styles.relevancia,
                    {
                      color:
                        selectedPerson.relevancia === 1
                          ? '#FFDE14'
                          : selectedPerson.relevancia === 2
                          ? '#FF8800'
                          : '#E30613'
                    }
                  ]}>
                  <Text style={{color: '#26117A'}}>Relevância: </Text>
                  {selectedPerson
                    ? selectedPerson.relevancia === 1
                      ? 'BAIXA'
                      : selectedPerson.relevancia === 2
                      ? 'MÉDIA'
                      : 'ALTA'
                    : ''}
                </Text>
                <Text style={styles.relevancia}>
                  <Text style={{color: '#26117A'}}>Início de Pena: </Text>
                  {selectedPerson ? formatarData(selectedPerson.data_ins) : ''}
                </Text>
                <Text style={styles.relevancia}>
                  <Text style={{color: '#26117A'}}>Fim de Pena: </Text>
                  {selectedPerson ? formatarData(selectedPerson.data_at) : ''}
                </Text>
              </View>
            </View>

            <Text style={styles.condNome}>
              {selectedPerson ? selectedPerson.nome : 'Nome não registrado.'}
            </Text>
            <View style={styles.loc_infos}>
              <Text style={{color: '#26117A'}}>
                {selectedPerson && selectedPerson.rua
                  ? selectedPerson.rua
                  : 'Rua não registrada.'}
                ,{' '}
              </Text>
              <Text style={{color: '#26117A'}}>
                {selectedPerson && selectedPerson.numero
                  ? selectedPerson.numero
                  : 'Número não registrado.'}{' '}
                -{' '}
              </Text>
              <Text style={{color: '#26117A'}}>
                {selectedPerson && selectedPerson.complemento
                  ? selectedPerson.complemento
                  : ''}
              </Text>
              <Text style={{color: '#26117A'}}>
                CEP:{' '}
                {selectedPerson && selectedPerson.cep
                  ? selectedPerson.cep
                  : 'CEP não registrado.'}
                ,{' '}
              </Text>
              <Text style={{color: '#26117A'}}>
                {selectedPerson && selectedPerson.municipio
                  ? selectedPerson.municipio
                  : 'Município não registrado.'}{' '}
                -{' '}
              </Text>
              <Text style={{color: '#26117A'}}>
                {selectedPerson && selectedPerson.estado
                  ? selectedPerson.estado
                  : 'Estado não registrado.'}
              </Text>
            </View>

            <Text
              style={{
                color: '#73BA96',
                fontSize: 14,
                fontWeight: 700,
                marginTop: 20
              }}>
              Crimes
            </Text>
            <Text style={styles.crimes}>
              {selectedPerson && selectedPerson.crimes && selectedPerson.crimes.length>0 && selectedPerson.crimes?
                selectedPerson.crimes?.map(crime => crime.descricao)
                    .join(', ')
                : 'Nenhum crime registrado.'}
            </Text>
            <Text
              style={{
                color: '#73BA96',
                fontSize: 14,
                fontWeight: 700,
                marginTop: 20
              }}>
              Medida Imposta
            </Text>
            <Text style={styles.medida}>
              {selectedPerson
                ? selectedPerson.medida_imposta
                : 'Nenhuma medida registrada.'}
            </Text>
            <Text
              style={{
                color: '#73BA96',
                fontSize: 14,
                fontWeight: 700,
                marginTop: 10
              }}>
              Visitas
            </Text>
            <Text style={styles.visitas}>
              {selectedPerson && selectedPerson.visitas && selectedPerson.visitas.length>0 && selectedPerson.visitas?
                    selectedPerson.visitas?.sort((a, b) => b.id - a.id)
                    .map(visita => 'ID: '+visita.id+' - Usuario: '+visita.matricula_usuario+' - Em casa: '+(visita.estava_em_casa?"Sim":"Não")+' - Data: '+formatarData(visita.data_visita) + ' - Observação: ' + visita.observacao    )          
                    .join('\n')
                : 'Nenhuma visita registrada.'}
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.visitaButton}
              onPress={() => {
                setVisitaVisible(true);
              }}>
              <Text style={{fontSize: 18, fontWeight: 700, color: '#fff'}}>
                Registrar Visita
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      ) : null}

      <Modal
        animationType="slide"
        transparent={false}
        visible={visitaVisible}
        onRequestClose={() => setVisitaVisible(false)}>
        <View style={styles.condenado}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.visitaBack}
            onPress={() => {
              setVisitaVisible(false);
            }}>
            <FontAwesomeIcon icon={faArrowLeft} color="#26117A" size={20} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Cadastro de Visita</Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: 700,
              alignSelf: 'center',
              marginVertical: 12,
              color: '#26117A'
            }}>
            O Indivíduo estava em casa?
          </Text>

          <View style={styles.visitaCheck}>
            <TouchableOpacity style={{...styles.visitaCheckSim,...(estavaEmCasa?styles.visitaCheckSelecionado:{})}}  activeOpacity={0.9} onPress={() => setEstavaEmCasa(true)}>
              <Text style={styles.btnText} >SIM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.visitaCheckNao,...(!estavaEmCasa?styles.visitaCheckSelecionado:{})}} activeOpacity={0.9} onPress={() => setEstavaEmCasa(false)}>
              <Text style={styles.btnText} >NÃO</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={{
                color: 'red',
                fontSize: 16,
                marginLeft: 30,
                marginTop: 10,
                marginBottom: -15
              }}>
              *
            </Text>
            <Text style={{color: '#7D7D7D'}}>Observação:</Text>

            <TextInput
              multiline
              style={styles.textInput}
              onChangeText={setObservacao}
              value={observacao}
            />
          </View>

          <TouchableOpacity style={styles.sendBtn} activeOpacity={0.9} onPress={() => handleSubmitVisita()}>
            <Text style={styles.btnText} >
              Enviar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {listModalVisible ? (
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          onRequestClose={() => setListModalVisible(false)}>
          <View style={styles.condenado}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.condButton}
              onPress={() => {
                setListModalVisible(false);
              }}>
              <FontAwesomeIcon icon={faArrowLeft} color="#26117A" size={20} />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Lista de Apenados</Text>
            <ScrollView style={styles.listContainer}>
              {altPenal
                .sort((a, b) => a.distance - b.distance)
                .map((p: any) => {
                  const relevanciaColor =
                    p.relevancia === 1
                      ? '#FFDE14'
                      : p.relevancia === 2
                      ? '#FF8800'
                      : '#E30613';

                  return (
                    <View key={p.id} style={styles.listItem}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={[
                            styles.listItemIndicator,
                            {backgroundColor: relevanciaColor}
                          ]}
                        />
                        <View>
                          <Text style={styles.listItemText}>{p.nome}</Text>
                          <Text style={styles.listItemSubText}>{p.last_visit?'Ultima Visita: '+formatarData(p.last_visit):'Nunca visitado'}</Text>
                        </View>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {p.distance ? (
                          <Text style={styles.listItemDistance}>
                            {p.distance.toFixed(2)} km
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          style={styles.listItemButton}
                          onPress={() => {
                            setSelectedPerson(p);
                            setModalVisible(true);
                            setListModalVisible(false);
                          }}
                          activeOpacity={0.8}>
                          <FontAwesomeIcon
                            icon={faLocationArrow}
                            color="#000"
                            size={22}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  mapImage: {
    zIndex: 99,
    resizeMode: 'contain',
    width: 50,
    height: 50,
    margin:10
  },
  map: {
    flex: 1,
    alignSelf: 'stretch'
  },
  button: {
    backgroundColor: '#FFF',
    minWidth: '40%',
    minHeight: '50%',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5%'
    //borderWidth: 1
  },
  syncButtonContainer: {
    position: 'absolute',
    top: '2%',
    right: "5%",
    borderRadius: 0.5
  },
  centerButton: {
    position: 'absolute',
    top: "9%",
    right: "5%",
    borderRadius: 0.5
  },
  listButtonContainer: {
    position: 'absolute',
    top: "16%",
    right: "5%",
    borderRadius: 0.5
  },
  roundButton: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4.84,
    elevation: 5,
  },  
  condenado: {
    flex: 1,
    marginHorizontal: 28
  },
  pageTitle: {
    color: '#26117A',
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 30
  },
  head_infos: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  relevancia: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 7,
    paddingLeft: 20,
    flexWrap: 'wrap',
    color: '#26117A'
  },
  datas: {
    lineHeight: 2
  },
  loc_infos: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    color: '#26117A'
  },
  condNome: {
    marginTop: 24,
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#73BA96'
  },
  crimes: {
    flex: 1,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#73BA96',
    minWidth: '100%',
    color:'#000'
  },
  medida: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#73BA96',
    minWidth: '100%',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    color:'#000'
  },
  visitas: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#73BA96',
    minWidth: '100%',
    height: 300,
    alignSelf: 'flex-start',
    marginBottom: '15%',
    lineHeight: 20,
    overflow: 'scroll',
    color:'#000'
  },
  condButton: {
    position: 'absolute',
    top: '4.6%',
    left: -10
  },
  visitaButton: {
    flex: 1,
    bottom: '3%',
    paddingHorizontal: '5%',
    backgroundColor: '#73BA96',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 10,
    maxHeight: 40,
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5
  },
  visitaBack: {
    position: 'absolute',
    top: '4.6%',
    left: -10
  },
  visitaCheck: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: '10%'
  },
  visitaCheckSelecionado: {
    borderColor:'#26117A',
    borderWidth: 2
  },
  visitaCheckSim: {
    padding: 10,
    backgroundColor: '#73BA96',
    borderRadius: 10,
    minWidth: 85,
    alignItems: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
  },
  visitaCheckNao: {
    padding: 10,
    backgroundColor: '#BC5555',
    borderRadius: 10,
    minWidth: 85,
    alignItems: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10
  },
  inputContainer: {
    flex: 3,
    backgroundColor: '#F1F1F1',
    borderRadius: 25,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 25,
    margin: 17,
    color: '#000'
  },
  sendBtn: {
    flex: 1,
    backgroundColor: '#3C97CA',
    borderRadius: 10,
    marginTop: '15%',
    marginBottom: '10%',
    maxHeight: '6%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#000'
  },
  listItemText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listItemSubText: {
    color: '#000',
    fontSize: 10,
  },
  listItemIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    textAlign: 'right'
  },
  listItemDistance: {
    color: '#000',
    fontSize: 14,
    textAlign: 'right',
  },
  listItemButton: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4.84,
    elevation: 5,
  },
  distanceText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'left',
    marginTop: 0,
  },
  backButton: {
    position: 'absolute',
    zIndex: 2,
    resizeMode: 'contain',
    top: '2%',
    start: '2%',
  },
  rectangle: {
    alignItems:'center',
    flexDirection: 'row',
    zIndex: 2,
    resizeMode: 'contain',
    // maxWidth: '30%',
    maxHeight: '95%',
    top: '4%',
    start: '0%',
    backgroundColor: '#FFFFFFE0',
    paddingRight: 0,
    paddingVertical: 10,
    borderRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  helloText: {
    fontSize: 14,
    // marginLeft: "30%",
    color: "#000",
    fontWeight: 'bold',
    textAlign: "left",
  },
  welcomeText: {
    fontSize: 12,
    color: "#000",
    // marginLeft: "30%",
    textAlign: "left",
  },
});

function storeData(key: string, data: any) {
  AsyncStorage.setItem(key, JSON.stringify(data))
    .then(() => {
      console.log('Data stored successfully');
    })
    .catch((error) => {
      console.log('Error storing data:', error);
    });
}

async function getStoredData(key: string) {
  try {
    const data = await AsyncStorage.getItem(key);
    console.log('Data fetched successfully:')//, data);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.log('Error fetching data:', error);
    return null;
  }
}
