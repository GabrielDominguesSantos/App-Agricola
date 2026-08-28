import * as Contacts from 'expo-contacts';

export const solicitarPermissaoContatos = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === 'granted';
};

export const buscarContatosProdutores = async () => {
  const { status } = await Contacts.requestPermissionsAsync();

  if (status !== 'granted') return [];

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
  });

  return data.slice(0, 3);
};