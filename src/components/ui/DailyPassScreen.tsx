import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
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

const INITIAL_TIMER = 4 * 60 + 57; // 04:57

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
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
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
            <Text style={styles.cardGreenHeaderText}>{getFormattedDate()}</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.sectionLabel}>Select pass type</Text>

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

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>{selected.info}</Text>
            </View>

            {/* Dashed divider */}
            <View style={styles.dashedDivider} />

            {/* Aadhar / PAN */}
            <Text style={styles.idLabel}>
              {'Enter last 4 digits of your\nAadhar Card or Pan Card'}
            </Text>

            <View style={styles.digitRow}>
              {digits.map((d, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => {
                    inputRefs.current[i] = ref;
                  }}
                  style={styles.digitBox}
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
          <Text style={styles.fareAmount}>
            ₹{selected.fare.toFixed(2)}
          </Text>
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
          
          {selectedPaymentMethod && (
            <View style={styles.selectedMethodContainer}>
              <Text style={styles.selectedMethodLabel}>Selected: </Text>
              <Text style={styles.selectedMethodValue}>{selectedPaymentMethod}</Text>
            </View>
          )}
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.paymentOption}
              onPress={() => handlePaymentOptionSelect('Google Pay')}
            >
              <View style={[styles.paymentLogo, { backgroundColor: '#4285F4' }]}>
                <Text style={styles.paymentLogoText}>G</Text>
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Google Pay</Text>
                <Text style={styles.paymentDescription}>UPI, Credit/Debit Cards</Text>
              </View>
              <Text style={styles.paymentArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.paymentOption}
              onPress={() => handlePaymentOptionSelect('PhonePe')}
            >
              <View style={[styles.paymentLogo, { backgroundColor: '#5F2D96' }]}>
                <Text style={styles.paymentLogoText}>₱</Text>
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>PhonePe</Text>
                <Text style={styles.paymentDescription}>UPI, Mobile Recharge</Text>
              </View>
              <Text style={styles.paymentArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.paymentOption}
              onPress={() => handlePaymentOptionSelect('Paytm')}
            >
              <View style={[styles.paymentLogo, { backgroundColor: '#00BAF2' }]}>
                <Text style={styles.paymentLogoText}>P</Text>
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Paytm</Text>
                <Text style={styles.paymentDescription}>UPI, Wallet, Cards</Text>
              </View>
              <Text style={styles.paymentArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.paymentOption}
              onPress={() => handlePaymentOptionSelect('Amazon Pay')}
            >
              <View style={[styles.paymentLogo, { backgroundColor: '#FF9900' }]}>
                <Text style={styles.paymentLogoText}>A</Text>
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Amazon Pay</Text>
                <Text style={styles.paymentDescription}>UPI, Amazon Balance</Text>
              </View>
              <Text style={styles.paymentArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.paymentOption}
              onPress={() => handlePaymentOptionSelect('BHIM UPI')}
            >
              <View style={[styles.paymentLogo, { backgroundColor: '#674EA7' }]}>
                <Text style={styles.paymentLogoText}>B</Text>
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>BHIM UPI</Text>
                <Text style={styles.paymentDescription}>Direct UPI Payment</Text>
              </View>
              <Text style={styles.paymentArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const GREEN = '#2E9B5E';
const GREEN_DARK = '#237A4A';
const ORANGE = '#C06A00';
const ORANGE_BG = '#FFF8EE';
const BG = '#F0F0F0';
const WHITE = '#FFFFFF';
const TEXT = '#1A1A1A';
const MUTED = '#666666';
const BORDER = '#DEDEDE';
const GREEN_LIGHT = '#D4F0E3';
const GREEN_TEXT = '#1A6B3E';

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
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  backBtn: {
    paddingRight: 10,
  },
  backArrow: {
    fontSize: 22,
    color: TEXT,
    lineHeight: 26,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: TEXT,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT,
  },

  /* ── Scroll ── */
  scrollContent: {
    padding: 12,
    paddingBottom: 110,
    gap: 10,
  },

  /* ── Card ── */
  card: {
    backgroundColor: WHITE,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: BORDER,
  },
  cardGreenHeader: {
    backgroundColor: GREEN,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  cardGreenHeaderText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  cardBody: {
    padding: 15,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 14,
    color: MUTED,
  },

  /* ── Pass Options ── */
  passOption: {
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  passOptionSelected: {
    backgroundColor: GREEN_LIGHT,
    borderColor: GREEN,
  },
  passOptionUnselected: {
    backgroundColor: WHITE,
    borderColor: BORDER,
  },
  passOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT,
  },
  passOptionTextSelected: {
    color: GREEN_TEXT,
  },

  /* ── Info Box ── */
  infoBox: {
    backgroundColor: ORANGE_BG,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoBoxText: {
    fontSize: 13,
    color: '#7A5C1E',
  },

  /* ── Dashed Divider ── */
  dashedDivider: {
    borderTopWidth: 1.5,
    borderTopColor: '#CCCCCC',
    borderStyle: 'dashed',
    marginVertical: 2,
  },

  /* ── ID Input ── */
  idLabel: {
    fontSize: 14,
    color: TEXT,
    lineHeight: 21,
  },
  digitRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },
  digitBox: {
    width: 54,
    height: 52,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 8,
    backgroundColor: WHITE,
    fontSize: 22,
    fontWeight: '600',
    color: TEXT,
  },
  warnBox: {
    backgroundColor: ORANGE_BG,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  warnText: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: '500',
  },

  /* ── Fare Card ── */
  fareCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: BORDER,
  },
  fareLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
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
    fontSize: 11,
    color: MUTED,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  fareAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: GREEN,
  },

  /* ── Bottom Bar ── */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
  },
  payUsing: {
    gap: 8,
    minWidth: 120,
    flex: 1,
  },
  payUsingLabel: {
    fontSize: 11,
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  gpayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    gap: 8,
  },
  gpayLogoContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpayLogo: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  gpayText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    color: '#8E8E93',
  },
  selectedMethodContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedMethodLabel: {
    fontSize: 10,
    color: MUTED,
  },
  selectedMethodValue: {
    fontSize: 10,
    fontWeight: '600',
    color: GREEN,
  },
  payBtn: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  payBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },

  /* ── Modal Styles ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
  },
  modalClose: {
    fontSize: 20,
    color: MUTED,
    padding: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  paymentLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentLogoText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 12,
    color: MUTED,
  },
  paymentArrow: {
    fontSize: 20,
    color: '#C7C7CC',
  },
});