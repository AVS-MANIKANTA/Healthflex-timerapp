import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert,  TouchableOpacity,  TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import  Ionicons  from 'react-native-vector-icons/Ionicons';

interface Timer {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  status: 'Running' | 'Paused' | 'Completed';
}

const predefinedCategories = ['Workout', 'Study', 'Break', 'Other'];

const AddTimerScreen: React.FC = ({ navigation }: any) => {
  const [name, setName] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');

  const saveTimer = async () => {
    try {
      const newTimer: Timer = {
        id: Date.now().toString(),
        name,
        duration: parseInt(duration, 10),
        remainingTime: parseInt(duration, 10),
        category: category === 'Other' ? customCategory : category,
        status : 'Paused',
      };
      
      const existingTimers = await AsyncStorage.getItem('timers');
      const timers: Timer[] = existingTimers ? JSON.parse(existingTimers) : [];
      timers.push(newTimer);
      await AsyncStorage.setItem('timers', JSON.stringify(timers));
      
      Alert.alert('Success', 'Timer saved successfully');
      setName('');
      setDuration('');
      setCategory('');
      setCustomCategory('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save timer');
    }
  };

  const isButtonDisabled = !name || !duration || !category || (category === 'Other' && !customCategory);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}> 
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle" size={responsiveFontSize(4)} color="black" />
      </TouchableOpacity>
      <TextInput value={name} onChangeText={setName} placeholder='Timer Name' style={styles.input} placeholderTextColor={'gray'} />
      <View style={[styles.secondsContainer, styles.input]}>
        <TextInput value={duration} onChangeText={setDuration} keyboardType="numeric" placeholder='Duration' style={styles.secondsInput} placeholderTextColor={'gray'} />
        <Text style={styles.secText}>In Sec</Text>
      </View>
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
          dropdownIconColor={"black"}
          onFocus={() => Keyboard.dismiss()}
        >
          <Picker.Item label="Select Category" value='' color="gray" />
          {predefinedCategories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      
      {category === 'Other' && (
        <TextInput value={customCategory} onChangeText={setCustomCategory} placeholder='Enter custom category' style={styles.input} placeholderTextColor={'gray'} />
      )}
      
  
      <TouchableOpacity style={[styles.buttonContainer,  isButtonDisabled && styles.disableButton]} onPress={saveTimer} disabled={isButtonDisabled} activeOpacity={0.8}>
        <Text style={styles.buttonTextStyle}>Add Timer</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default AddTimerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFF',
    paddingVertical: responsiveHeight(5),
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(1),
  },
  input: {
    width: responsiveWidth(90),
    borderWidth: responsiveWidth(0.8),
    borderRadius: 5,
    marginBottom: responsiveHeight(2),
    padding: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
    color: '#000',
    paddingHorizontal: responsiveWidth(4),
  },
  secondsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondsInput: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    color: 'black',
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  secText: {
    fontSize: responsiveFontSize(2),
    color: '#000',
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: responsiveWidth(90),
    borderWidth: responsiveWidth(0.8),
    borderRadius: 5,
    marginBottom: responsiveHeight(2),
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  picker: {
    width: '100%',
    height: responsiveHeight(6),
    color: '#000',
  },
  buttonContainer: {
    width: responsiveWidth(90),
    position: 'absolute',
    bottom: responsiveHeight(3.5),
    alignItems: 'center',
    paddingVertical: responsiveHeight(2),
    backgroundColor: 'black',
  },
  disableButton:{
    opacity: 0.65,
  },
  buttonTextStyle: {
    fontSize: responsiveFontSize(2),
    color: '#FFF',
    fontWeight: 'bold',
  }
});
