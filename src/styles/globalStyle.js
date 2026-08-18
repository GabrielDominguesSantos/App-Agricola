import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f9', padding: 16 },
    cardVisita: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16,
        marginBottom: 16, elevation: 2 },
    tituloSecao: { fontSize: 16, fontWeight: '700', color: '#2c3e50', marginBottom: 12,
        borderBottomWidth: 1, borderBottomColor: '#ecf0f1', paddingBottom: 4 },
    textoInformativo: { fontSize: 14, color: '#7f8c8d', marginVertical: 4 },
    imagePreview: { width: '100%', height: 200, borderRadius: 8, marginTop: 12, resizeMode: 'cover' },
    itemListaContato: { padding: 12, backgroundColor: '#f8f9fa', borderRadius: 8, 
        marginVertical: 4, borderWidth: 1, borderColor: '#e9ecef' },
    nomeContatoText: { fontSize: 15, fontWeight: '600', color: '#333333' },
    telefoneContatoText: { fontSize: 13, color: '#666666' }
});