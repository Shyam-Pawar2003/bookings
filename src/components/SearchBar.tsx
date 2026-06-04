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
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 0,
  },
  row: {
    backgroundColor: '#EBEBEB',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#888888',
  },
});