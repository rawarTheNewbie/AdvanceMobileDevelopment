import { Image } from 'expo-image';
import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

  export default function ComponentShowcase() {
    const [count, setCount] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [submittedName, setSubmittedName] = useState<string>("");

    const handleIncrement = () => setCount((c) => c + 1);
    const handleDecrement = () => setCount((c) => c - 1);
    const handleAlert = () => Alert.alert("Hello 👋", "You're an Anime fan");

    const handleSubmit = () => {
      const trimmed = name.trim();
      if (!trimmed) {
        Alert.alert("Oops", "Please enter your name first.");
        return;
      }
      setSubmittedName(trimmed);
      Alert.alert("Greeting", `Hello ${trimmed} 👋`);
    };

    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/image1.png')}
            style={styles.reactLogo}
          />
        }>

        <ThemedView style={styles.titleMain}>
          <ThemedText type="title" >Anime Fandom</ThemedText>
        </ThemedView>

        <ThemedView style={styles.showcaseButtons}>
          <View style={styles.buttonRow}>
            <Button title="Increase Counter" onPress={handleIncrement} />
            <Button title="Decrease Counter" onPress={handleDecrement} />
          </View>

          <Text style={styles.counter}>Count: {count}</Text>

          <Button title="Show Alert" onPress={handleAlert} />

          <ThemedView style={styles.inputCard}>
            <ThemedText type="defaultSemiBold" style={styles.blackText}>
              Your name
            </ThemedText>

          <TextInput
            style={[styles.input, styles.blackText]}
            placeholder="Type your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="done"
            placeholderTextColor="#9aa0a6"
            accessibilityLabel="Name input field"
          />

            <View style={{ marginTop: 8 }}>
              <Button title="Submit" onPress={handleSubmit} />
            </View>

          </ThemedView>

          <ThemedView style={styles.imageSection}>
            <ThemedText type="defaultSemiBold">
              Top Animes
            </ThemedText>

            {/* Full-width banner */}
            <Image
              source={require('@/assets/images/image2.png')}  // reuse your local image
              style={styles.imageBanner}
              contentFit="cover"
              accessibilityLabel="Banner image"
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageRow}
            >
              <Image
                source={require('@/assets/images/image3.png')}
                style={styles.thumb}
                contentFit="cover"
                accessibilityLabel="Local image thumb"
              />
              <Image
                source={require('@/assets/images/image4.jpg')}
                style={styles.thumb}
                contentFit="contain"
                accessibilityLabel="React Native logo thumb"
              />
              <Image
                source={require('@/assets/images/image5.jpg')}
                style={styles.thumb}
                contentFit="cover"
                accessibilityLabel="Random example image thumb"
              />
            </ScrollView>
          </ThemedView>
        </ThemedView>

      </ParallaxScrollView>
    );
  }

  const styles = StyleSheet.create({
    titleMain: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',   
      alignItems: "center",   
      justifyContent: "center", 
      marginTop: 20,      
    },

    counter: {
      fontSize: 20,
      margin: 20,
      color: 'white',
    },

    reactLogo: {
      height: '100%',
      width: '100%',
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    
    showcaseButtons: {
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16,
      gap: 12,
    },

    buttonRow: {
      borderRadius: 10,
      textAlign: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
      gap: 8,
    },

    inputCard: {
      marginTop: 20,
      width: '100%',
      backgroundColor: '#f8f9fb',
      borderRadius: 12,
      padding: 12,
      gap: 8,
    },

    input: {
      borderWidth: 1,
      borderColor: '#d0d5dd',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    
    greeting: {
      marginTop: 6,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',  
    },
    
    blackText: { color: '#000' },

    imageSection: {
      width: '100%',
      height: 'auto',
      gap: 10,
      margin: 20,
    },

    imageBanner: {
      width: '100%',
      aspectRatio: 16 / 9,
      borderRadius: 12,
    },
    
    imageRow: {
      gap: 10,
      paddingVertical: 6,
    },

    thumb: {
      width: 120,
      height: 80,
      borderRadius: 10,
    },
  });
