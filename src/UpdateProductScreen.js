import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const UpdateProductScreen = ({ route, navigation }) => {
  const id = route.params.id;
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasingPrice, setPurchasingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productRef = doc(db, 'products', id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const data = productDoc.data();
          setProduct(data);
          setName(data.name);
          setQuantity(data.quantity.toString());
          setPurchasingPrice(data.purchasingPrice.toString());
          setSellingPrice(data.sellingPrice.toString());
        } else {
          console.log('Product not found');
        }
      } catch (error) {
        console.log('Error fetching product: ', error);
      }
    };

    getProduct();
  }, [id]);

  const handleUpdateProduct = async () => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        name: name,
        quantity: parseInt(quantity),
        purchasingPrice: parseFloat(purchasingPrice),
        sellingPrice: parseFloat(sellingPrice),
      });
      console.log('Product updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error updating product: ', error);
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
      <Text style={styles.title}>Update Product</Text>
      <Text>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Text>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={(text) => setQuantity(text)}
        keyboardType="numeric"
      />
      <Text>Purchasing Price</Text>
      <TextInput
        style={styles.input}
        value={purchasingPrice}
        onChangeText={(text) => setPurchasingPrice(text)}
        keyboardType="numeric"
      />
      <Text>Selling Price</Text>
      <TextInput
        style={styles.input}
        value={sellingPrice}
        onChangeText={(text) => setSellingPrice(text)}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProduct}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default UpdateProductScreen;
