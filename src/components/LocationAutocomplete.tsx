import 'react-native-get-random-values';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../utils';

interface LocationAutocompleteProps {
  label?: string;
  placeholder?: string;
  onLocationSelect?: (location: {
    city: string;
    state: string;
    country: string;
    fullAddress: string;
  }) => void;
  containerStyle?: any;
  firstContainerStyle?: any;
}

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  placeholder = "Search for a location",
  onLocationSelect,
  containerStyle,
  firstContainerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const API_KEY = 'AIzaSyDx-5zOU35lqenxx6TCR-OkQRj6cHpi5-U';

  const searchPlaces = async (query: string) => {
    if (query.length < 2) {
      setPredictions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${API_KEY}&types=(cities)&language=en`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        setPredictions(data.predictions || []);
      } else {
        console.error('Places API error:', data.status);
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  const handlePlaceSelect = async (place: PlacePrediction) => {
    try {
      setSearchText(place.description);
      setPredictions([]);
      
      // Get place details
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${API_KEY}&fields=address_components,formatted_address`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.result) {
        const result = data.result;
        let city = '';
        let state = '';
        let country = '';
        
        if (result.address_components) {
          result.address_components.forEach((component: any) => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            } else if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (component.types.includes('country')) {
              country = component.long_name;
            }
          });
        }
        
        onLocationSelect?.({
          city,
          state,
          country,
          fullAddress: result.formatted_address || place.description,
        });
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      // Fallback with basic info
      onLocationSelect?.({
        city: '',
        state: '',
        country: '',
        fullAddress: place.description,
      });
    }
  };

  const renderPrediction = ({ item }: { item: PlacePrediction }) => (
    <TouchableOpacity
      style={styles.predictionItem}
      onPress={() => handlePlaceSelect(item)}
    >
      <Text style={styles.predictionMainText}>{item.structured_formatting.main_text}</Text>
      <Text style={styles.predictionSecondaryText}>{item.structured_formatting.secondary_text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[firstContainerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, containerStyle, isFocused && styles.focusedContainer]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray}
          value={searchText}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {predictions.length > 0 && (
          <View style={styles.predictionsContainer}>
            <FlatList
              data={predictions}
              renderItem={renderPrediction}
              keyExtractor={(item) => item.place_id}
              style={styles.predictionsList}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    minHeight: 50,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  focusedContainer: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
    color: Colors.black,
  },
  textInput: {
    fontSize: 16,
    color: Colors.black,
    paddingVertical: Platform.OS === 'android' ? 12 : 16,
    paddingHorizontal: 12,
    textAlignVertical: 'center',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
    lineHeight: Platform.OS === 'android' ? 20 : 22,
  },
  predictionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 4,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  predictionsList: {
    maxHeight: 200,
  },
  predictionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  predictionMainText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
  },
  predictionSecondaryText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
});

export default LocationAutocomplete;