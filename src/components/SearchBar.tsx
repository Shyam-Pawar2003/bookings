import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

export function SearchBar() {
  return (
    <View style={styles.shell}>
      <View style={styles.row}>
        <SymbolView name="magnifyingglass" size={32} tintColor="#000000" />

        <Text style={styles.text}>कुठे जायचे आहे?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '500',
    color: '#000000',
  },
});