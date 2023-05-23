import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const InventoryScreen = (props) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase Firestore collection
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    });

    return () => {
      // Unsubscribe from the Firestore snapshot listener
      unsubscribe();
    };
  }, []);

  const handleSellProduct = (productId) => {
    props.navigation.navigate('SellProduct', { id: productId });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      console.log('Product deleted successfully');
    } catch (error) {
      console.log('Error deleting product: ', error);
    }
  };

  const handleUpdateProduct = (productId) => {
    props.navigation.navigate('UpdateProduct', { id: productId });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Purchasing Price: {item.purchasingPrice}</Text>
      <Text>Selling Price: {item.sellingPrice}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.sellButton} onPress={() => handleSellProduct(item.id)}>
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateProduct(item.id)}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProduct(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyInventory = () => (
    <View>
      <Text>No items in inventory empty</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
        />
      ) : (
        renderEmptyInventory()
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
  productItem: {
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
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  sellButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default InventoryScreen;
