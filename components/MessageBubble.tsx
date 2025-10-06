import { View, Text } from 'react-native';

export default function MessageBubble({
  role,
  content,
}: {
  role: 'user' | 'assistant';
  content: string;
}) {
  return (
    <View
      style={{
        alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: role === 'user' ? '#2a2f3b' : '#1c2030',
        padding: 12,
        borderRadius: 16,
        marginVertical: 6,
        maxWidth: '85%',
      }}
    >
      <Text style={{ color: '#e6e6f0', fontSize: 16 }}>{content}</Text>
    </View>
  );
}
