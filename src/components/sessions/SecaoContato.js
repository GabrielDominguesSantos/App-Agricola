import React from "react";
import { FlatList, Text, View } from "react-native";
import { globalStyles } from "../../styles/globalStyle";
import BotaoCustomizado from "../BotaoCustomizado";

export default function SecaoContato({
  contatoSelecionado,
  listaContatosDisponiveis,
  onBuscarContatos,
  onSelecionarContato,
}) {
  return (
    <View style={globalStyles.cardVisita}>
      <Text style={globalStyles.tituloSecao}>3. Produtor / Representante Logístico</Text>

      <BotaoCustomizado
        titulo="Buscar Produtores da Agenda"
        onPress={onBuscarContatos}
        tipo="primary"
      />

      {contatoSelecionado && (
        <Text
          style={[
            globalStyles.textoInformativo,
            { color: "#27ae60", fontWeight: "bold", marginVertical: 6 },
          ]}
        >
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
            onPress={() => onSelecionarContato(item)}
          >
            {item.name}
          </Text>
        )}
      />
    </View>
  );
}