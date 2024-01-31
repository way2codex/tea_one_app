import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';

const Home = ({ navigation }) => {
  const api_base_url = 'https://www.teaone.online/tea_one/public/api/';
  const customer_list_api_url = api_base_url + 'customer_list';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isEmpty, setisEmpty] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: null,
      headerShown: false,
    });
  }, [navigation]);
  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      setisEmpty(false);
      const response = await axios.get(customer_list_api_url);
      setData(response.data);
      setSearchData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleItemPress = (id, name) => {
    setSearchText('');
    setSearchData(data);
    navigation.navigate('Detail', { id, name });
  };
  const handleAddCustomer = () => {
    navigation.navigate('AddCustomer', { onCustomerAdded: fetchData });
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
    if (filteredData.length > 0) {
      setisEmpty(false);
      setSearchData(filteredData);
    } else {
      setSearchData([]);
      setisEmpty(true);
    }
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
          {
            isEmpty ? (
              <>
                <TouchableOpacity style={styles.itemContainer}>
                  <View>
                    <Text style={styles.itemText}>Data Not Found.</Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <></>
            )
          }
          <FlatList
            data={searchData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
            }
          />
          <TouchableOpacity style={styles.floatingButton} onPress={handleAddCustomer}>
            <Text style={styles.floatingButtonText}>Add Customer</Text>
          </TouchableOpacity>
        </>
      )
      }
    </View >
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 1,
    paddingBottom: 45, // Adjust this value as needed
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

  floatingButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default Home;