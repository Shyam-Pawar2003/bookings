import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
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
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = String(date.getFullYear() % 100).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${day} ${month}, ${year} | ${hour12}:${minutes} ${ampm}`;
}

function generatePassCode() {
  const now = new Date();
  const datePart = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
  ].join('');

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';

  for (let index = 0; index < 6; index += 1) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return `${datePart}${randomPart}`;
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
          // Generate pass code if not present
          if (!parsed.passCode || /PMC|-/.test(parsed.passCode)) {
            parsed.passCode = generatePassCode();
          }
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
    if (!pass) return;
    const interval = setInterval(() => {
      setRemainingSeconds(Math.max(0, Math.floor((pass.expiresAt - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [pass]);

  useEffect(() => {
  const breathingAnimation = Animated.loop(
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.12,
        duration: 1000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),

      Animated.timing(logoScale, {
        toValue: 0.7,
        duration: 1000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ])
  );

  breathingAnimation.start();

  return () => breathingAnimation.stop();
}, []);

  const isExpired = pass ? remainingSeconds <= 0 : false;
  const hasPass = !!pass;
  const expiryLabel = pass ? formatDateTime(new Date(pass.expiresAt)) : '';
  const bookingLabel = pass ? formatDateTime(new Date(pass.purchasedAt)) : '';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonLabel}>✕</Text>
        </TouchableOpacity>
        <View style={styles.topBarRight}>
          <Text style={styles.topBarLink}>Need Help?</Text>
          <Text style={styles.topBarLink}>All passes</Text>
        </View>
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
              {/* Red header */}
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketHeaderText}>पुणे महानगर परिवहन महामंडळ लि.</Text>
              </View>

              {/* Top info row */}
              <View style={styles.ticketBodyTop}>
                {[
                  { label: 'Pass Type', value: pass.label },
                  { label: 'ID', value: pass.idNumber },
                  { label: 'Fare', value: `₹${pass.fare.toFixed(2)}` },
                ].map((item, index) => (
                  <View
                    key={item.label}
                    style={[
                      styles.infoBoxTop,
                      index === 1 && styles.infoBoxCenter,
                      index === 2 && styles.infoBoxRight,
                    ]}
                  >
                   <Text style={styles.infoLabel}>
  {item.label}
</Text>

<Text
  style={[
    styles.infoValue,
    item.label === 'Pass Type' && styles.passTypeValue,
    index === 2 && styles.infoValueRight,
  ]}
>
  {item.value}
</Text>
                  </View>
                ))}
              </View>

              {/* Notch + dashed separator */}
              <View style={styles.notchRow}>
                <View style={styles.notchLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.notchRight} />
              </View>

              {/* Bottom section */}
              <View style={styles.ticketBodyBottom}>
                <View style={styles.timeRow}>
                  <View style={[styles.timeCard, styles.timeCardSpacing]}>
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

                {/* PMPML Logo Circle */}
                <Animated.View style={[styles.logoCircle, { transform: [{ scale: logoScale }] }]}>
                  <Image
                    source={require('../../../assets/images/pmpml.jpg')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>

              <View style={styles.expiresRow}>
                <Text style={styles.expiresText}>
                  Expires in{' '}
                  <Text style={styles.expiresValue}>{formatTime(remainingSeconds)}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.qrFooterSection}>
              <TouchableOpacity
                style={styles.qrButton}
                activeOpacity={0.85}
                onPress={() => setShowQRCode((value) => !value)}
              >
                <View style={styles.qrIconContainer}>
                  <Image
                    source={require('../../../assets/images/ORCode.png')}
                    style={styles.qrIconImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.qrButtonText}>
                  {showQRCode ? 'Hide QR code' : 'Show QR code'}
                </Text>
              </TouchableOpacity>

              {showQRCode && (
                <View style={styles.qrDisplay}>
                  <View style={styles.qrPlaceholderLarge}>
                    <Image
                      source={require('../../../assets/images/ORCode.png')}
                      style={styles.qrLogoImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.qrLabel}>QR CODE</Text>
                    <Text style={styles.qrSubLabel}>Present this code for scanning</Text>
                  </View>
                  <Text style={styles.qrCodeText}>{pass?.passCode}</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const FONT_FAMILY = 'sans-serif';
const TEAL     = '#00ACC1';
const RED      = '#D32F2F';
const WHITE    = '#FFFFFF';
const TEXT     = '#1E293B';
const MUTED    = '#64748B';
const GRAY_BG  = '#F8FAFC';
const BORDER   = '#E2E8F0';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#58E0D5',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 22,
    color: '#212121',
    fontWeight: '500',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarLink: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    marginLeft: 18,
  },

  content: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 40,
  },

  ticketCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#DADADA',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  ticketHeader: {
  backgroundColor: '#E21B0C',
  height: 58,
  paddingHorizontal: 18,
  alignItems: 'center',
  justifyContent: 'center',

  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
},
  ticketHeaderText: {
  color: '#FFFFFF',
  fontSize: 21,
  fontWeight: '700',
  fontFamily: 'sans-serif-medium',
  textAlign: 'center',
  letterSpacing: 0.2,
},

ticketBodyTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 18,
  paddingTop: 16,
  paddingBottom: 14,
},
  infoBoxTop: {
    flex: 1,
  },
  infoBoxCenter: {
    alignItems: 'center',
  },
  infoBoxRight: {
    alignItems: 'flex-end',
  },
infoLabel: {
  fontSize: 13,
  color: '#666666',
  fontFamily: 'sans-serif',
  marginBottom: 4,
},
  infoValue: {
  fontFamily: 'sans-serif-medium',
  fontSize: 20,
  fontWeight: '800',
  color: '#212121',
  lineHeight: 24,
},
  passTypeValue: {
    fontSize: 25,
    fontWeight: '800',
  },
  infoValueRight: {
    textAlign: 'right',
  },

  notchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  notchLeft: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#56E0D5',
    marginLeft: -21,
    zIndex: 2,
  },
  notchRight: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#56E0D5',
    marginRight: -21,
    zIndex: 2,
  },
  dashedLine: {
    flex: 1,
    borderTopWidth: 1.5,
    borderTopColor: BORDER,
    borderStyle: 'dashed',
  },

  ticketBodyBottom: {
    backgroundColor: WHITE,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 0,
  },
  timeRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 12,
  },

  timeCard: {
    flex: 1,
  },

  timeCardSpacing: {
    marginRight: 20,
},
  timeLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 6,
  },
  timeValue: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 22,
  },
  ticketId: {
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: 1,
  },
  passBanner: {
    backgroundColor: '#E31C0D',
    minHeight: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    marginTop: 8,
    marginBottom: 15,
    marginHorizontal: -18,
    alignSelf: 'stretch',
    borderRadius: 0,
  },

  passBannerText: {
    fontFamily: FONT_FAMILY,
    color: WHITE,
    fontSize: 16  ,
    fontWeight: '400',
    textAlign: 'center',
  },
  passBannerExpired: {
    backgroundColor: '#888888',
  },

  logoCircle: {
  width: 200,
  height: 200,
  borderRadius: 100,
  backgroundColor: WHITE,
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 2,
  zIndex: 2,
},
  logoOuterRing: {
  position: 'absolute',
  width: 220,
  height: 220,
  borderRadius: 110,
  borderWidth: 1,
  borderColor: '#999',
  borderStyle: 'dashed',
  zIndex: 1,
},
  logoMarathiTop: {
    fontSize: 8,
    color: '#444444',
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: 0.2,
    paddingHorizontal: 10,
  },
  arrowRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderRightWidth: 22,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: TEXT,
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderLeftWidth: 22,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: TEXT,
  },
  logoParivahan: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 1,
  },
  logoPMPML: {
    fontSize: 28,
    fontWeight: '900',
    color: RED,
    letterSpacing: 2,
    marginBottom: 1,
  },
  logoSeva: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 3,
  },
  logoMarathiBot: {
    fontSize: 8,
    color: '#444444',
    textAlign: 'center',
    paddingHorizontal: 10,
    letterSpacing: 0.2,
  },
  logoImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: WHITE,
  },

  expiresRow: {
    marginHorizontal: 0,
    height: 23,
    paddingHorizontal: 18,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  expiresText: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: '#6B7280',
    backgroundColor: 'transparent',
    fontWeight: '500',
    textAlign: 'center',
  },
  expiresValue: {
    fontFamily: FONT_FAMILY,
    fontWeight: '700',
    color: '#6B7280',
  },

  qrButton: {
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: WHITE,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DADADA',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  qrIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  qrIconImage: {
    width: 24,
    height: 24,
  },
  qrButtonText: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },

  qrFooterSection: {
    marginTop: 'auto',
    paddingTop: 16,
  },

  qrDisplay: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 18,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
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
  qrLogoImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  qrLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 8,
  },
  qrSubLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    color: '#555555',
  },
  qrCodeText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: 1,
    textAlign: 'center',
  },

  emptyState: {
    margin: 20,
    padding: 24,
    backgroundColor: WHITE,
    borderRadius: 18,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT,
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
    color: WHITE,
    fontWeight: '700',
    fontSize: 14,
  },
});
