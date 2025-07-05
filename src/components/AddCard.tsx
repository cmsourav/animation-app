import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

type AddCardProps = {
  onPress?: () => void;
};

const AddCard = ({ onPress }: AddCardProps) => {
  return (
    <TouchableOpacity style={styles.addCardContainer} onPress={onPress}>
      <View style={styles.iconCircle}>
        <Icon name="plus" size={28} color="#E6521F" />
      </View>
      <Text style={styles.addCardText}>Add Card</Text>
    </TouchableOpacity>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  addCardContainer: {
    width: 350,
    height: 215,
    backgroundColor: '#FFF',
    marginTop: 30,
    elevation: 3,
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E6521F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6521F',
  },
  addCardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E6521F',
  },
});
