import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'http://172.20.160.1:5000/'
});

export default function Login() {
  const navigation = useNavigation();
  const [matricula, onChangeMat] = useState('');
  const [senha, onChangeSenha] = useState('');
  const [escondeSenha, setEscondeSenha] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const usuario = await AsyncStorage.getItem('usuario');
        navigation.navigate('Map');
      } catch (error) {
        console.log(error);
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Clean up listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('usuario', '');
      const formData = new FormData();
      formData.append('matricula', matricula);
      formData.append('password', senha);
      const response = await api.post('/login', formData, {headers: { "Content-Type": "multipart/form-data" }});
      await AsyncStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      navigation.navigate('Map');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.loginPage}>
      <View
        style={styles.containerLogin}>
        <Text
          style={{
            fontSize: 30,
            color: '#26117A',
            fontWeight: 'bold',
            marginBottom: '7%'
          }}>
          Autenticação
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Matrícula</Text>
          <TextInput
            style={styles.inputInfo}
            placeholder="Entre com a sua matrícula"
            placeholderTextColor="#C0BDBD"
            onChangeText={onChangeMat}
            value={matricula}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Senha</Text>
          <View style={styles.inputInfo}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Entre com sua senha"
              placeholderTextColor="#C0BDBD"
              onChangeText={senha => onChangeSenha(senha)}
              value={senha}
              secureTextEntry={escondeSenha}
            />
            {escondeSenha ? (
              <TouchableOpacity onPress={() => setEscondeSenha(!escondeSenha)}>
                <FontAwesomeIcon icon={faEye} color="#73BA96" size={25} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setEscondeSenha(!escondeSenha)}>
                <FontAwesomeIcon icon={faEyeSlash} color="#73BA96" size={25} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.7}
          onPress={handleLogin}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '600'
            }}>
            LOGIN
          </Text>
        </TouchableOpacity>
      </View>

      {!isKeyboardVisible && (
        <Animatable.Image
          source={require('../../../../assets/imagem_logo.png')}
          style={{ flex: 1, width: '100%', height: 20, resizeMode: 'contain' }}
          resizeMode="contain"
        />
      )} 
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    backgroundColor: '#73BA96',
    alignItems: 'center',
    color: '#26117A',
    paddingHorizontal: '5%'
  },
  containerLogin: {
    flex: 1,
    marginTop: '20%',
    color: '#26117A',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    padding: '5%',
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
    height: '100%'
  },
  inputContainer: {
    alignItems: 'flex-start',
    color: '#26117A',
    marginTop: '5%'
  },
  inputText: {
    color: '#26117A',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: '2%'
  },
  inputInfo: {
    flexDirection: 'row',
    color: '#26117A',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#73BA96',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    color: '#000000'
  },
  passwordInput: {
    color: '#26117A',
    flex: 1
  },
  submitButton: {
    backgroundColor: '#73BA96',
    borderRadius: 15,
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
    paddingVertical: 15, // Fixa o botão na parte inferior da tela
    width: '100%'
  }
});
