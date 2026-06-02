import { Image, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

type ShareCardProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export function ShareCard({
  title = 'Enjoying the PMPML app?',
  description = 'Share it with your friends and help them ride smarter.',
  buttonLabel = 'Share now',
}: ShareCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.button}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </View>
      </View>

      <Image
        source={require('../../assets/images/pmpml.jpg')}
        style={styles.shareImage}
        resizeMode="contain"
      />
    </View>
  );
}

export default ShareCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.four,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: '600',
    color: '#000000',
  },
  description: {
    marginTop: 12,
    fontSize: 18,
    color: '#000000',
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#06B6D4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#06B6D4',
  },
  shareImage: {
    width: 120,
    height: 140,
    borderRadius: 12,
  },
});
