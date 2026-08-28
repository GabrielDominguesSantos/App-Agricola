import { useEffect, useState } from "react";
import { Alert } from "react-native";

import {
    buscarHistoricoAuditorias,
    finalizarRelatorioAuditoria,
} from "../../services/AsyncManagement";

import {
    capturarLocalizacaoAtual,
    solicitarPermissaoLocalizacao,
} from "../../services/locationService";

import {
    selecionarImagemEvidencia,
    solicitarPermissaoGaleria,
} from "../../services/cameraService";

import {
    buscarContatosProdutores,
    solicitarPermissaoContatos,
} from "../services/contactService";

export function useAuditoria() {
  const [localizacao, setLocalizacao] = useState(null);
  const [imagemEvidencia, setImagemEvidencia] = useState(null);
  const [contatoSelecionado, setContatoSelecionado] = useState(null);
  const [listaContatosDisponiveis, setListaContatosDisponiveis] = useState([]);
  const [historicoAuditorias, setHistoricoAuditorias] = useState([]);

  useEffect(() => {
    const carregarHistorico = async () => {
      const historico = await buscarHistoricoAuditorias();
      setHistoricoAuditorias(historico);
    };

    carregarHistorico();
  }, []);

  const capturarCoordenadasGPS = async () => {
    try {
      const permissaoConcedida = await solicitarPermissaoLocalizacao();

      if (!permissaoConcedida) {
        Alert.alert(
          "Erro de Permissão",
          "O acesso ao GPS é vital para a validação legal da auditoria."
        );
        return;
      }

      const coords = await capturarLocalizacaoAtual();

      if (!coords) {
        Alert.alert("Erro", "Não foi possível obter a localização GPS.");
        return;
      }

      setLocalizacao(coords);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a localização GPS.");
      console.error(error);
    }
  };

  const capturarFotoEvidencia = async () => {
    try {
      const permissaoConcedida = await solicitarPermissaoGaleria();

      if (!permissaoConcedida) {
        Alert.alert("Erro", "Permissão para acessar a galeria negada.");
        return;
      }

      const uri = await selecionarImagemEvidencia();

      if (!uri) {
        return;
      }

      setImagemEvidencia(uri);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const carregarContatosProdutores = async () => {
    try {
      const permissaoConcedida = await solicitarPermissaoContatos();

      if (!permissaoConcedida) {
        Alert.alert(
          "Erro",
          "Não é possível carregar os representantes locais sem acesso aos contatos."
        );
        return;
      }

      const contatos = await buscarContatosProdutores();
      setListaContatosDisponiveis(contatos);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os contatos.");
    }
  };

  const concluirAuditoria = async () => {
    const resultado = await finalizarRelatorioAuditoria({
      localizacao,
      imagemEvidencia,
      contatoSelecionado,
    });

    if (!resultado?.sucesso) return;

    setLocalizacao(null);
    setImagemEvidencia(null);
    setContatoSelecionado(null);

    const historico = await buscarHistoricoAuditorias();
    setHistoricoAuditorias(historico);
  };

  return {
    localizacao,
    imagemEvidencia,
    contatoSelecionado,
    setContatoSelecionado,
    listaContatosDisponiveis,
    historicoAuditorias,
    capturarCoordenadasGPS,
    capturarFotoEvidencia,
    carregarContatosProdutores,
    concluirAuditoria,
  };
}