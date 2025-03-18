import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [images, setImages] = useState<string[]>([]);

  // Function to select an image from the gallery
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImages([...images, uri]);
      uploadImage(uri);
    }
  };

  // Function to upload the selected image to the backend
  const uploadImage = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    try {
      const response = await axios.post('http://localhost:3000/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Imagen subida exitosamente', JSON.stringify(response.data));
      } else {
        console.error('Error al subir la imagen:', response.statusText);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  // Function to delete an image
  const deleteImage = (uri: string) => {
    setImages(images.filter(image => image !== uri));
  };

  // Function to update an image
  const updateImage = async (oldUri: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      setImages(images.map(image => image === oldUri ? newUri : image));
      uploadImage(newUri);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.title}>Cloudflare Image Uploader</Text>
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity style={styles.button} onPress={() => updateImage(uri)}>
              <Text style={styles.buttonText}>Actualizar Imagen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => deleteImage(uri)}>
              <Text style={styles.buttonText}>Borrar Imagen</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5dc",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#8b4513",
  },
  scrollView: {
    width: "100%",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#8b4513",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: "#f5f5dc",
    fontSize: 16,
    fontWeight: "bold",
  },
});