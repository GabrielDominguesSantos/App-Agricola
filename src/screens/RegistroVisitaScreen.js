import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, Image, FlatList } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import { globalStyles } from "../styles/globalStyle";
import BotaoCustomizado from "../components/BotaoCustomizado";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegistroVisitaScreen() {
    // Estados para dados consolidados da auditoria tecnica
    const [localizacao, setLocalizacao] = useState(null);
    const [imagemEvidencia, setImagemEvidencia] = useState(null);
    const [contatoSelecionado, setContatoSelecionado] = useState(null);
    const [listaContatosDisponiveis, setListaContatosDisponiveis] = useState([]);
    const [historicoAuditorias, setHistoricoAuditorias] = useState([]);
    const CHAVE_HISTORICO_AUDITORIAS = 'historico-auditorias';

    useEffect(() => {
        buscarHistoricoAuditorias();
    }, []);
    
    const buscarHistoricoAuditorias = async () => {
        try {
            const dadosSalvos = await AsyncStorage.getItem(CHAVE_HISTORICO_AUDITORIAS);

            if(!dadosSalvos) {
                setHistoricoAuditorias([]);
                return;
            }
            const dadosConvertidos = JSON.parse(dadosSalvos);
            const historico = Array.isArray(dadosConvertidos) ? dadosConvertidos : [dadosConvertidos];
            setHistoricoAuditorias(historico);
        } catch (error) {
            console.log('Erro ao buscar histórico', error);
            setHistoricoAuditorias([]);

            Alert.alert(
                'Erro',
                'Não foi possível carregar o histórico de auditorias.'
            )
        }
    };
    
    const salvarDadosAuditoria = async () => {
        const novaAuditoria = {
            id: Date.now().toString(),
            data: new Date().toISOString(),
            localizacao,
            imagemEvidencia,
            contatoSelecionado,
        }

        try {
            const dadosSalvos = await AsyncStorage.getItem(CHAVE_HISTORICO_AUDITORIAS);
            const historicoAtual = dadosSalvos ? JSON.parse(dadosSalvos) : [];
            const listaHistorico = Array.isArray(historicoAtual) ? historicoAtual : [historicoAtual];
            const historicoAtualizado = [novaAuditoria, ...listaHistorico];

            await AsyncStorage.setItem(CHAVE_HISTORICO_AUDITORIAS, JSON.stringify(historicoAtualizado));
            setHistoricoAuditorias(historicoAtualizado);

            setLocalizacao(null);
            setImagemEvidencia(null);
            setContatoSelecionado(null);

            return true;
        } catch (error) {
            Alert.alert(
                'Erro',
                'Não foi possível salvar a auditora.'
            )
            return false;
        }
    }

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
    const finalizarRelatorioAuditoria = async () => {
        if (!localizacao || !imagemEvidencia || !contatoSelecionado) {
            Alert.alert('Inconformidade de Dados', `Todos os critérios de auditoria (GPS, Evidencial Cisual e Produtor Vinculado) devem ser preenchidos`);
            return;
        }
        const salvou = await salvarDadosAuditoria();

        if (!salvou) return;

        Alert.alert(
            'Auditoria Concluída', 
            'Relatório de visita salvo no dispositivo com sucesso.'
        );
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

            {historicoAuditorias.length > 0 && (
                <View style={globalStyles.cardVisita}>
                    <Text style={globalStyles.tituloSecao}>
                        Histórico de Auditorias
                    </Text>

        {historicoAuditorias.map((auditoria) => (
            <View
                key={auditoria.id}
                style={globalStyles.itemListaContato}
            >
                <Text style={globalStyles.nomeContatoText}>
                    Auditoria realizada em:{' '}
                    {auditoria.data
                        ? new Date(auditoria.data).toLocaleString('pt-BR')
                        : 'Data não informada'}
                </Text>

                {auditoria.localizacao && (
                    <Text style={globalStyles.textoInformativo}>
                        Localização:{' '}
                        {auditoria.localizacao.latitude?.toFixed(6)},{' '}
                        {auditoria.localizacao.longitude?.toFixed(6)}
                    </Text>
                )}

                {auditoria.contatoSelecionado && (
                    <Text style={globalStyles.textoInformativo}>
                        Produtor: {auditoria.contatoSelecionado.name}
                    </Text>
                )}

                {auditoria.imagemEvidencia && (
                    <Image
                        source={{ uri: auditoria.imagemEvidencia }}
                        style={globalStyles.imagePreview}
                    />
                )}
            </View>
        ))}
    </View>
)}
        </ScrollView>
    );
}