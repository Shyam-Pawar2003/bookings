import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomNav } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NearMe } from '@/components/NearMe';
import { NearbyMap } from '@/components/NearbyMap';
import { SearchBar } from '@/components/SearchBar';
import { ShareCard } from '@/components/ShareCard';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type AppRoute = '/ticket-details' | '/daily-pass' | '/view-pass' | '/view-ticket';

type AppCard = { 
  label: string;
  icon: string;
  route?: AppRoute;
};

const primaryCards: AppCard[] = [
  { label: 'Bus Ticket', icon: '🎟️', route: '/ticket-details' },
  { label: 'Daily Pass', icon: '👤', route: '/daily-pass' },
];

const secondaryCards: AppCard[] = [
  { label: 'View Ticket', icon: '🎫', route: '/view-ticket' },
  { label: 'View Pass', icon: '🎫', route: '/view-pass' },
  { label: 'Route Timetable', icon: '↕' },
  { label: 'Metro Ticket', icon: '🚇' },
];

function ActionCard({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionGroup} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.actionCard}>
        <Text style={styles.actionIcon}>{icon}</Text>
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function MiniActionCard({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.miniGroup}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      <View style={styles.miniCard}>
        <Text style={styles.miniIcon}>{icon}</Text>
      </View>
      <Text style={styles.miniLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <SearchBar />

        <View style={styles.primaryGrid}>
          {primaryCards.map((card) => (
            <ActionCard
              key={card.label}
              {...card}
              onPress={() => {
                if (card.route) {
                  router.push(card.route);
                }
              }}
            />
          ))}
        </View>

        <View style={styles.secondaryGrid}>
          {secondaryCards.map((card) => (
            <MiniActionCard
              key={card.label}
              {...card}
              onPress={() => {
                if (card.route) {
                  router.push(card.route);
                }
              }}
            />
          ))}
        </View>

        <NearMe />

        <NearbyMap />

        <ShareCard />

        <View style={styles.poweredRow}>
          <Text style={styles.poweredMuted}>Powered by</Text>
          <Text style={styles.poweredBrand}>Chartr</Text>
          <Text style={styles.poweredMuted}>for PMPML.</Text>
        </View>
      </ScrollView>

      <BottomNav />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FBF7F7',
  },
  content: {
    paddingTop: 0,
    paddingHorizontal: Spacing.four,
    paddingBottom: 112,
    gap: Spacing.four,
  },
  primaryGrid: {
    flexDirection: 'row',
    gap: 18,
    marginTop: Spacing.two,
  },
  actionGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  actionCard: {
    width: '100%',
    aspectRatio: 1.55,
    backgroundColor: '#D8EEFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  actionIcon: {
    fontSize: 34,
    color: '#111111',
  },
  actionLabel: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#111111',
  },
  secondaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  miniGroup: {
    width: '22%',
    minWidth: 78,
    alignItems: 'center',
    gap: 8,
  },
  miniCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#D8EEFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  miniIcon: {
    fontSize: 26,
    color: '#111111',
  },
  miniLabel: {
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
    color: '#111111',
  },
  poweredRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 18,
  },
  poweredMuted: {
    fontSize: 14,
    color: '#7C7C7C',
  },
  poweredBrand: {
    fontSize: 22,
    fontWeight: '700',
    color: '#305AA6',
  },
});