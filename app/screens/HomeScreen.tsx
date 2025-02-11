import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TimerCard from '../components/TimerCard';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useFocusEffect } from '@react-navigation/native';

interface Timer {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  status: 'Running' | 'Paused' | 'Completed';
}

const HomeScreen: React.FC = ({ navigation }: any) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const isFetching = useRef(true); 
  const [isLoading, setIsLoading]=useState(false);

 
  const fetchTimers = async () => {
    try {
      setIsLoading(true);
      const storedTimers = await AsyncStorage.getItem('timers');
      if (storedTimers) {
        setTimers(JSON.parse(storedTimers));
      }
    } catch (error) {
      console.error('Failed to load timers', error);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  };

 
  useFocusEffect(
    useCallback(() => {
      fetchTimers();
    }, [])
  );

  
  useEffect(() => {
    fetchTimers();
  }, []);


  useEffect(() => {
    if (isFetching.current) return; 
  
    const activeTimers = timers.filter(timer => timer.status === 'Running');
    if (activeTimers.length === 0) return;
  
    const interval = setInterval(() => {
      setTimers(prevTimers =>
        prevTimers.map(timer => {
          if (timer.status === 'Running' && timer.remainingTime > 0) {
            return { ...timer, remainingTime: timer.remainingTime - 1 };
          }
          if (timer.status === 'Running' && timer.remainingTime === 0) {
            return { ...timer, status: 'Completed' };
          }
          return timer;
        })
      );
    }, 1000);
  
    return () => clearInterval(interval);
  }, [timers.some(timer => timer.status === 'Running')]);
  

  useEffect(() => {
    const saveTimers = async () => {
      try {
        if (!isFetching.current && timers.length > 0) {
          await AsyncStorage.setItem('timers', JSON.stringify(timers));
        }
      } catch (error) {
        console.error('Failed to save timers', error);
      }
    };
    saveTimers();
  }, [timers]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const updateTimerStatus = (id: string, status: 'Running' | 'Paused' | 'Completed', reset = false) => {
    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.id === id ? { ...timer, status, remainingTime: reset ? timer.duration : timer.remainingTime } : timer
      )
    );
  };

const bulkAction = (category: string, action: 'Start' | 'Pause' | 'Reset') => {
  setTimers(prevTimers =>
    prevTimers.map(timer => {
      if (timer.category === category) {
        if (action === 'Start') return { ...timer, status: timer.status === 'Paused' ? 'Running' : timer.status };
        if (action === 'Pause') return { ...timer, status: timer.status === 'Running' ? 'Paused' : timer.status };
        if (action === 'Reset') return { ...timer, status: 'Paused', remainingTime: timer.duration };
      }
      return timer;
    })
  );
};


    const onTimerComplete =async (id: string) => {
      updateTimerStatus(id, 'Completed');

      const completedTimer = timers.find(timer => timer.id === id);
  if (completedTimer) {
    const completedTime = new Date().toISOString(); 

    try {
      const existingHistory = await AsyncStorage.getItem('history');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.push({ ...completedTimer, completedTime }); 
      await AsyncStorage.setItem('history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  }
    };

  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) {
      acc[timer.category] = [];
    }
    acc[timer.category].push(timer);
    return acc;
  }, {} as { [key: string]: Timer[] });


  const renderAddTimerButton=()=>{
    return (
      <TouchableOpacity onPress={() => navigation.navigate('AddTimer')} activeOpacity={1} style={styles.addTimerButton}>
       
       <Ionicons name="time" size={responsiveFontSize(3.2)} color="black" style={styles.addTimerButtonIconContainer} />
        <Text style={styles.addTimerButtonText} >
            Add Timer
          </Text>
      </TouchableOpacity>
    )
  }

  const renderLoadder=()=>{
    return(
      <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="black" />
      <Text style={styles.loadingText}>Loading timers...</Text>
    </View>
    )
  }

  const renderFallBackUi=()=>{
    return(
      <View style={styles.noTimersContainer}>
      <Ionicons name="timer-outline" size={responsiveFontSize(6)} color="gray" />
      <Text style={styles.noTimersText}>No timers available.</Text>
      <Text style={styles.suggestionText}>Tap "Add Timer" to create one.</Text>
    </View>
    )
  }

  const renderGropedCategories=()=>{
    return(
      Object.keys(groupedTimers).map(category => (
        <View key={category} style={styles.categoryContainer}>
          <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <Ionicons name={expandedCategories[category] ? 'chevron-up' : 'chevron-down'} size={responsiveFontSize(2.5)} color="black" />
          </TouchableOpacity>

          {expandedCategories[category] && (
            <>
           {renderBulkActionContianer(category)}
            <FlatList
            scrollEnabled={false}
              data={groupedTimers[category]}
              keyExtractor={item => item.id} 
              extraData={timers}
              renderItem={({ item }) => (
                <TimerCard
                  key={item.id} 
                  timer={item}
                  onStart={() => updateTimerStatus(item.id, 'Running')}
                  onPause={() => updateTimerStatus(item.id, 'Paused')}
                  onReset={() => updateTimerStatus(item.id, 'Paused', true)}
                  onComplete={() => onTimerComplete(item.id)}
                />
              )}
            />
            </>
          )}
        </View>
      ))

    )
  }

  const renderBulkActionContianer=(category: string)=>{
    return(
      <View style={styles.bulkActions}>
      <TouchableOpacity onPress={() => bulkAction(category, 'Start')}>
        <Ionicons name="play" size={responsiveFontSize(2.5)} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => bulkAction(category, 'Pause')}>
        <Ionicons name="pause" size={responsiveFontSize(2.5)} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => bulkAction(category, 'Reset')}>
        <Ionicons name="refresh" size={responsiveFontSize(2.5)} color="white" />
      </TouchableOpacity>
    </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderAddTimerButton()}
      {isLoading ? (
       renderLoadder()
      ):(
  
      <ScrollView>
      {Object.keys(groupedTimers).length === 0 ? (
       renderFallBackUi()
      ) : (
        renderGropedCategories()
      )}
      </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(5),
    paddingBottom: 0
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
  noTimersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(20),
  },
  suggestionText: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    marginTop: responsiveHeight(1),
    fontWeight: 'bold',
  },
  noTimersText: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: responsiveHeight(2),
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: responsiveWidth(4),
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: responsiveHeight(1),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: 'black',
  },
  bulkActions: {
    width: '60%',
    backgroundColor: 'black',
    borderBottomLeftRadius: responsiveWidth(3),
    borderBottomRightRadius: responsiveWidth(3),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
  },
  addTimerButton:{
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    borderRadius: responsiveWidth(3.5),
    width: responsiveWidth(50),
    alignSelf: 'center',
  },
  addTimerButtonIconContainer:{
    width: responsiveWidth(10),
    height: responsiveHeight(5),
    backgroundColor: 'white',
    padding: responsiveWidth(2),
    borderRadius: responsiveWidth(3.5),
    alignItems: 'center',
  },
  addTimerButtonText:{
    color: 'white',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
  }
});
