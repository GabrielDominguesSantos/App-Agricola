import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const CHAVE_HISTORICO_AUDITORIAS = 'historico-auditorias';

export const validarDadosAuditoria = ({ localizacao, imagemEvidencia, contatoSelecionado }) => {
  return Boolean(localizacao && imagemEvidencia && contatoSelecionado);
};

export const buscarHistoricoAuditorias = async () => {
  try {
    const dadosSalvos = await AsyncStorage.getItem(CHAVE_HISTORICO_AUDITORIAS);

    if (!dadosSalvos) return [];

    const dadosConvertidos = JSON.parse(dadosSalvos);
    return Array.isArray(dadosConvertidos) ? dadosConvertidos : [dadosConvertidos];
  } catch (error) {
    console.error('Erro ao buscar histórico', error);
    return [];
  }
};

export const salvarDadosAuditoria = async ({
  localizacao,
  imagemEvidencia,
  contatoSelecionado,
}) => {
  const novaAuditoria = {
    id: Date.now().toString(),
    data: new Date().toISOString(),
    localizacao,
    imagemEvidencia,
    contatoSelecionado,
  };

  try {
    const dadosSalvos = await AsyncStorage.getItem(CHAVE_HISTORICO_AUDITORIAS);
    const historicoAtual = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    const listaHistorico = Array.isArray(historicoAtual) ? historicoAtual : [historicoAtual];
    const historicoAtualizado = [novaAuditoria, ...listaHistorico];

    await AsyncStorage.setItem(
      CHAVE_HISTORICO_AUDITORIAS,
      JSON.stringify(historicoAtualizado)
    );

    return historicoAtualizado;
  } catch (error) {
    console.error('Erro ao salvar auditoria', error);
    return null;
  }
};

export const finalizarRelatorioAuditoria = async ({
  localizacao,
  imagemEvidencia,
  contatoSelecionado,
}) => {
  const dadosValidos = validarDadosAuditoria({
    localizacao,
    imagemEvidencia,
    contatoSelecionado,
  });

  if (!dadosValidos) {
    Alert.alert(
      'Inconformidade de Dados',
      'Todos os critérios de auditoria (GPS, Evidência e Produtor Vinculado) devem ser preenchidos.'
    );
    return { sucesso: false };
  }

  const historicoAtualizado = await salvarDadosAuditoria({
    localizacao,
    imagemEvidencia,
    contatoSelecionado,
  });

  if (!historicoAtualizado) {
    Alert.alert('Erro', 'Não foi possível salvar a auditoria.');
    return { sucesso: false };
  }

  Alert.alert(
    'Auditoria Concluída',
    'Relatório de visita salvo no dispositivo com sucesso.'
  );

  return { sucesso: true, historico: historicoAtualizado };
};