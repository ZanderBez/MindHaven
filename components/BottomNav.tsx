import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

type TabKey = 'home' | 'journal' | 'profile'

type Props = {
  active: TabKey
  onChange: (next: TabKey) => void
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bar}
      >
        <NavItem
          icon="home"
          isActive={active === 'home'}
          onPress={() => onChange('home')}
        />
        <NavItem
          icon="book-open"
          isActive={active === 'journal'}
          onPress={() => onChange('journal')}
        />
        <NavItem
          icon="user"
          isActive={active === 'profile'}
          onPress={() => onChange('profile')}
        />
      </LinearGradient>
    </View>
  )
}

function NavItem({
  icon,
  isActive,
  onPress
}: {
  icon: React.ComponentProps<typeof Feather>['name']
  isActive: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={styles.iconWrap}>
        {isActive && <View style={styles.activeBg} />}
        <Feather
          name={icon}
          size={22}
          color={isActive ? '#FFFFFF' : 'rgba(200,220,255,0.9)'}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(200,220,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginBottom: 10
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeBg: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(120,160,255,0.45)'
  }
})
