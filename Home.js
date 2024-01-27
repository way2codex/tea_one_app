// Home.js
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Home = ({ navigation }) => {
    const api_base_url = 'https://www.teaone.online/tea_one/public/api/';
    const customer_list_api_url = api_base_url + 'customer_list';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: null, // Remove title and space
            headerShown: false, // Hide the header completely
        });
    }, [navigation]);
    const fetchData = async () => {
        try {
            const response = await axios.get(customer_list_api_url);
            setData(response.data);
            setSearchData(response.data); // Initialize searchData with the full data
        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false); // Set loading to false when the data is fetched, regardless of success or error
        }
    };

    const handleItemPress = (id, name) => {
        // Navigate to the Detail screen with the selected item's id
        setSearchText('');
        setSearchData(data);
        navigation.navigate('Detail', { id, name });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item.id, item.name)}
            style={styles.itemContainer}>
            <View>
                <Text style={styles.itemText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleSearch = (text) => {
        setSearchText(text);
        const filteredData = data.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
        setSearchData(filteredData);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <><ActivityIndicator size="large" color="#0000ff" /></>
            ) : (
                <>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                    <FlatList
                        data={searchData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 1,
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default Home;
