import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, PermissionsAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { useFocusEffect } from '@react-navigation/native';

interface CompletedTimer {
  id: string;
  name: string;
  duration: number;
  category: string;
  completedTime: string;
}

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<CompletedTimer[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<CompletedTimer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

 
  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const storedHistory = await AsyncStorage.getItem('history');
      if (storedHistory) {
        const parsedHistory: CompletedTimer[] = JSON.parse(storedHistory);
        parsedHistory.sort((a, b) => new Date(b.completedTime).getTime() - new Date(a.completedTime).getTime());
        setHistory(parsedHistory);
        setFilteredHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Failed to load history', error);
    }
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  )

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter(timer => timer.category === selectedCategory));
    }
  }, [selectedCategory, history]);


  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('history');
      setHistory([]);
      setFilteredHistory([]);
    } catch (error) {
      console.error('Failed to clear history', error);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 29) { 
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to export history data.',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const exportHistory = async () => {
    const hasPermission = await requestStoragePermission(); 
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to allow storage permission to export data.');
      return;
    }
  
    if (history.length === 0) {
      Alert.alert('No Data', 'There is no history to export.');
      return;
    }
  
    const fileName = `Timer_History_${new Date().toISOString().replace(/:/g, '-')}.json`;
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    const jsonData = JSON.stringify(history, null, 2);
  
    try {
      await RNFS.writeFile(filePath, jsonData, 'utf8');
      Alert.alert('Export Successful', `File saved to: Downloadis`);
    } catch (error) {
      console.error('Failed to export history', error);
      Alert.alert('Export Failed', 'Could not save the file.');
    }
  };

  const renderFilterCotainer=()=>{
    return(
        <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory} style={styles.picker} dropdownIconColor={'white'}>
          <Picker.Item label="All Categories" value="All" />
          {[...new Set(history.map(timer => timer.category))].map(category => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
    )
  }

  const renderLoaderContainer=()=>{
    return(
        <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    )
  }

  const renderFallBackUi=()=>{
    return(
        <View style={styles.noHistoryContainer}>
          <Ionicons name="clipboard-outline" size={responsiveFontSize(6)} color="gray" />
          <Text style={styles.noHistoryText}>No completed timers.</Text>
        </View>
    )
  }

  const renderHistoryList=()=>{
    return(
        <FlatList
          data={filteredHistory}
          keyExtractor={item => item.completedTime}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyName}>{item.name}</Text>
              <Text style={styles.historyTime}>Completed: {new Date(item.completedTime).toLocaleString()}</Text>
              <Text style={styles.historyCategory}>Category: {item.category}</Text>
            </View>
          )}
        />
    )
  }

  const renderFooterButtons=()=>{
    return(
        <View style={styles.footerButtonContainer}>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton} activeOpacity={0.8}>
      <Text style={styles.clearButtonText}>Clear History</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={exportHistory} style={[styles.clearButton,styles.exportButton]} activeOpacity={0.8}>
    <Text style={styles.actionButtonText}>Export JSON</Text>
  </TouchableOpacity>
    </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer History</Text>

        {renderFilterCotainer()}

      {isLoading ? (
       renderLoaderContainer()
      ) : filteredHistory.length === 0 ? (
            renderFallBackUi()
      ) : (
        renderHistoryList()
      )}

      {history.length > 0 && (
        renderFooterButtons()
         )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(5),
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginBottom: responsiveHeight(2),
  },
  picker: {
    width: '100%',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(2),
    fontWeight: 'bold',
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(10),
  },
  noHistoryText: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginTop: responsiveHeight(1),
  },
  historyItem: {
    padding: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  historyName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: 'black',
  },
  historyTime: {
    fontSize: responsiveFontSize(1.8),
    color: 'gray',
  },
  historyCategory: {
    fontSize: responsiveFontSize(1.8),
    color: 'black',
    fontStyle: 'italic',
  },
  clearButton: {
    width: responsiveWidth(40),
    borderWidth:3.5,
    borderColor:"red",
    padding: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  clearButtonText: {
    fontSize: responsiveFontSize(2),
    color: 'red',
    fontWeight: 'bold',
  },
  exportButton: {
    borderColor: 'green'
  },
  actionButtonText: {
    fontSize: responsiveFontSize(2),
    color: 'green',
    fontWeight: 'bold',
  },
  actionButton: {
    flex: 1,
    padding: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
    marginHorizontal: responsiveWidth(2),
  },
  footerButtonContainer:{
    width: responsiveWidth(90),
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginTop:responsiveHeight(1)
  },
});
