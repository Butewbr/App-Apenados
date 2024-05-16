import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  LogBox,
  Modal,
  Image,
  TextInput
} from 'react-native';
import MapLibreGL, { Logger } from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/'
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
  faArrowsToCircle
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

export default function Map() {
  const [centerPoint, setCenterPoint] = useState<number | null>(null);
  const [locationAccess, setLocationAccess] = useState<number | null>(null);
  const [endereco, setEndereco] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [visitaVisible, setVisitaVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [observacao, setObservacao] = useState('');

  {
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

    function fetchData() {
        console.log("FETCHING DATA!");
          axios.get('http://192.168.169.29:5000/api/syncdata')
        .then(response => {
          // Handle success
          console.log(response.data);
          // You can set the response data to state or do something else with it here
        })
        .catch(error => {
          // Handle error
          console.error('Error fetching data:', error);
        });
    }

    function centratePoint() {
      setCenterPoint(1);
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
      api
        .get(`/ap-vis-pessoa/`)
        .then(response => setEndereco(response.data))
        .catch(error => console.log(error.toJSON()));
    }, []);

    return (
      <View style={styles.page}>
        <Image
          source={require('../../../../assets/brasao.png')}
          style={styles.mapImage}
        />
        <MapLibreGL.MapView
          contentInset={[0, 0, 0, 0]}
          style={styles.map}
          logoEnabled={false}
          styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=8BO4NhEjNmKwVKxsVu8b`}
          attributionPosition={{ bottom: 8, right: 8 }}>
          <MapLibreGL.Camera
            followUserLocation={centerPoint ? true : false}
            defaultSettings={{
              centerCoordinate: [-49.48226570746353, -28.933063538181845],
              zoomLevel: 18
            }}
          />
          {endereco.map((p: any) => (
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
                    p.relevancia < 4
                      ? '#FFDE14'
                      : p.relevancia < 7
                      ? '#FF8800'
                      : '#E30613'
                  }
                />
              </TouchableOpacity>
            </MapLibreGL.MarkerView>
          ))}

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
          style={styles.centerButton}
          animation={'slideInUp'}
          easing={'ease-in-out'}>
          {/* {locationAccess !== null ? (
            <TouchableOpacity
              style={styles.button}
              onPress={clearLocationAccess}
              activeOpacity={0.9}>
              <FontAwesomeIcon icon={faXmark} color="#000" size={24} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={watchPosition}
              activeOpacity={0.9}>
              <FontAwesomeIcon icon={faLocationArrow} color="#000" size={24} />
            </TouchableOpacity>
          )} */}
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
                          selectedPerson.relevancia < 4
                            ? '#FFDE14'
                            : selectedPerson.relevancia < 7
                            ? '#FF8800'
                            : '#E30613'
                      }
                    ]}>
                    <Text style={{ color: '#26117A' }}>Relevância: </Text>
                    {selectedPerson
                      ? selectedPerson.relevancia < 4
                        ? 'BAIXA'
                        : selectedPerson.relevancia < 7
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
                  marginVertical: 12
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
      </View>
    );
  }
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
  centerButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    borderRadius: 0.5
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
    top: 60,
    right: 20,
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
    margin: 17
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
  }
});
