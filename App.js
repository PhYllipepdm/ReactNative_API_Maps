import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização negada');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        ...region,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = '98b9f478'; // Substitua pelo seu próprio API Key
      const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>
        Busca de Filmes
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Buscar Filme" onPress={handleSearch} />
      {movieData && (
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{movieData.Title}</Text>
          <Text>Ano: {movieData.Year}</Text>
          <Text>Gênero: {movieData.Genre}</Text>
          <Text>Diretor: {movieData.Director}</Text>
          <Text>Prêmios: {movieData.Awards}</Text>
        </View>
      )}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onRegionChangeComplete={setRegion}
      >
        {location && (
          <Marker
            coordinate={location}
            title="Você está aqui"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    margin: 10,
    padding: 8,
  },
  movieInfo: {
    margin: 20,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    height: 100,  
    margin: 20,
  },
});

export default App;
