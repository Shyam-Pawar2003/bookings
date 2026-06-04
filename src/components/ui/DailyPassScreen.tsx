import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PASSES = [
  {
    id: 'pmc',
    label: 'PMC & PCMC',
    price: '₹70.0',
    fare: 70.83,
    info: 'Valid in all routes of PMC and PCMC',
  },
  {
    id: 'all',
    label: 'All Route',
    price: '₹150.0',
    fare: 150.83,
    info: 'Valid in all routes including Express and Premium',
  },
];

const INITIAL_TIMER = 4 * 60 + 57;

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getFormattedDate() {
  const now = new Date();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const mm = String(m).padStart(2, '0');
  return `${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()} | ${h12}:${mm} ${ampm}`;
}

export default function DailyPassScreen() {
  const router = useRouter();
  const [selectedPass, setSelectedPass] = useState('pmc');
  const [digits, setDigits] = useState(['5', '2', '3', '8']);
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const selected = PASSES.find(p => p.id === selectedPass)!;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleDigitChange(val: string, index: number) {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handlePayPress() {
    const idNumber = digits.join('');
    if (idNumber.length < 4 || digits.some((digit) => digit === '')) {
      Alert.alert('Enter valid ID', 'Please fill all 4 digits of your Aadhar Card or PAN Card.');
      return;
    }
    if (!selectedPaymentMethod) {
      Alert.alert('Select Payment Method', 'Please select a payment method first.');
      return;
    }
    const now = new Date();
    const expiration = new Date(now);
    expiration.setHours(23, 59, 59, 999);
    const passCode = `${selected.id.toUpperCase()}-${idNumber}-${Math.random().toString(36).slice(-6).toUpperCase()}`;
    const passData = {
      id: selected.id,
      label: selected.label,
      price: selected.price,
      fare: selected.fare,
      info: selected.info,
      idNumber,
      passCode,
      paymentMethod: selectedPaymentMethod,
      purchasedAt: now.getTime(),
      expiresAt: expiration.getTime(),
    };
    try {
      await AsyncStorage.setItem('DAILY_PASS', JSON.stringify(passData));
      router.push('/view-pass');
    } catch (error) {
      Alert.alert('Payment error', 'Something went wrong while saving your pass. Please try again.');
    }
  }

  const handleGPayPress = () => {
    setSelectedPaymentMethod('Google Pay');
    setShowPaymentModal(true);
  };

  const handlePaymentOptionSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setShowPaymentModal(false);
    Alert.alert('Payment Method Selected', `${method} selected successfully.`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Pass</Text>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Pass Type Card */}
        <View style={styles.card}>
          {/* Green date header */}
          <View style={styles.cardGreenHeader}>
            <View style={styles.cardGreenHeaderInner}>
              <View style={styles.dateDot} />
              <Text style={styles.cardGreenHeaderText}>{getFormattedDate()}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.sectionLabel}>Select pass type</Text>

            <View style={styles.passOptionsRow}>
              {PASSES.map(pass => (
                <TouchableOpacity
                  key={pass.id}
                  style={[
                    styles.passOption,
                    selectedPass === pass.id
                      ? styles.passOptionSelected
                      : styles.passOptionUnselected,
                  ]}
                  onPress={() => setSelectedPass(pass.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.passOptionText,
                      selectedPass === pass.id && styles.passOptionTextSelected,
                    ]}
                  >
                    {pass.label} - {pass.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ</Text>
              <Text style={styles.infoBoxText}>{selected.info}</Text>
            </View>

            {/* Ticket tear divider */}
            <View style={styles.tearDividerRow}>
              <View style={styles.tearCircleLeft} />
              <View style={styles.dashedDivider} />
              <View style={styles.tearCircleRight} />
            </View>

            {/* Aadhar / PAN */}
            <Text style={styles.idLabel}>
              {'Enter last 4 digits of your\nAadhar Card or Pan Card'}
            </Text>

            <View style={styles.digitRow}>
              {digits.map((d, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => { inputRefs.current[i] = ref; }}
                  style={[styles.digitBox, d ? styles.digitBoxFilled : null]}
                  value={d}
                  onChangeText={val => handleDigitChange(val, i)}
                  onKeyPress={({ nativeEvent }) =>
                    handleDigitKeyPress(nativeEvent.key, i)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            <View style={styles.warnBox}>
              <Text style={styles.warnIcon}>⚠</Text>
              <Text style={styles.warnText}>
                You should have a valid ID with above details.
              </Text>
            </View>
          </View>
        </View>

        {/* Final Fare Card */}
        <View style={styles.fareCard}>
          <View style={styles.fareLabelRow}>
            <Text style={styles.fareLabel}>Final Fare</Text>
            <View style={styles.infoIconCircle}>
              <Text style={styles.infoIconText}>i</Text>
            </View>
          </View>
          <View style={styles.fareAmountRow}>
            <Text style={styles.fareAmount}>
              ₹{selected.fare.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Pay Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.payUsing}>
          <Text style={styles.payUsingLabel}>PAY USING</Text>
          <TouchableOpacity style={styles.gpayButton} onPress={handleGPayPress}>
            <View style={styles.gpayLogoContainer}>
              <Text style={styles.gpayLogo}>G</Text>
            </View>
            <Text style={styles.gpayText}>Google Pay</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          {selectedPaymentMethod ? (
            <View style={styles.selectedMethodContainer}>
              <Text style={styles.selectedMethodLabel}>Selected: </Text>
              <Text style={styles.selectedMethodValue}>{selectedPaymentMethod}</Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity style={styles.payBtn} activeOpacity={0.85} onPress={handlePayPress}>
          <Text style={styles.payBtnText}>Pay ₹{selected.fare.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Options Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {[
              { method: 'Google Pay', color: '#4285F4', letter: 'G', desc: 'UPI, Credit/Debit Cards' },
              { method: 'PhonePe', color: '#5F2D96', letter: '₱', desc: 'UPI, Mobile Recharge' },
              { method: 'Paytm', color: '#00BAF2', letter: 'P', desc: 'UPI, Wallet, Cards' },
              { method: 'Amazon Pay', color: '#FF9900', letter: 'A', desc: 'UPI, Amazon Balance' },
              { method: 'BHIM UPI', color: '#674EA7', letter: 'B', desc: 'Direct UPI Payment' },
            ].map(({ method, color, letter, desc }) => (
              <TouchableOpacity
                key={method}
                style={styles.paymentOption}
                onPress={() => handlePaymentOptionSelect(method)}
              >
                <View style={[styles.paymentLogo, { backgroundColor: color }]}>
                  <Text style={styles.paymentLogoText}>{letter}</Text>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>{method}</Text>
                  <Text style={styles.paymentDescription}>{desc}</Text>
                </View>
                <Text style={styles.paymentArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ── Design Tokens ── */
const GREEN = '#1E8A52';
const GREEN_LIGHT = '#E8F7EF';
const GREEN_TEXT = '#145E38';
const GREEN_HEADER = '#1A7A48';
const ORANGE = '#B85C00';
const ORANGE_BG = '#FFF4E6';
const ORANGE_BORDER = '#FFD9A8';
const BG = '#F2F4F7';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const DIGIT_ACTIVE = '#1E8A52';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backArrow: {
    fontSize: 20,
    color: TEXT,
    lineHeight: 22,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.3,
  },
  timerBadge: {
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A8DBBE',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
    color: GREEN_TEXT,
    letterSpacing: 0.5,
  },

  /* ── Scroll ── */
  scrollContent: {
    padding: 14,
    paddingBottom: 120,
    gap: 12,
  },

  /* ── Card ── */
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGreenHeader: {
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  cardGreenHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cardGreenHeaderText: {
    color: WHITE,
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  cardBody: {
    padding: 16,
    gap: 11,
  },
  sectionLabel: {
    fontSize: 12,
    color: MUTED,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  /* ── Pass Options ── */
  passOptionsRow: {
    gap: 10,
  },
  passOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passOptionSelected: {
    backgroundColor: '#E7F4EA',
    borderColor: '#B7DDC0',
  },
  passOptionUnselected: {
    backgroundColor: WHITE,
    borderColor: BORDER,
  },
  passOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
  },
  passOptionTextSelected: {
    color: GREEN_TEXT,
  },

  /* ── Info Box ── */
  infoBox: {
    backgroundColor: ORANGE_BG,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    borderWidth: 1,
    borderColor: ORANGE_BORDER,
  },
  infoIcon: {
    fontSize: 13,
    color: ORANGE,
    marginTop: 1,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: ORANGE,
    fontWeight: '500',
    lineHeight: 18,
  },

  /* ── Tear Divider ── */
  tearDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -16,
  },
  tearCircleLeft: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    marginLeft: -9,
  },
  tearCircleRight: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: -9,
  },
  dashedDivider: {
    flex: 1,
    borderTopWidth: 1.5,
    borderTopColor: '#D1D5DB',
    borderStyle: 'dashed',
  },

  /* ── ID Input ── */
  idLabel: {
    fontSize: 14,
    color: TEXT,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 2,
  },
  digitRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  digitBox: {
    width: 55,
    height: 55,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: WHITE,
    fontSize: 22,
    fontWeight: '700',
    color: TEXT,
  },
  digitBoxFilled: {
    borderColor: GREEN,
    backgroundColor: WHITE,
    color: TEXT,
  },
  warnBox: {
    backgroundColor: ORANGE_BG,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    borderWidth: 1,
    borderColor: ORANGE_BORDER,
  },
  warnIcon: {
    fontSize: 13,
    color: ORANGE,
    marginTop: 1,
  },
  warnText: {
    flex: 1,
    fontSize: 13,
    color: ORANGE,
    fontWeight: '500',
    lineHeight: 18,
  },

  /* ── Fare Card ── */
  fareCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  fareLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.2,
  },
  infoIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: MUTED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontSize: 10,
    color: MUTED,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  fareAmountRow: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: GREEN,
    letterSpacing: -0.5,
  },

  /* ── Bottom Bar ── */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 10,
  },
  payUsing: {
    gap: 6,
    flex: 1,
  },
  payUsingLabel: {
    fontSize: 10,
    color: MUTED,
    letterSpacing: 1,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  gpayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 8,
  },
  gpayLogoContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpayLogo: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '800',
  },
  gpayText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT,
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    color: MUTED,
  },
  selectedMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  selectedMethodLabel: {
    fontSize: 10,
    color: MUTED,
  },
  selectedMethodValue: {
    fontSize: 10,
    fontWeight: '700',
    color: GREEN,
  },
  payBtn: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  payBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.2,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalClose: {
    fontSize: 14,
    color: MUTED,
    fontWeight: '600',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  paymentLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentLogoText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '800',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 12,
    color: MUTED,
  },
  paymentArrow: {
    fontSize: 22,
    color: '#D1D5DB',
  },
});
