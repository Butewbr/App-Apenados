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
  baseURL: 'http://192.168.202.29:3000/'
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
  const [endereco, setEndereco] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [visitaVisible, setVisitaVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    setEndereco([
      {
        id: 1,
        id_pessoa: 1,
        nome: "Gabriel",
        relevancia: 1,
        data_ins: "2023-01-01",
        data_at: "2024-01-01",
        logradouro: "Rua 1",
        numero: "123",
        complemento: "Apto 1",
        cep: "88900-001",
        municipio: "Araranguá",
        estado: "SC",
        crimes: ["Crime 1"],
        medida_imposta: "Medida 1",
        info_geo: {
          coordinates: [-49.47326570746353, -28.935063538181845]
        }
      },
      {
        id: 2,
        id_pessoa: 2,
        nome: "Mario",
        relevancia: 2,
        data_ins: "2023-02-01",
        data_at: "2024-02-01",
        logradouro: "Rua 2",
        numero: "456",
        complemento: "Apto 2",
        cep: "88900-002",
        municipio: "Araranguá",
        estado: "SC",
        crimes: ["Crime 2"],
        medida_imposta: "Medida 2",
        info_geo: {
          coordinates: [-49.48226570746353, -28.944063538181845]
        }
      },
      {
        id: 3,
        id_pessoa: 3,
        nome: "Renata",
        relevancia: 3,
        data_ins: "2023-03-01",
        data_at: "2024-03-01",
        logradouro: "Rua 3",
        numero: "789",
        complemento: "Apto 3",
        cep: "88900-003",
        municipio: "Araranguá",
        estado: "SC",
        crimes: ["Crime 3"],
        medida_imposta: "Medida 3",
        info_geo: {
          coordinates: [-49.49126570746353, -28.923063538181845]
        }
      }
    ]);
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

  function getApVisPessoa() {
    api
      .get(`/ap-vis-pessoa/`)
      .then(response => 
        setEndereco(response.data))
      .catch(error => console.log(error.toJSON()));
  }

  function fetchData() {
    console.log("FETCHING DATA!");
    getApVisPessoa();
    const dataToSend = {
      observacao: "Observation text",
      id_endereco: 1,
      matricula_policial: "123456",
      id_apenado: 2,
      data_visita: "2024-06-13"
    };

    // First, get the data from the server
    axios.get('http://192.168.202.29:5000/api/syncdata')
      .then(response => {
        // Handle success
        console.log(response.data);
        Alert.alert('Success', 'Data synchronized successfully');
        // Now send data to the server
        axios.post('http://192.168.202.29:5000/api/sync_visits', dataToSend)
          .then(postResponse => {
            console.log('Data sent successfully:', postResponse.data);
            Alert.alert('Success', 'Data sent successfully');
          })
          .catch(postError => {
            console.error('Error sending data:', postError);
            Alert.alert('Error', 'Failed to send data');
          });
      })
      .catch(error => {
        // Handle error
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data');
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
  }, []);
  
  useEffect(() => {
    getApVisPessoa();
  }, []);

  function handleSubmitVisita(id: any): void {
    api.post(`/registro-visita/${id}`, { observacao })
      .then(response => {
        // handle success
        console.log(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  }

  const navigation = useNavigation();
    const handlePress = () => {
      navigation.goBack();
    };

  return (
    <View style={styles.page}>
      <TouchableOpacity style={styles.backButton} onPress={handlePress}>
        <Image
          source={require('../../../../assets/brasao.png')}
          style={styles.mapImage}
        />
        <View style={styles.rectangle}>
          <Text style={styles.helloText}>ROBERT</Text>
          <Text style={styles.welcomeText}>Clique para sair</Text>
        </View>
      </TouchableOpacity>
      <MapLibreGL.MapView
        ref={(ref) => { this.mapView = ref; }}
        contentInset={[0, 0, 0, 0]}
        style={styles.map}
        logoEnabled={false}
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=8BO4NhEjNmKwVKxsVu8b`}
        attributionPosition={{ bottom: 8, right: 8 }}>
        <MapLibreGL.Camera
          ref={(ref) => { this.mapCamera = ref; }}
          followUserLocation={centerPoint ? true : false}
          defaultSettings={{
            centerCoordinate: [-49.48226570746353, -28.933063538181845],
            zoomLevel: 10
          }}
        />
        {endereco.map((p: any) => {
          const distance =
            userLocation &&
            haversineDistance(userLocation, {
              latitude: p.info_geo.coordinates[1],
              longitude: p.info_geo.coordinates[0]
            });

          return (
            <MapLibreGL.MarkerView
              key={`${p.id}-${p.id_pessoa}`}
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
                style={{ maxWidth: '7%' }}
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
                {distance && (
                  <Text style={styles.distanceText}>
                    {distance.toFixed(2)} km
                  </Text>
                )}
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

      {modalVisible && (
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
                  <Text style={{ color: '#26117A' }}>Relevância: </Text>
                  {selectedPerson
                    ? selectedPerson.relevancia === 1
                      ? 'BAIXA'
                      : selectedPerson.relevancia === 2
                      ? 'MÉDIA'
                      : 'ALTA'
                    : ''}
                </Text>
                <Text style={styles.relevancia}>
                  <Text style={{ color: '#26117A' }}>Início de Pena: </Text>
                  {selectedPerson
                    ? formatarData(selectedPerson.data_ins)
                    : ''}
                </Text>
                <Text style={styles.relevancia}>
                  <Text style={{ color: '#26117A' }}>Fim de Pena: </Text>
                  {selectedPerson ? formatarData(selectedPerson.data_at) : ''}
                </Text>
              </View>
            </View>

            <Text style={styles.condNome}>
              {selectedPerson ? selectedPerson.nome : 'Nome não registrado.'}
            </Text>
            <View style={styles.loc_infos}>
              <Text>
                {selectedPerson
                  ? selectedPerson.logradouro
                  : 'Logradouro não registrado.'}
                ,{' '}
              </Text>
              <Text>
                {selectedPerson
                  ? selectedPerson.numero
                  : 'Número não registrado.'}{' '}
                -{' '}
              </Text>
              <Text>
                {selectedPerson
                  ? selectedPerson.complemento
                  : 'Complemento não registrado.'}
              </Text>
              <Text>
                CEP:{' '}
                {selectedPerson ? selectedPerson.cep : 'CEP não registrado.'},{' '}
              </Text>
              <Text>
                {selectedPerson
                  ? selectedPerson.municipio
                  : 'Município não registrado.'}{' '}
                -{' '}
              </Text>
              <Text>
                {selectedPerson
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
              {selectedPerson
                ? selectedPerson.crimes.map(crime => crime).join(', ')
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

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.visitaButton}
              onPress={() => {
                setVisitaVisible(true);
              }}>
              <Text style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
                Registrar Visita
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {visitaVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
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
              <TouchableOpacity
                style={styles.visitaCheckSim}
                activeOpacity={0.9}>
                <Text style={styles.btnText}>SIM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.visitaCheckNao}
                activeOpacity={0.9}>
                <Text style={styles.btnText}>NÃO</Text>
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
                *<Text style={{ color: '#7D7D7D' }}>Observação:</Text>
              </Text>
              <TextInput
                multiline
                style={styles.textInput}
                onChangeText={setObservacao}
                value={observacao}
              />
            </View>

            <TouchableOpacity style={styles.sendBtn} activeOpacity={0.9}>
              <Text
                style={styles.btnText}
                onPress={() => handleSubmitVisita(selectedPerson?.id)}>
                Enviar
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {listModalVisible && (
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
              {endereco.map((p: any) => {
                const distance =
                  userLocation &&
                  haversineDistance(userLocation, {
                    latitude: p.info_geo.coordinates[1],
                    longitude: p.info_geo.coordinates[0]
                  });

                const relevanciaColor = 
                  p.relevancia === 1
                    ? '#FFDE14'
                    : p.relevancia === 2
                    ? '#FF8800'
                    : '#E30613';

                return (
                  <View key={p.id} style={styles.listItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={[
                          styles.listItemIndicator,
                          { backgroundColor: relevanciaColor }
                        ]}
                      />
                      <Text style={styles.listItemText}>{p.nome}</Text>
                    </View>
                    {distance && (
                      <Text style={styles.listItemDistance}>
                        {distance.toFixed(2)} km
                      </Text>
                    )}
                    <TouchableOpacity
                      style={styles.listItemButton}
                      onPress={() => {
                        setSelectedPerson(p);
                        setModalVisible(true);
                        setListModalVisible(false);
                      }}
                      activeOpacity={0.8}>
                      <FontAwesomeIcon icon={faLocationArrow} color="#000" size={22} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      )}
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
    position: 'absolute',
    zIndex: 99,
    resizeMode: 'contain',
    maxWidth: '30%',
    maxHeight: '30%',
    top: '4%',
    start: '5%'
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
    flexWrap: 'wrap'
  },
  datas: {
    lineHeight: 2
  },
  loc_infos: {
    justifyContent: 'flex-start',
    flexDirection: 'row'
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
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#73BA96',
    minWidth: '100%'
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
    marginBottom: '15%'
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
  visitaCheckSim: {
    padding: 10,
    backgroundColor: '#73BA96',
    borderRadius: 10,
    minWidth: 85,
    alignItems: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10
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
  },
  listItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  listItemDistance: {
    fontSize: 14,
    marginLeft: 10,
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
    textAlign: 'center',
    marginTop: 5,
  },
  backButton: {
    position: 'absolute',
    zIndex: 2,
    resizeMode: 'contain',
    top: '2%',
    start: '2%',
  },
  rectangle: {
    zIndex: 2,
    resizeMode: 'contain',
    // maxWidth: '30%',
    maxHeight: '95%',
    top: '4%',
    start: '5%',
    backgroundColor: '#FFFFFFE0',
    paddingRight: 5,
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
    marginLeft: "30%",
    color: "#000",
    fontWeight: 'bold',
    textAlign: "left",
  },
  welcomeText: {
    fontSize: 12,
    color: "#000",
    marginLeft: "30%",
    textAlign: "left",
  },
});
