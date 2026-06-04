import { Image, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

type ShareCardProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export function ShareCard({
  title = 'Apli PMPML चा आनंद घेत आहात?',
  description = 'तुमच्या मित्रांसोबत शेअर करा आणि त्यांना स्मार्ट प्रवासात मदत करा.',
  buttonLabel = 'आता शेअर करा',
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
    backgroundColor: '#FCE4EC',
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
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: '#222222',
  },
  description: {
    marginTop: 12,
    fontSize: 15,
    color: '#222222',
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
