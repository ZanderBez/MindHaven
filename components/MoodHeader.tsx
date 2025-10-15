import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'

type Props = {
  onPressStart: () => void
}

export default function MoodHeader({ onPressStart }: Props) {
  return (
    <LinearGradient
      colors={['rgba(129,199,245,0.55)', 'rgba(129,118,245,0.55)', 'rgba(118,45,165,0.55)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>Today mood</Text>
        <Feather name="chevron-down" size={18} color="#FFF" />
      </View>

      <Text style={styles.date}>Aug 6 2025</Text>

      <View style={styles.weekRow}>
        <View style={styles.dayCol}>
          <Text style={styles.dayLabel}>Sun</Text>
          <View style={styles.moodDotFilled} />
          <Text style={styles.dayNum}>6</Text>
        </View>
        <View style={styles.dayCol}>
          <Text style={styles.dayLabel}>Mon</Text>
          <View style={styles.moodDot} />
          <Text style={styles.dayNum}>7</Text>
        </View>
        <View style={styles.dayCol}>
          <Text style={styles.dayLabel}>Tue</Text>
          <View style={styles.moodDot} />
          <Text style={styles.dayNum}>8</Text>
        </View>
        <View style={styles.dayCol}>
          <Text style={styles.dayLabel}>Wed</Text>
          <View style={styles.moodDot} />
          <Text style={styles.dayNum}>9</Text>
        </View>
        <View style={styles.dayCol}>
          <Text style={styles.dayLabel}>Thu</Text>
          <View style={styles.moodDot} />
          <Text style={styles.dayNum}>10</Text>
        </View>
        <View style={styles.dayCol}>
          <Text style={styles.dayLabel}>Fri</Text>
          <View style={styles.moodDot} />
          <Text style={styles.dayNum}>11</Text>
        </View>
        <View style={styles.dayCol}>
          <Text style={styles.dayLabel}>Sat</Text>
          <View style={styles.moodDot} />
          <Text style={styles.dayNum}>12</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onPressStart} style={styles.cta}>
        <Text style={styles.ctaText}>Start chatting</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF'
  },
  date: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 8,
    color: '#FFF'
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  dayCol: {
    alignItems: 'center',
    width: 36
  },
  dayLabel: {
    fontSize: 11,
    opacity: 0.95,
    color: '#FFF'
  },
  moodDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(200,230,255,0.9)',
    marginVertical: 4
  },
  moodDotFilled: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(253,213,60,1)',
    marginVertical: 4
  },
  dayNum: {
    fontSize: 12,
    color: '#FFF'
  },
  cta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.28)',
    marginBottom: 6
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF'
  }
})
