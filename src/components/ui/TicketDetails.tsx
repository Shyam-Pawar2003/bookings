import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Bus stops data for route 167
const BUS_STOPS = [
  { id: 'S1', name: 'S1 Kesnand Phata Wagholi', sector: 'starting' },
  { id: 'S2', name: 'S2 Wagholi', sector: 'intermediate' },
  { id: 'S3', name: 'S3 Satav High School', sector: 'intermediate' },
  { id: 'S4', name: 'S4 Panmala Wagholi', sector: 'intermediate' },
  { id: 'S5', name: 'S5 Soyrik Mangal Karyalay', sector: 'intermediate' },
  { id: 'S6', name: 'S6 Talera Godown', sector: 'intermediate' },
  { id: 'S7', name: 'S7 Sai Satyam Society', sector: 'intermediate' },
  { id: 'S8', name: 'S8 Khandve Nagar', sector: 'intermediate' },
  { id: 'S9', name: 'S9 Aaple Ghar', sector: 'intermediate' },
  { id: 'S10', name: 'S10 Janakbaba Darga', sector: 'intermediate' },
  { id: 'S11', name: 'S11 Kharadi Bypass', sector: 'intermediate' },
  { id: 'S12', name: 'S12 Pathare Vasti', sector: 'intermediate' },
  { id: 'S13', name: 'S13 Shankar Nagar', sector: 'intermediate' },
  { id: 'S14', name: 'S14 Rakshak Nagar', sector: 'intermediate' },
  { id: 'S15', name: 'S15 Thite Vasti', sector: 'intermediate' },
  { id: 'S16', name: 'S16 Columbia Hospital', sector: 'intermediate' },
  { id: 'S17', name: 'S17 Sainath Nagar', sector: 'intermediate' },
  { id: 'S18', name: 'S18 Mundhwa Gaon', sector: 'intermediate' },
  { id: 'S19', name: 'S19 Kirtanebaug', sector: 'intermediate' },
  { id: 'S20', name: 'S20 RapsuSaheb Maqar Vasti', sector: 'intermediate' },
  { id: 'S21', name: 'S21 Mega City', sector: 'intermediate' },
  { id: 'S22', name: 'S22 Magarpatta Ma Na Pa', sector: 'intermediate' },
  { id: 'S23', name: 'S23 Tilekar Vasti', sector: 'intermediate' },
  { id: 'S24', name: 'S24 Magarpatta Dawakhana', sector: 'intermediate' },
  { id: 'S25', name: 'S25 Hadapsargaon', sector: 'intermediate' },
  { id: 'S26', name: 'S26 Tupe Hospital', sector: 'intermediate' },
  { id: 'S27', name: 'S27 Hadapsar Gadital', sector: 'intermediate' },
  { id: 'S28', name: 'S28 Glyding Center', sector: 'intermediate' },
  { id: 'S29', name: 'S29 Satavwadi', sector: 'intermediate' },
  { id: 'S30', name: 'S30 Gondhale Nagar', sector: 'intermediate' },
  { id: 'S31', name: 'S31 Satyapuram', sector: 'intermediate' },
  { id: 'S32', name: 'S32 Ibm', sector: 'intermediate' },
  { id: 'S33', name: 'S33 Ganga Nagar Saswad', sector: 'intermediate' },
  { id: 'S34', name: 'S34 Bhekrai Nagar', sector: 'ending' },
];

// Bus numbers available
const BUS_NUMBERS = ['167', '168', '169', '201', '202'];

// Fare calculation based on zones
const getFareByStops = (startStop: string, endStop: string): number => {
  const startIndex = BUS_STOPS.findIndex(stop => stop.name === startStop);
  const endIndex = BUS_STOPS.findIndex(stop => stop.name === endStop);
  
  if (startIndex === -1 || endIndex === -1) return 10;
  
  const stopsCount = Math.abs(endIndex - startIndex);
  
  // Kesnand Phata Wagholi (S1) starting point
  const isStartingFromKesnand = startStop.includes('Kesnand Phata Wagholi');
  const isStartingFromKharadi = startStop.includes('Kharadi Bypass');
  
  // Pricing logic:
  // - Up to 10 stops from Kesnand Phata Wagholi = 10 rupees
  if (isStartingFromKesnand && stopsCount <= 10) return 10;
  
  // - From Kesnand beyond 10 stops = 20 rupees
  if (isStartingFromKesnand && stopsCount > 10 && stopsCount <= 18) return 20;
  
  // - Beyond 18 stops = 25 rupees
  if (isStartingFromKesnand && stopsCount > 18) return 30;
  
  // - Up to 8 stops from Kharadi Bypass = 10 rupees
  if (isStartingFromKharadi && stopsCount <= 8) return 10;
  
  // - From Kharadi beyond 8 stops = 20 rupees
  if (isStartingFromKharadi && stopsCount > 8 && stopsCount <= 15) return 20;
  
  // - Beyond 15 stops from Kharadi = 25 rupees
  if (isStartingFromKharadi && stopsCount > 15) return 30;
  
  // Default pricing for other routes
  if (stopsCount <= 10) return 10;
  if (stopsCount <= 18) return 20;
  return 30;
};

