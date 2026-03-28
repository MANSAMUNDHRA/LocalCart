import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, Modal,
  Pressable, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrdersContext';

interface RatingScreenProps {
  visible: boolean;
  orderId: string;
  vendorName: string;
  onClose: () => void;
}

export default function RatingModal({
  visible, orderId, vendorName, onClose,
}: RatingScreenProps) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const { rateOrder } = useOrders();

  const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent!'];
  const active = hovered || selected;

  const submit = () => {
    if (!selected) return;
    rateOrder(orderId, selected);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 }}
          onPress={() => {}}
        >
          {/* Pill */}
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 }} />

          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F1F1F', textAlign: 'center' }}>
            Rate Your Order
          </Text>
          <Text style={{ fontSize: 13, color: '#6B6B6B', textAlign: 'center', marginTop: 4 }}>
            How was your experience with {vendorName}?
          </Text>

          {/* Stars */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 12 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => {
                  setSelected(star);
                  setHovered(0);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= active ? 'star' : 'star-outline'}
                  size={44}
                  color={star <= active ? '#F59E0B' : '#D1D5DB'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {active > 0 && (
            <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '600', color: '#F59E0B', marginTop: 8 }}>
              {labels[active]}
            </Text>
          )}

          {/* Comment */}
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Add a comment (optional)"
            placeholderTextColor="#9CA3AF"
            multiline
            style={{
              backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14,
              marginTop: 16, fontSize: 14, color: '#1F1F1F', minHeight: 70,
            }}
            textAlignVertical="top"
          />

          {/* Submit */}
          <TouchableOpacity
            onPress={submit}
            disabled={!selected}
            activeOpacity={0.85}
            style={{
              marginTop: 20, paddingVertical: 16, borderRadius: 14,
              alignItems: 'center',
              backgroundColor: selected ? '#FF7A30' : '#E5E7EB',
            }}
          >
            <Text style={{ color: selected ? '#fff' : '#9CA3AF', fontWeight: '700', fontSize: 15 }}>
              Submit Rating
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
