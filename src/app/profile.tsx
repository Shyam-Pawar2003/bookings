import { ScrollView, StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { ShareCard } from '@/components/ShareCard';
import { SmallCard } from '@/components/SmallCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const trips = [
  {
    title: 'Weekend in Lisbon',
    meta: '3 nights · Saved · 2 guests',
    price: '$420',
    accentColor: '#FFE7D1',
  },
  {
    title: 'Mountain cabin',
    meta: 'Flexible dates · Shared list',
    price: '$260',
    accentColor: '#DFF4E6',
  },
];

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Profile"
          subtitle="Manage saved places, planned trips, and invites from one place."
          initials="JR"
        />

        <ThemedView type="backgroundElement" style={styles.summaryCard}>
          <ThemedText type="small" themeColor="textSecondary">
            Travel score
          </ThemedText>
          <ThemedText type="subtitle">92%</ThemedText>
          <ThemedText themeColor="textSecondary">
            You have 4 saved destinations, 2 shared boards, and 1 trip ready to book.
          </ThemedText>
        </ThemedView>

        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold">Saved trips</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Everything you want to come back to
          </ThemedText>
        </View>

        {trips.map((trip) => (
          <SmallCard key={trip.title} {...trip} />
        ))}

        <ShareCard
          title="Share your list"
          description="Invite friends to a board and split the planning before you split the bill."
          buttonLabel="Invite people"
        />
      </ScrollView>

      <BottomNav />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: Spacing.four,
    paddingBottom: 132,
    gap: Spacing.four,
  },
  summaryCard: {
    borderRadius: 28,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  sectionHeader: {
    gap: Spacing.one,
  },
});