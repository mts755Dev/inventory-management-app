import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { collection, doc, addDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

const SellProductScreen = ({ route, navigation }) => {
  const productId = route.params.id;
  const [product, setProduct] = useState(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantityToSell, setQuantityToSell] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch product data from Firebase
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          displayError('Product not found');
        }
      } catch (error) {
        displayError('Error fetching product');
      }
    };

    fetchProduct();
  }, [productId]);

  const displayError = (message) => {
    setError(message);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSellProduct = async () => {
    if (!sellingPrice || !quantityToSell) {
      displayError('Please fill in all fields');
      return;
    }

    const sellingPriceValue = parseFloat(sellingPrice);
    const quantityToSellValue = parseInt(quantityToSell);

    if (sellingPriceValue <= 0 || quantityToSellValue <= 0) {
      displayError('Selling price and quantity must be greater than zero');
      return;
    }

    if (quantityToSellValue > product.quantity) {
      displayError('Quantity to sell exceeds the available quantity');
      return;
    }

    try {
      const updatedQuantity = product.quantity - quantityToSellValue;
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        quantity: updatedQuantity,
      });

      const sellingHistoryRef = collection(db, 'records');
      await addDoc(sellingHistoryRef, {
        date: serverTimestamp(),
        name: product.name,
        purchasingPrice: product.purchasingPrice,
        sellingPrice: sellingPriceValue,
        quantity: quantityToSellValue,
        totalAmount: sellingPriceValue * quantityToSellValue,
      });

      setSellingPrice('');
      setQuantityToSell('');
      navigation.goBack();
    } catch (error) {
      displayError('Error selling product');
    }
  };


  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell Product</Text>
      {/* <Text>Product ID: {productId}</Text> */}
      <Text>Product Name: {product.name}</Text>
      <Text>Current Quantity:{product.quantity} </Text>
      <Text>Purchasing Price:{product.purchasingPrice} </Text>
      <Text>Selling Price:{product.sellingPrice} </Text>
      <TextInput
        style={styles.input}
        placeholder="Selling Price"
        value={sellingPrice}
        onChangeText={setSellingPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity to Sell"
        value={quantityToSell}
        onChangeText={setQuantityToSell}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.sellButton} onPress={handleSellProduct}>
        <Text style={styles.sellButtonText}>Sell</Text>
      </TouchableOpacity>

      {/* Error Modal */}
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
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalErrorText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
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
  }
});

export default SellProductScreen;
