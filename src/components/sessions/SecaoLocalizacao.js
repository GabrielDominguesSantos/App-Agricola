import React from "react";
import { Text, View } from "react-native";
import { globalStyles } from "../../styles/globalStyle";
import BotaoCustomizado from "../BotaoCustomizado";

export default function SecaoLocalizacao({
  localizacao,
  onCapturarLocalizacao,
}) {
  return (
    <View style={globalStyles.cardVisita}>
      <Text style={globalStyles.tituloSecao}>1. Georreferenciamento de Lote</Text>

      <BotaoCustomizado
        titulo="Marcar Localização Atual"
        onPress={onCapturarLocalizacao}
        tipo="primary"
      />

      {localizacao && (
        <View style={{ marginTop: 8 }}>
          <Text style={globalStyles.textoInformativo}>
            Lat: {localizacao.latitude.toFixed(6)}
          </Text>
          <Text style={globalStyles.textoInformativo}>
            Long: {localizacao.longitude.toFixed(6)}
          </Text>
          <Text style={globalStyles.textoInformativo}>
            Precisão Alvo: {localizacao.accuracy.toFixed(1)}m
          </Text>
        </View>
      )}
    </View>
  );
}