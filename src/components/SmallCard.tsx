import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

type SmallCardProps = {
  icon?: ReactNode;
  title?: string;
  meta?: string;
  price?: string;
  accentColor?: string;
};

export function SmallCard({ icon, title, meta, price, accentColor }: SmallCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, !icon && accentColor ? { backgroundColor: accentColor } : null]}>
        {icon}
      </View>

      <Text style={styles.title}>{title}</Text>

      {meta || price ? (
        <Text style={styles.meta}>{meta ?? price}</Text>
      ) : null}
    </View>
  );
}

export default SmallCard;

const styles = StyleSheet.create({
  card: {
    textAlign: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    height: 96,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  title: {
    marginTop: Spacing.three,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
  },
});