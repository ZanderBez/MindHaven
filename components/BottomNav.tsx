import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export type TabKey = 'home' | 'journal' | 'chats' | 'profile';

type Props = {
  active: TabKey;
  onChange: (next: TabKey) => void;
};

export default function BottomNav({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <NavBtn
        icon="home"
        active={active === 'home'}
        onPress={() => onChange('home')}
      />
      <NavBtn
        icon="book-open"
        active={active === 'journal'}
        onPress={() => onChange('journal')}
      />
      <NavBtn
        icon="message-circle"
        active={active === 'chats'}
        onPress={() => onChange('chats')}
      />
      <NavBtn
        icon="user"
        active={active === 'profile'}
        onPress={() => onChange('profile')}
      />
    </View>
  );
}

function NavBtn({
  icon,
  active,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      {active ? <View style={styles.activeBg} /> : null}
      <Feather name={icon} size={22} color="#FFFFFF" style={{ opacity: active ? 1 : 0.75 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(180, 180, 180, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBg: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(120,160,255,0.45)',
  },
});
