import React from "react";
import { Image, Text, View } from "react-native";
import { globalStyles } from "../../styles/globalStyle";
import BotaoCustomizado from "../BotaoCustomizado";

export default function SecaoEvidencia({
  imagemEvidencia,
  onCapturarFoto,
}) {
  return (
    <View style={globalStyles.cardVisita}>
      <Text style={globalStyles.tituloSecao}>2. Evidência de Qualidade de Grãos</Text>

      <BotaoCustomizado
        titulo="Acionar Câmera de Campo"
        onPress={onCapturarFoto}
        tipo="warning"
      />

      {imagemEvidencia && (
        <Image
          source={{ uri: imagemEvidencia }}
          style={globalStyles.imagePreview}
        />
      )}
    </View>
  );
}