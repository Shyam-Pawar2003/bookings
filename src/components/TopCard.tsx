import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TopCardProps = {
  icon?: ReactNode;
  title?: string;
};

export function TopCard({ icon, title }: TopCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>{icon}</View>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default TopCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginTop: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000000',
  },
});