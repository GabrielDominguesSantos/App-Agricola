import React, { useState } from "react";
import { View, Text, ScrollView, Alert, Image, FlatList } from 'react-native'
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import { globalStyles } from "../styles/globalStyle";
import BotaoCustomizado from "../components/BotaoCustomizado";

export default function RegistroVisitaScreen() {
    // Estados para dados consolidados da auditoria tecnica
    const [localizacao, setLocalizacao] = useState(null);
    const [imagemEvidencia, setImagemEvidencia] = useState(null);
    const [contatoSelecionado, setContatoSelecionado] = useState(null);
    const [listaContatosDisponiveis, setListaContatosDisponiveis] = useState([]);

    // Captura automarica dde coordenadas de auditoria (GPS)
    const capturarCoordenadasGPS = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Erro de Permissão', 'O acesso ao GPS e vital para a validacao legal da auditora.');
                return;
            }
            let posicao = await Location.getCurrentPositionAsync(
                { accuracy: Location.Accuracy.BestForNavigation }
            );
            setLocalizacao(posicao.coords);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter a localização GPS.');
            console.error(error);
        }
    };

    // Captura de imagem documental em campo (camera)
    const capturarFotoEvidencia = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Erro', 'Permissão para acessar a galeria negada.');
                return;
            }

            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                quality: 0.8,
                allowsEditing: false,
            });

            if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
                setImagemEvidencia(resultado.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    // Carregamento seletivo de contatos de produtores rurais cadastros no aparelho
    const carregarContatosProdutores = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Erro', 'Não é possível carregar os representantes locais sem acesso aos contatos.');
            return;
        }
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        // Simula uma filtragem de contatos corporativos na agenda local
        setListaContatosDisponiveis(data.slice(0, 3));
    };

    // Validação final do Relatório de Vistoria Tecnica
    const finalizarRelatorioAuditoria = () => {
        if (!localizacao || !imagemEvidencia || !contatoSelecionado) {
            Alert.alert('Inconformidade de Dados', `Todos os critérios de auditoria (GPS, Evidencial Cisual e Produtor Vinculado) devem ser preenchidos`);
            return;
        }
        Alert.alert('Auditoria Concluída', 'Relatório de Visita Tecnica sincronizado com a central de exportação com sucesso.');
    };

    return(
        <ScrollView style={globalStyles.container} nestedScrollEnabled={true}>
            <View style={globalStyles.cardVisita}>
                <Text style={globalStyles.tituloSecao}>1. Georreferenciamento de Lote</Text>
                <BotaoCustomizado titulo="Marcar Localização Atual"
                    onPress={capturarCoordenadasGPS} tipo="primary" />
                    {localizacao && (
                        <View style={{ marginTop: 8 }}>
                            <Text style={globalStyles.textoInformativo}>
                                Lat: {localizacao.latitude.toFixed(6)}
                            </Text>
                            <Text style={globalStyles.textoInformativo}>
                                Long: {localizacao.longitude.toFixed(6)}
                            </Text><Text style={globalStyles.textoInformativo}>
                                Precisão Alvo: {localizacao.accuracy.toFixed(1)}m
                            </Text>
                        </View>
                    )}
            </View>

            <View style={globalStyles.cardVisita}>
                <Text style={globalStyles.tituloSecao}>2. Evidência de Qualidade de Graos</Text>
                <BotaoCustomizado titulo="Acionar Câmera de Campo"
                    onPress={capturarFotoEvidencia} tipo="warning" />
                {imagemEvidencia && <Image source={{ uri: imagemEvidencia }}
                    style={globalStyles.imagePreview} />}
            </View>

            <View style={globalStyles.cardVisita}>
                <Text style={globalStyles.tituloSecao}>3. Produtor / Representante Logístico</Text>
                <BotaoCustomizado titulo=" Buscar Produtores da Agenda"
                    onPress={carregarContatosProdutores} tipo="primary" />
                {contatoSelecionado && (
                    <Text style={[globalStyles.textoInformativo,
                        { color: '#27ae60', fontWeight: 'bold', marginVertical: 6 }]}>
                        Vinculado a: {contatoSelecionado.name}
                    </Text>
                )}
                <FlatList
                    data={listaContatosDisponiveis}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <Text
                            style={globalStyles.itemListaContato}
                            onPress={() => setContatoSelecionado(item)}
                        >
                            {item.name}
                        </Text>
                    )}
                />
            </View>

            <BotaoCustomizado titulo="Finalizar e Assinar Auditoria"
                onPress={finalizarRelatorioAuditoria} tipo="success" />
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}
