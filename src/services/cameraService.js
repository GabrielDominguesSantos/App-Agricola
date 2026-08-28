import * as ImagePicker from 'expo-image-picker';

export const solicitarPermissaoGaleria = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

export const selecionarImagemEvidencia = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') return null;

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    quality: 0.8,
    allowsEditing: false,
  });

  if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
    return resultado.assets[0].uri;
  }

  return null;
};