// Predefined fare routes
const getPredefinedFare = (startStop: string, endStop: string): number => {
  const fareMap: { [key: string]: number } = {
    'S2 Wagholi-S11 Kharadi Bypass': 10,
    'S12 Pathare Vasti-S18 Mundhwa Gaon': 10,
    'S18 Mundhwa Gaon-S27 Hadapsar Gadital': 10,
    'S28 Glyding Center-S34 Bhekrai Nagar': 10,
  };
  
  const key = `${startStop}-${endStop}`;
  return fareMap[key] || getFareByStops(startStop, endStop);
};

export default function TicketDetails() {
  const router = useRouter();
  const [route, setRoute] = useState('');
  const [tab, setTab] = useState<'fare' | 'stop'>('fare');
  const [fullTickets, setFullTickets] = useState(1);
  const [halfTickets, setHalfTickets] = useState(0);
  const [startingStop, setStartingStop] = useState('');
  const [endingStop, setEndingStop] = useState('');
  const [showBusModal, setShowBusModal] = useState(false);
  const [showStartStopModal, setShowStartStopModal] = useState(false);
  const [showEndStopModal, setShowEndStopModal] = useState(false);
  const [filteredStops, setFilteredStops] = useState(BUS_STOPS);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [showAutoFill, setShowAutoFill] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  useEffect(() => {
    if (startingStop && endingStop) {
      const price = getPredefinedFare(startingStop, endingStop);
      setTicketPrice(price);
    }
  }, [startingStop, endingStop]);

  const calculateTotalFare = () => {
    return (fullTickets * ticketPrice) + (halfTickets * (ticketPrice / 2));
  };

  const handleBusSelect = (busNumber: string) => {
    setRoute(busNumber);
    setShowBusModal(false);
  };

  const handleStartStopSelect = (stop: string) => {
    setStartingStop(stop);
    setShowStartStopModal(false);
    // Auto-fill logic
    if (stop === 'S2 Wagholi') {
      setEndingStop('S11 Kharadi Bypass');
      setTicketPrice(10);
    }
  };

  const handleEndStopSelect = (stop: string) => {
    setEndingStop(stop);
    setShowEndStopModal(false);
  };

  const filterStops = (text: string) => {
    if (text) {
      const filtered = BUS_STOPS.filter(stop => 
        stop.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStops(filtered);
      setShowAutoFill(true);
    } else {
      setFilteredStops(BUS_STOPS);
      setShowAutoFill(false);
    }
  };

  const renderStopItem = ({ item }: { item: typeof BUS_STOPS[0] }) => (
    <TouchableOpacity
      style={styles.stopItem}
      onPress={() => {
        if (showStartStopModal) {
          handleStartStopSelect(item.name);
        } else if (showEndStopModal) {
          handleEndStopSelect(item.name);
        }
      }}
    >
      <Text style={styles.stopItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Details</Text>
        <Text style={styles.clock}>04:56</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{dateStr} | {timeStr}</Text>
          </View>

          <View style={styles.routeInputWrapper}>
            <TouchableOpacity 
              style={styles.routeInputCard}
              onPress={() => setShowBusModal(true)}
            >
              <Text style={styles.routeIcon}>🚌</Text>
              <Text style={[styles.routeInput, !route && styles.placeholderText]}>
                {route || "Select or enter route"}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Notch + dashed separator */}
          <View style={styles.notchRow}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          <View style={styles.stopsContainer}>
            <TouchableOpacity 
              style={styles.stopRow}
              onPress={() => setShowStartStopModal(true)}
            >
              <View style={styles.stopDot} />
              <Text style={[styles.stopLabel, startingStop && styles.stopLabelSelected]}>
                {startingStop || "Starting stop"}
              </Text>
            </TouchableOpacity>
            <View style={styles.stopLine} />
            <TouchableOpacity 
              style={styles.stopRow}
              onPress={() => setShowEndStopModal(true)}
            >
              <View style={styles.stopDot} />
              <Text style={[styles.stopLabel, endingStop && styles.stopLabelSelected]}>
                {endingStop || "Ending stop"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabButton, tab === 'fare' && styles.tabActive]}
              onPress={() => setTab('fare')}
            >
              <Text style={[styles.tabText, tab === 'fare' && styles.tabTextActive]}>By Fare</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, tab === 'stop' && styles.tabActive]}
              onPress={() => setTab('stop')}
            >
              <Text style={[styles.tabText, tab === 'stop' && styles.tabTextActive]}>By Ending stop</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Ticket Price</Text>
            <Text style={styles.sectionValue}>₹{ticketPrice.toFixed(2)}</Text>
          </View>

          <View style={styles.counterCard}>
            <View style={styles.counterRow}>
              <Text style={styles.counterLabel}>Full</Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setFullTickets(Math.max(0, fullTickets - 1))}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>
                <View style={styles.counterValueContainer}>
                  <Text style={styles.counterValue}>{fullTickets}</Text>
                </View>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setFullTickets(fullTickets + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.counterRow}>
              <Text style={styles.counterLabel}>Half</Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setHalfTickets(Math.max(0, halfTickets - 1))}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>
                <View style={styles.counterValueContainer}>
                  <Text style={styles.counterValue}>{halfTickets}</Text>
                </View>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setHalfTickets(halfTickets + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Fare Info */}
          {startingStop && endingStop && (
            <View style={styles.fareInfo}>
              <Text style={styles.fareInfoText}>
                Fare from {startingStop.split(' ')[1]} to {endingStop.split(' ')[1]}: ₹{ticketPrice} per person
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.payDetail}>
          <Text style={styles.payLabel}>PAY USING ▲</Text>
          <Text style={styles.payMethod}>PhonePe</Text>
        </View>
        <TouchableOpacity 
          style={styles.payButton} 
          activeOpacity={0.85}
          onPress={() => router.push('/view-ticket')}
        >
          <Text style={styles.payButtonText}>Pay ₹{calculateTotalFare().toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      {/* Bus Number Modal */}
      <Modal
        visible={showBusModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bus Route</Text>
              <TouchableOpacity onPress={() => setShowBusModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={BUS_NUMBERS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleBusSelect(item)}
                >
                  <Text style={styles.modalItemText}>Bus {item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Starting Stop Modal */}
      <Modal
        visible={showStartStopModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStartStopModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Starting Stop</Text>
              <TouchableOpacity onPress={() => setShowStartStopModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearch}
              placeholder="Search stops..."
              onChangeText={filterStops}
              placeholderTextColor="#999"
            />
            <FlatList
              data={filteredStops}
              keyExtractor={(item) => item.id}
              renderItem={renderStopItem}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>

      {/* Ending Stop Modal */}
      <Modal
        visible={showEndStopModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEndStopModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Ending Stop</Text>
              <TouchableOpacity onPress={() => setShowEndStopModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearch}
              placeholder="Search stops..."
              onChangeText={filterStops}
              placeholderTextColor="#999"
            />
            <FlatList
              data={filteredStops}
              keyExtractor={(item) => item.id}
              renderItem={renderStopItem}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F1F5F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEEF0',
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#1B1B1B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  clock: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6EBF0',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  banner: {
    backgroundColor: '#2E9B5E',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  routeInputWrapper: {
    padding: 16,
  },
  routeInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    backgroundColor: '#F9FAFB',
  },
  routeIcon: {
    fontSize: 20,
  },
  routeInput: {
    flex: 1,
    fontSize: 15,
    color: '#1B1B1B',
    minHeight: 40,
  },
  placeholderText: {
    color: '#8A8A8A',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  stopsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
    paddingVertical: 8,
  },
  stopDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderColor: '#B0B0B0',
    borderWidth: 2,
  },
  stopLabel: {
    fontSize: 14,
    color: '#7A7A7A',
    flex: 1,
  },
  stopLabelSelected: {
    color: '#2E9B5E',
    fontWeight: '600',
  },
  stopLine: {
    height: 32,
    width: 2,
    backgroundColor: '#D3D3D3',
    marginLeft: 6,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#2E9B5E',
    borderColor: '#2E9B5E',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A4A4A',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#7A7A7A',
  },
  sectionValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E9B5E',
  },
  counterCard: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 18,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EBF0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  counterBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  counterBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  counterValue: {
    width: 42,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  counterValueContainer: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E6EBF0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payDetail: {
    flex: 1,
  },
  payLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#8A8A8A',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  payMethod: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  payButton: {
    backgroundColor: '#2E9B5E',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    flex: 1,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  fareInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  fareInfoText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBF0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  modalClose: {
    fontSize: 20,
    color: '#8A8A8A',
    padding: 4,
  },
  modalSearch: {
    padding: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    borderRadius: 10,
    fontSize: 14,
  },
  modalList: {
    paddingHorizontal: 16,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1B1B1B',
  },
  stopItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stopItemText: {
    fontSize: 14,
    color: '#1B1B1B',
  },
  // Notch styles
  notchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  notchLeft: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F8',
    marginLeft: -11,
    zIndex: 2,
  },
  notchRight: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F8',
    marginRight: -11,
    zIndex: 2,
  },
  dashedLine: {
    flex: 1,
    borderTopWidth: 1.5,
    borderTopColor: '#D0D0D0',
    borderStyle: 'dashed',
  },
});