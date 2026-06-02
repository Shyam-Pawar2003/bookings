import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const PASS_STORAGE_KEY = 'DAILY_PASS';

type StoredPass = {
  id: string;
  label: string;
  price: string;
  fare: number;
  info: string;
  idNumber: string;
  passCode: string;
  purchasedAt: number;
  expiresAt: number;
};

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

function formatDateTime(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = String(date.getFullYear() % 100).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${day} ${month}, ${year} | ${hour12}:${minutes} ${ampm}`;
}

export default function PmpmlTicket() {
  const router = useRouter();
  const [pass, setPass] = useState<StoredPass | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const logoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function loadPass() {
      try {
        const stored = await AsyncStorage.getItem(PASS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredPass;
          setPass(parsed);
          setRemainingSeconds(Math.max(0, Math.floor((parsed.expiresAt - Date.now()) / 1000)));
        }
      } catch {
        setPass(null);
      } finally {
        setLoading(false);
      }
    }

    loadPass();
  }, []);

  useEffect(() => {
    if (!pass) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds(Math.max(0, Math.floor((pass.expiresAt - Date.now()) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [pass]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [logoScale]);

  const isExpired = pass ? remainingSeconds <= 0 : false;
  const hasPass = !!pass;
  const expiryLabel = pass ? formatDateTime(new Date(pass.expiresAt)) : '';
  const bookingLabel = pass ? formatDateTime(new Date(pass.purchasedAt)) : '';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonLabel}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!hasPass ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No active pass</Text>
            <Text style={styles.emptyDescription}>
              Buy a PMC / PCMC daily pass and view it here. A daily pass is valid for 24 hours from purchase.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              activeOpacity={0.85}
              onPress={() => router.push('/daily-pass')}
            >
              <Text style={styles.emptyButtonText}>Buy Daily Pass</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketHeaderText}>पुणे महानगर परिवहन महामंडळ लि.</Text>
              </View>

              <View style={styles.ticketBodyTop}>
                {[
                  { label: 'Pass Type', value: pass.label },
                  { label: 'ID', value: pass.idNumber },
                  { label: 'Fare', value: pass.fare },
                ].map((item) => (
                  <View key={item.label} style={styles.infoBoxTop}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.dashedSeparator} />

              <View style={styles.ticketBodyBottom}>
                <View style={styles.timeRow}>
                  <View style={styles.timeCard}>
                    <Text style={styles.timeLabel}>Booking Time</Text>
                    <Text style={styles.timeValue}>{bookingLabel}</Text>
                  </View>
                  <View style={styles.timeCard}>
                    <Text style={styles.timeLabel}>Validity Time</Text>
                    <Text style={styles.timeValue}>{expiryLabel}</Text>
                  </View>
                </View>

                <Text style={styles.ticketId}>{pass.passCode}</Text>

                <View style={[styles.passBanner, isExpired && styles.passBannerExpired]}>
                  <Text style={styles.passBannerText}>{isExpired ? 'EXPIRED' : 'One Day Pass'}</Text>
                </View>

                <Animated.Image
                  source={require('../../../assets/images/pmpml.jpg')}
                  style={[styles.ticketLogoImage, { transform: [{ scale: logoScale }] }]}
                  resizeMode="contain"
                />

                <View style={styles.expiresRow}>
                  <Text style={styles.expiresLabel}>Expires in</Text>
                  <Text style={styles.expiresValue}>{formatTime(remainingSeconds)}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.qrButton}
              activeOpacity={0.85}
              onPress={() => setShowQRCode((value) => !value)}
            >
              <Text style={styles.qrButtonText}>
                {showQRCode ? 'Hide QR code' : 'Show QR code'}
              </Text>
            </TouchableOpacity>

            {showQRCode && (
              <View style={styles.qrDisplay}>
                <View style={styles.qrPlaceholderLarge}>
                  <Text style={styles.qrLabel}>QR CODE</Text>
                  <Text style={styles.qrSubLabel}>Present this code for scanning</Text>
                </View>
                <Text style={styles.qrCodeText}>{pass?.passCode}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#00C4C4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  closeButtonLabel: {
    fontSize: 22,
    color: '#1A1A1A',
  },
  content: {
    paddingBottom: 40,
  },
  ticketCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  ticketHeader: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  ticketHeaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ticketBodyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  infoBoxTop: {
    flex: 1,
    alignItems: 'flex-start',
  },
  infoLabel: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  dashedSeparator: {
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },
  ticketBodyBottom: {
    padding: 16,
    backgroundColor: '#F3F3F3',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  timeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    minHeight: 78,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#888888',
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  ticketId: {
    textAlign: 'center',
    fontSize: 13,
    color: '#555555',
    marginVertical: 12,
    letterSpacing: 0.5,
  },
  passBanner: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  passBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  passBannerExpired: {
    backgroundColor: '#888888',
  },
  ticketLogoImage: {
    width: '100%',
    height: 260,
    marginBottom: 16,
    borderRadius: 20,
  },
  expiresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  expiresLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#888888',
  },
  expiresValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  qrButton: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: '#E7F6F6',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B7E3E2',
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  qrDisplay: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    alignItems: 'center',
  },
  qrPlaceholderLarge: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    backgroundColor: '#F2FCFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B7E3E2',
    marginBottom: 16,
  },
  qrLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  qrSubLabel: {
    fontSize: 12,
    color: '#555555',
  },
  qrCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 1,
    textAlign: 'center',
  },
  emptyState: {
    margin: 20,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: '#2E9B5E',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
