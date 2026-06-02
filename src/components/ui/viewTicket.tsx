import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const formatDateTime = (date: Date) =>
  `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })} | ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}`;

const formatCountdown = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((value) => String(value).padStart(2, '0')).join(':');
};

export default function ViewTicket() {
  const router = useRouter();
  const [bookingTime] = useState(() => new Date());
  const [validityTime] = useState(() => new Date(Date.now() + 30 * 60 * 1000));
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const secondsLeft = Math.max(0, Math.floor((validityTime.getTime() - now.getTime()) / 1000));
  const isExpired = secondsLeft <= 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonLabel}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerLinks}>
          <TouchableOpacity style={styles.linkButton} onPress={() => {}}>
            <Text style={styles.headerLink}>Need Help?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={() => {}}>
            <Text style={styles.headerLink}>All tickets</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketHeaderText}>Pune Mahanagar Parivahan Mahamandal Ltd.</Text>
          </View>

          <View style={styles.ticketBodyTop}>
            {[
              { label: 'Route', value: '167' },
              { label: 'Tickets count', value: '1F' },
              { label: 'Fare', value: '₹10' },
            ].map((item) => (
              <View key={item.label} style={styles.infoBox}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.routeRow}>
            <View style={styles.stopBlock}>
              <Text style={styles.stopLabel}>Kharadi Bypass</Text>
            </View>
            <Text style={styles.routeArrow}>→</Text>
            <View style={styles.stopBlock}>
              <Text style={styles.stopLabel}>Satav High School</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.footerCard}>
            <View style={styles.timeGrid}>
              {[
                { label: 'Booking Time', value: formatDateTime(bookingTime) },
                { label: 'Validity Time', value: formatDateTime(validityTime) },
              ].map((item) => (
                <View key={item.label} style={styles.timeBox}>
                  <Text style={styles.timeLabel}>{item.label}</Text>
                  <Text style={styles.timeValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.ticketId}>2603252235Q7HCT8</Text>

            <View style={styles.countdownCard}>
              <Text style={styles.countdownLabel}>{isExpired ? 'Expired' : 'Expires in'}</Text>
              <Text style={styles.countdownValue}>{isExpired ? '00:00:00' : formatCountdown(secondsLeft)}</Text>
            </View>

            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrLabel}>QR CODE</Text>
              <Text style={styles.qrSubLabel}>Tap to enlarge</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8eaea',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  closeButtonLabel: {
    fontSize: 22,
    color: '#1a1a1a',
  },
  headerLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  linkButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  headerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    paddingBottom: 36,
  },
  ticketCard: {
    margin: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  ticketHeader: {
    backgroundColor: '#d32f2f',
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  ticketHeaderText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  ticketBodyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  infoBox: {
    flex: 1,
  },
  infoLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stopBlock: {
    flex: 1,
  },
  stopLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  routeArrow: {
    fontSize: 26,
    fontWeight: '700',
    marginHorizontal: 10,
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e6e6e6',
  },
  footerCard: {
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  timeBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: 6,
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  ticketId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    textAlign: 'center',
    marginBottom: 14,
  },
  countdownCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  countdownLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    marginBottom: 4,
  },
  countdownValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#d32f2f',
  },
  qrPlaceholder: {
    height: 220,
    borderRadius: 18,
    backgroundColor: '#e7f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  qrSubLabel: {
    fontSize: 12,
    color: '#6b6b6b',
  },
});
