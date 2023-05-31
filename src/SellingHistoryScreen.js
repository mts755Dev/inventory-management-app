import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.js';

const SellingHistoryScreen = () => {
  const [sellingHistory, setSellingHistory] = useState([]);

  useEffect(() => {
    const fetchSellingHistory = async () => {
      try {
        // Fetch selling history data from Firestore in descending order of date
        const q = query(collection(db, 'records'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const sellingHistoryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSellingHistory(sellingHistoryData);
      } catch (error) {
        console.log('Error fetching selling history: ', error);
      }
    };

    // Subscribe to selling history updates
    const unsubscribe = onSnapshot(collection(db, 'records'), (snapshot) => {
      fetchSellingHistory();
    });

    // Fetch initial selling history data
    fetchSellingHistory();

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleDeleteEntry = async (itemId) => {
    try {
      // Delete the entry from the selling history collection in Firestore
      await deleteDoc(doc(db, 'records', itemId));
    } catch (error) {
      console.log('Error deleting entry: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selling History</Text>
      {sellingHistory.length === 0 ? (
        <Text>No selling history available</Text>
      ) : (
        <FlatList
          data={sellingHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.sellingItem}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text>Selling Price: {item.sellingPrice}</Text>
              <Text>Quantity Sold: {item.quantity}</Text>
              <Text>Total Amount: {item.totalAmount}</Text>
              <Text>Date: {item.date.toDate().toLocaleString()}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEntry(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sellingItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SellingHistoryScreen;
