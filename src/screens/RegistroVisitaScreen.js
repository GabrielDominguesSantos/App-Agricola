import React from "react";
import { ScrollView } from "react-native";

import BotaoCustomizado from "../components/BotaoCustomizado";
import { globalStyles } from "../styles/globalStyle";

import HistoricoAuditorias from "../components/sessions/HistoricoAuditorias";
import SecaoContato from "../components/sessions/SecaoContato";
import SecaoEvidencia from "../components/sessions/SecaoEvidencia";
import SecaoLocalizacao from "../components/sessions/SecaoLocalizacao";

import { useAuditoria } from "../hooks/useAuditoria";

export default function RegistroVisitaScreen() {
  const {
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
  } = useAuditoria();

  return (
    <ScrollView style={globalStyles.container} nestedScrollEnabled={true}>
      <SecaoLocalizacao
        localizacao={localizacao}
        onCapturarLocalizacao={capturarCoordenadasGPS}
      />

      <SecaoEvidencia
        imagemEvidencia={imagemEvidencia}
        onCapturarFoto={capturarFotoEvidencia}
      />

      <SecaoContato
        contatoSelecionado={contatoSelecionado}
        listaContatosDisponiveis={listaContatosDisponiveis}
        onBuscarContatos={carregarContatosProdutores}
        onSelecionarContato={setContatoSelecionado}
      />

      <BotaoCustomizado
        titulo="Finalizar e Assinar Auditoria"
        onPress={concluirAuditoria}
        tipo="success"
      />

      <HistoricoAuditorias historicoAuditorias={historicoAuditorias} />
    </ScrollView>
  );
}