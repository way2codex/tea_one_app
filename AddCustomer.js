import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const AddCustomer = ({ navigation, route }) => {
  const api_base_url = 'https://www.teaone.online/tea_one/public/api/';
  // const api_base_url = 'https://obviously-patient-grizzly.ngrok-free.app/tea_one/public/api/';
  const store_customer_api_url = api_base_url + 'store_customer';
  const [newCustomerName, setNewCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const { onCustomerAdded } = route.params; // Extract the callback function

  const handleAddCustomer = async () => {
    try {
      setLoading(true);
      let data = new FormData();
      data.append('name', newCustomerName.toString());
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: store_customer_api_url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      };

      const response = await axios.request(config);
      if (onCustomerAdded) {
        onCustomerAdded();
      }
      Alert.alert('Customer Saved', `Customer Saved: ${newCustomerName}`, [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save customer.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'New Customer',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Customer Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={newCustomerName}
        onChangeText={(text) => setNewCustomerName(text)}
      />
      <Button title="Add Customer" onPress={handleAddCustomer} />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default AddCustomer;
