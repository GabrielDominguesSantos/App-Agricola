import React from "react";
import { Image, Text, View } from "react-native";
import { globalStyles } from "../../styles/globalStyle";

export default function HistoricoAuditorias({ historicoAuditorias }) {
  if (!historicoAuditorias.length) {
    return null;
  }

  return (
    <View style={globalStyles.cardVisita}>
      <Text style={globalStyles.tituloSecao}>Histórico de Auditorias</Text>

      {historicoAuditorias.map((auditoria) => (
        <View key={auditoria.id} style={globalStyles.itemListaContato}>
          <Text style={globalStyles.nomeContatoText}>
            Auditoria realizada em:{" "}
            {auditoria.data
              ? new Date(auditoria.data).toLocaleString("pt-BR")
              : "Data não informada"}
          </Text>

          {auditoria.localizacao && (
            <Text style={globalStyles.textoInformativo}>
              Localização:{" "}
              {auditoria.localizacao.latitude?.toFixed(6)},{" "}
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
  );
}