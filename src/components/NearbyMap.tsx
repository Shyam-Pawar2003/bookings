import { Image, StyleSheet, Text, View } from 'react-native';


export function NearbyMap() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Nearby</Text>

      <Image
        source={{
          uri: 'https://maps.gstatic.com/tactile/basepage/pegman_sherlock.png',
        }}
        alt="map"
        resizeMode="cover"
        style={styles.map}
      />
    </View>
  );
}

export default NearbyMap;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 40,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  map: {
    width: '100%',
    height: 350,
    marginTop: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
});