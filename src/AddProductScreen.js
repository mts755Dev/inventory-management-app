import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasingPrice, setPurchasingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleAddProduct = async () => {
    if (!name || !quantity || !purchasingPrice) {
      setError('Please fill in all fields.');
      setShowModal(true);
    } else {
      try {
        // Add a new product to Firebase Firestore
        await addDoc(collection(db, 'products'), {
          date: serverTimestamp(),
          name: name,
          quantity: parseInt(quantity),
          purchasingPrice: parseFloat(purchasingPrice),
          sellingPrice: parseFloat(sellingPrice),
        });
        console.log('Product added successfully');
        setName('');
        setQuantity('');
        setPurchasingPrice('');
        setSellingPrice('');

        // Navigate to the "Inventory" screen
        navigation.navigate('Inventory');
      } catch (error) {
        console.log('Error adding product: ', error);
        setError('Error adding product. Please try again.');
        setShowModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Purchasing Price"
        value={purchasingPrice}
        onChangeText={setPurchasingPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Selling Price"
        value={sellingPrice}
        onChangeText={setSellingPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.sellButton} onPress={() => handleAddProduct()}>
        <Text style={styles.sellButtonText}>Add</Text>
      </TouchableOpacity>
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalErrorText}>{error}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sellButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  sellButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalErrorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default AddProductScreen;
