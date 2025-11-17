import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { customMapStyle } from './_MapStyles';

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 7.0731,
    longitude: 125.6128,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    requestLocationPermission();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // Request location permissions and start tracking
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show your position on the map.');
        return;
      }
      startLocationTracking();
    } catch (err) {
      console.error('Error requesting location permission:', err);
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  // Start continuous location tracking
  const startLocationTracking = async () => {
    try {
      // Get initial position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const newLocation = { latitude, longitude };
      setCurrentLocation(newLocation);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Watch position for real-time tracking
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 5000, // Update every 5 seconds
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const newLocation = { latitude, longitude };
          setCurrentLocation(newLocation);
        }
      );
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location. Make sure GPS is enabled.');
    }
  };

  // Center map on user's location
  const centerOnUser = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...currentLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  // Zoom in
  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...region,
          latitudeDelta: region.latitudeDelta / 2,
          longitudeDelta: region.longitudeDelta / 2,
        },
        500
      );
    }
  };

  // Zoom out
  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...region,
          latitudeDelta: region.latitudeDelta * 2,
          longitudeDelta: region.longitudeDelta * 2,
        },
        500
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {/* Current location marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description="You are here"
            pinColor="blue"
          />
        )}
      </MapView>

      {/* Map controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
          <Text style={styles.controlButtonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnUser}>
          <Text style={styles.controlButtonText}>📍</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: 'transparent',
  },
  controlButton: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MapScreen;