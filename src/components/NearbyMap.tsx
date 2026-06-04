import { StyleSheet, Text, View } from 'react-native';

export function NearbyMap() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Nearby</Text>

      <View style={styles.mapWrapper}>
        <View style={[styles.mapLine, styles.mapLineDiagonal]} />
        <View style={[styles.mapLine, styles.mapLineDiagonalAlt]} />
        <View style={[styles.mapLine, styles.mapLineHorizontal]} />
        <View style={[styles.mapLine, styles.mapLineAccent]} />

        <View style={styles.locationDot} />
        <View style={styles.busBadge}><Text style={styles.badgeText}>159</Text></View>
        <View style={styles.busTag}><Text style={styles.busTagText}>346</Text></View>
        <View style={[styles.busTag, styles.busTagAlt]}><Text style={styles.busTagText}>346</Text></View>
        <View style={styles.roadBadge}><Text style={styles.roadBadgeText}>753F</Text></View>

        <Text style={[styles.mapLabel, styles.mapLabelTopRight]}>McDonald's</Text>
        <Text style={[styles.mapLabelSmall, styles.mapLabelTopRightAlt]}>मॅकडोनाल्ड्स</Text>
        <Text style={[styles.mapLabelSmall, styles.mapLabelTopRightRoad]}>Bakori Rd</Text>
        <Text style={[styles.mapLabelAccent, styles.mapLabelHospital]}>Lifeline Hospital</Text>
        <Text style={[styles.mapLabelSmall, styles.mapLabelHospitalAlt]}>लाईफलाईन रुग्णालय</Text>
      </View>
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
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  mapWrapper: {
    backgroundColor: '#E8ECEF',
    height: 220,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  mapLineDiagonal: {
    top: 0,
    left: 0,
    width: '110%',
    height: 6,
    transform: [{ rotate: '22deg' }],
    backgroundColor: '#FFFFFF',
  },
  mapLineDiagonalAlt: {
    top: 0,
    left: 0,
    width: '110%',
    height: 4,
    transform: [{ rotate: '22deg' }],
    backgroundColor: '#D8DDE3',
    top: 6,
  },
  mapLineHorizontal: {
    top: 130,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#FFFFFF',
  },
  mapLineAccent: {
    top: 130,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#D8DDE3',
    position: 'absolute',
  },
  locationDot: {
    position: 'absolute',
    top: 116,
    left: '46%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1565C0',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  busBadge: {
    position: 'absolute',
    top: 88,
    left: 86,
    backgroundColor: '#2E7D32',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  busTag: {
    position: 'absolute',
    top: 70,
    left: '41%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#666666',
    borderRadius: 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  busTagAlt: {
    left: '55%',
  },
  busTagText: {
    color: '#222222',
    fontSize: 11,
    fontWeight: '600',
  },
  roadBadge: {
    position: 'absolute',
    top: 112,
    left: 72,
    backgroundColor: '#C8960A',
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  roadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  mapLabel: {
    position: 'absolute',
    fontSize: 11,
    color: '#444444',
    fontWeight: '600',
  },
  mapLabelSmall: {
    position: 'absolute',
    fontSize: 9,
    color: '#777777',
  },
  mapLabelAccent: {
    position: 'absolute',
    fontSize: 11,
    color: '#3473C4',
    fontWeight: '700',
  },
  mapLabelTopRight: {
    top: 18,
    right: 58,
  },
  mapLabelTopRightAlt: {
    top: 30,
    right: 56,
  },
  mapLabelTopRightRoad: {
    top: 14,
    right: 8,
    fontSize: 10,
  },
  mapLabelHospital: {
    top: 54,
    right: 26,
  },
  mapLabelHospitalAlt: {
    top: 66,
    right: 24,
  },
});