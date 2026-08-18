import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BotaoCustomizado({ titulo, onPress, tipo = 'primary' }) {
    const obterFundo = () => {
        switch(tipo) {
            case 'success': return '#2ecc71';
            case 'warning' : return '#e67e22';
            default: return '#2980b9';
        }
    };

    return(
        <TouchableOpacity
            style={[styles.botao, { backgroundColor: obterFundo() }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.textBotao}>{titulo}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    botao: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8,
        alignItems: 'center', marginVertical: 6, width: '100%' },
    textoBotao: { color: '#ffffff', fontSize: 15, fontWeight: '600' }
});