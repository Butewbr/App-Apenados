import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const navigation = useNavigation();
  const [matricula, onChangeMat] = useState('');
  const [senha, onChangeSenha] = useState('');
  const [escondeSenha, setEscondeSenha] = useState(true);

  return (
    <KeyboardAvoidingView style={(style = styles.loginPage)} behavior="height">
      <Animatable.View
        style={styles.containerLogin}
        animation="zoomIn"
        duration={600}
        easing="ease-in-out">
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
            multiline
            style={styles.inputInfo}
            placeholder="Entre com a sua matrícula"
            placeholderTextColor="#C0BDBD"
            onChangeText={onChangeMat}
            value={matricula}></TextInput>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Senha</Text>
          <View style={styles.inputInfo}>
            <TextInput
              placeholder="Entre com sua senha"
              placeholderTextColor="#C0BDBD"
              onChangeText={senha => onChangeSenha(senha)}
              value={senha}
              secureTextEntry={escondeSenha}></TextInput>
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
          onPress={() => navigation.navigate('Map')}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '600'
            }}>
            LOGIN
          </Text>
        </TouchableOpacity>
      </Animatable.View>

      <KeyboardAvoidingView
        style={{width: '100%', height: 20, flex: 1, overflow: 'hidden'}}
        behavior="height">
        <View>
          <Animatable.Image
            source={require('../../../../assets/imagem_logo.png')}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
            animation="zoomIn"
          />
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    backgroundColor: '#73BA96',
    alignItems: 'center',
    paddingHorizontal: '10%'
  },
  containerLogin: {
    flex: 2,
    maxHeight: '55%',
    marginTop: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    padding: '5%',
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10
  },
  inputContainer: {
    alignItems: 'flex-start',
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
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#73BA96',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%'
  },
  submitButton: {
    backgroundColor: '#73BA96',
    borderRadius: 15,
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '6%',
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10
  }
});
