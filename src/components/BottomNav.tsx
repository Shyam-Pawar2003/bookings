import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

export function BottomNav() {
  return (
    <View style={styles.nav}>
      <View style={[styles.item, styles.activeItem]}>
        <Text style={[styles.icon, styles.activeIcon]}>⌂</Text>
        <Text style={[styles.label, styles.activeLabel]}>Home</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.icon}>⌖</Text>
        <Text style={styles.label}>Buses</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.icon}>?</Text>
        <Text style={styles.label}>Help</Text>
      </View>
    </View>
  );
}

export default BottomNav;

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
    paddingHorizontal: Spacing.four,
    paddingBottom: 14,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  activeItem: {
    gap: 4,
  },
  icon: {
    fontSize: 24,
    color: '#888888',
  },
  activeIcon: {
    color: '#111111',
  },
  label: {
    fontSize: 11,
    color: '#888888',
  },
  activeLabel: {
    color: '#111111',
    fontWeight: '700',
  },
});