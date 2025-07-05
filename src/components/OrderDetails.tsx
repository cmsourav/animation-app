import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const OrderDetails = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order Details</Text>

      <View style={{ marginTop: 25 }}>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Bonsai Plant</Text>
          <Text style={styles.value}>$38.99</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Plant Fertilizer</Text>
          <Text style={styles.value}>$18.99</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Plant Soil</Text>
          <Text style={styles.value}>$38.99</Text>
        </View>
      </View>

      <View style={{borderBottomWidth: .5, borderColor: '#D4C9BE'}} />

      <View style={{ width: 200, alignSelf: 'flex-end', marginTop: 24 }}>
        <View style={styles.keyValueContainer}>
          <Text style={{color: '#2C2C2C'}}>SubTotal</Text>
          <Text style={{color: '#2C2C2C'}}>$12.05</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={{color: '#2C2C2C'}}>discount price</Text>
          <Text style={{color: '#2C2C2C'}}>$2.05</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={{color: '#2C2C2C'}}>Tax</Text>
          <Text style={{color: '#2C2C2C'}}>$2</Text>
        </View>

        <View style={{borderBottomWidth: .5, borderColor: '#D4C9BE'}} />

        <View style={[styles.keyValueContainer, {marginTop: 12}]}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>Total</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>$90.60</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    width: 350,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    padding: 25,
    borderRadius: 6,
  },
  heading: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000'
  },
  keyValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginRight: 10,
  },
  key: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },
});
