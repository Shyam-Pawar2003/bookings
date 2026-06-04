import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type HeaderProps = {
  title?: string;
  subtitle?: string;
  initials?: string;
};

export function Header({ title, subtitle, initials = 'PP' }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/pmpml.jpg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {(title || subtitle) ? (
          <View style={styles.textWrap}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        ) : null}
      </View>

      <View style={styles.rightIcons}>
        <Pressable accessibilityRole="button" style={styles.iconButton}>
          <Text style={styles.bellIcon}>🔔</Text>
        </Pressable>

        <Pressable accessibilityRole="button" style={styles.userButton}>
          <Text style={styles.userIcon}>👤</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 16,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 52,
    height: 52,
    opacity: 1,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconButton: {
    padding: 4,
  },
  bellIcon: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  userButton: {
    minWidth: 40,
    minHeight: 40,
    backgroundColor: '#000000',
    borderRadius: 999,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
