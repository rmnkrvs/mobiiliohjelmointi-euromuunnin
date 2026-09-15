import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';

type Rates = {
  [key: string]: number;
}

export default function App() {

  const [rates, setRates] = useState<Rates>({});
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');

  const handleFetch = () => {
    fetch('https://api.apilayer.com/exchangerates_data/latest', {
      headers: {
        apikey: process.env.EXPO_PUBLIC_EXCHANGE_API_KEY
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching data: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => setRates(data.rates))
      .catch(error => console.error(error));
  };

  useEffect(() => { handleFetch(); }, []); // hae valuuttakurssit heti kun sovellus käynnistyy

  const handleConvert = () => {
    const sum = parseFloat(amount);

    if (isNaN(sum) || !rates[selectedCurrency]) {
      setResult('Invalid input or currency not found');
      return;
    }

    const euro = sum / rates[selectedCurrency];
    setResult(`${euro.toFixed(2)} €`);
  };

  const valuuttakoodit = Object.keys(rates);

  return (
    <View style={styles.container}>

      <Image source={require('./assets/euro.jpg')} style={styles.image} />

      <Text style={styles.title}>Euro Converter</Text>

      <View style={styles.rivi}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          onChangeText={text => setAmount(text)}
          value={amount}
        />

        <Picker style={styles.picker}
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {valuuttakoodit.map((koodi) => (
            <Picker.Item key={koodi} label={koodi} value={koodi} />
          ))}
        </Picker>
      </View>

      <View style={styles.button}>
        <Button title="Convert" onPress={handleConvert} />
      </View>

      <Text style={styles.result}>{result}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rivi: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  input: {
    borderWidth: 1,
    width: 100,
    height: 40,
    textDecorationLine: 'underline',
  },
  picker: {
    width: 100,
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  }
});
