// Detail.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const Detail = ({ route, navigation }) => {
    const { id, name } = route.params;
    const api_base_url = 'https://www.teaone.online/tea_one/public/api/';
    const store_entry_api_url = api_base_url + 'store_entry';
    const entry_report_api_url = api_base_url + 'entry_report';
    const [loading, setLoading] = useState(false);
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: name,
        });
    }, [navigation, name]);

    const [quantity, setQuantity] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    const handleQuantityChange = (text) => {
        setQuantity(text);
    };

    const handleSaveQuantity = async () => {
        if (!quantity.trim()) {
            Alert.alert('Error', 'Quantity is required.', [{ text: 'OK' }]);
        } else {
            try {
                setLoading(true);
                // Create a FormData object and append the required data
                let data = new FormData();
                data.append('customer_id', id.toString());
                data.append('quantity', quantity);

                // Configure the Axios request
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: store_entry_api_url,
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
                    },
                    data: data
                };

                // Make the Axios request
                const response = await axios.request(config);

                // Display a success message or handle the response as needed
                Alert.alert('Quantity Saved', `Quantity Updated: ${quantity}`, [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);

                // Navigate back to the Home screen
                navigation.navigate('Home');
            } catch (error) {
                // Display an error message or handle the error as needed
                Alert.alert('Error', 'Failed to save quantity.', [{ text: 'OK' }]);
            } finally {
                setLoading(false); // Set loading to false when the asynchronous operation is completed
            }
        }
    };


    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handlePdfShow = async () => {
        try {
            setLoading(true);
            // Create a FormData instance
            const formData = new FormData();
            formData.append('customer_id', id.toString());
            formData.append('from_date', formatDate(fromDate));
            formData.append('to_date', formatDate(toDate));
            const config = {
                method: 'post',
                url: entry_report_api_url,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = await axios.request(config);
            if (response.data.status == "true") {
                const pdfUrl = response.data.pdf_url;
                Linking.openURL(pdfUrl);
            } else if (response.data.status == "empty") {
                Alert.alert('Empty', `No Data Found`, [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
            }
        } catch (error) {
            console.log('Error fetching PDF:', error.message);
            Alert.alert('Error', 'Failed to fetch PDF.', [{ text: 'OK' }]);
        } finally {
            setLoading(false); // Set loading to false when the asynchronous operation is completed
        }
    };
    const handleFromDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || fromDate;
        setShowFromDatePicker(false);
        setFromDate(currentDate);
    };

    const handleToDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || toDate;
        setShowToDatePicker(false);
        setToDate(currentDate);
    };

    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <Text style={styles.label}>ID:</Text>
                <Text style={styles.value}>{id}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{name}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Enter Quantity:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Quantity"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={handleQuantityChange}
                />
            </View>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <View style={[styles.row, { justifyContent: 'center' }]}>
                    <Button title="Save Quantity" onPress={handleSaveQuantity} />
                </View>
            )}
            <View style={styles.row}>
                <Text style={styles.label}>From Date:</Text>
                <TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
                    <Text>{fromDate.toISOString().split('T')[0]}</Text>
                </TouchableOpacity>
                {showFromDatePicker && (
                    <DateTimePicker
                        value={fromDate}
                        mode="date"
                        display="default"
                        onChange={handleFromDateChange}
                    />
                )}
            </View>

            {/* To Date Row */}
            <View style={styles.row}>
                <Text style={styles.label}>To Date:</Text>
                <TouchableOpacity onPress={() => setShowToDatePicker(true)}>
                    <Text>{toDate.toISOString().split('T')[0]}</Text>
                </TouchableOpacity>
                {showToDatePicker && (
                    <DateTimePicker
                        value={toDate}
                        mode="date"
                        display="default"
                        onChange={handleToDateChange}
                    />
                )}
            </View>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <View style={[styles.row, { justifyContent: 'center' }]}>
                    <Button color="" title="Download PDF" onPress={handlePdfShow} />
                </View>
            )}
            {/* {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        paddingBottom: 10,
    },
    label: {
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        flex: 1,
        marginLeft: 10,
        paddingHorizontal: 10,
    },
});

export default Detail;
