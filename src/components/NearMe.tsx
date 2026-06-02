import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

export function NearMe() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Near Me</Text>

        <Text style={styles.showAll}>Show all</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.busRow}>
          <View style={styles.busIconWrap}>
            <Text style={styles.busIcon}>🚌</Text>
          </View>

          <Text style={styles.fetchingText}>Fetching...</Text>
        </View>

        <Text style={styles.moreText}>See More Buses</Text>
      </View>
    </View>
  );
}

export default NearMe;

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.six,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000000',
  },
  showAll: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#000000',
  },
  card: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
  },
  busRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  busIconWrap: {
    backgroundColor: '#000000',
    borderRadius: 999,
    padding: 12,
  },
  busIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  fetchingText: {
    fontSize: 24,
    color: '#000000',
  },
  moreText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    color: '#000000',
  },
});