import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import ProgressBar from './ProgressBar';


interface TimerCardProps {
  timer: {
    id: string;
    name: string;
    duration: number;
    remainingTime: number;
    status: 'Running' | 'Paused' | 'Completed';
  };
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onComplete: () => void;
}

const TimerCard: React.FC<TimerCardProps> = ({ timer, onStart, onPause, onReset, onComplete }) => {
  const [isModalVisible, setModalVisible] = useState(false); 
  const prevRemainingTime = useRef(timer.remainingTime);
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

const toggleModal = () => {
  setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (prevRemainingTime.current > 0 && timer.remainingTime === 0) {
      setModalVisible(true);
      onComplete();
    }
    prevRemainingTime.current = timer.remainingTime; 
  }, [timer.remainingTime]);

  return (
    <View style={styles.container}>
    <View style={styles.timerHeader}>
    <Text style={styles.name}>{timer.name}</Text>
    <View style={[styles.timerHeader, styles.statusContainer]}>
        <Ionicons name="time" size={responsiveFontSize(1.5)} color="white" />
        <Text style={styles.statusText}>{timer.status}</Text>
    </View>
    </View>
      
      <View style={styles.timerSubHeader}>
      <Text style={[styles.time, styles.remaingTimeColor]}>{formatTime(timer.remainingTime)}</Text>
      <Text style={styles.time}>{formatTime(timer.duration)}</Text>
      </View>
      
      <ProgressBar progress={timer.remainingTime / timer.duration} />
      <View style={styles.controls}>
        {timer.status!=='Completed' && (
            <>
            <TouchableOpacity onPress={onStart} >
            <Ionicons name="play" size={responsiveFontSize(3)} color={ 'green'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPause} >
            <Ionicons name="pause" size={responsiveFontSize(3)} color={'orange'} />
          </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity onPress={onReset}>
          <Ionicons name="refresh" size={responsiveFontSize(3)} color="red" />
        </TouchableOpacity>
        {timer.status==='Completed' && (
             <TouchableOpacity onPress={toggleModal} >
             <Ionicons name="checkmark-circle" size={responsiveFontSize(3)} color={'green'} />
           </TouchableOpacity>
        )}
       
      </View>

      <Modal visible={isModalVisible} onRequestClose={toggleModal} transparent={true}>
        <TouchableOpacity style={styles.modalMainContainer} activeOpacity={1} onPress={toggleModal}>
        <View style={styles.modalInnerContainer}>
          <Text style={styles.modalText}>Congratulations🎉! Timer "{timer.name}" completed!</Text>
          <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TimerCard;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    padding: responsiveWidth(4),
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
  },
  name: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
    color: 'black',
  },
  time: {
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(1),
    color: 'green',
  },
  remaingTimeColor: {
    color: 'red',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(1),
  },
  modalContent: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: responsiveWidth(80),
    height: responsiveHeight(20),
    padding: responsiveWidth(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalMainContainer:{
    flex:1,
    justifyContent:"center",
    backgroundColor:'rgba(24, 22, 27, 0.4)',
    alignItems: 'center'
  },
  modalInnerContainer:{
    width:responsiveWidth(85),
    height:responsiveHeight(30),
    backgroundColor:'white',
    alignSelf:"center",
    borderRadius:responsiveHeight(1),
    alignItems:"center",
    justifyContent:"space-evenly",
    paddingVertical:responsiveHeight(2)
  },
  modalText: {
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(2),
    color: 'black',
    fontWeight: 'bold',
    width: '90%',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'lightblue',
    width:responsiveWidth(40),
    padding: responsiveWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButtonText:{
    fontSize: responsiveFontSize(2),
    color: 'white',
    fontWeight: 'bold',
  },
  timerSubHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
   },
   timerHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   },
   statusContainer:{
    backgroundColor: 'black',
    paddingHorizontal: responsiveWidth(1.5),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: responsiveWidth(1.5)
   },
   statusText:{
    fontSize: responsiveFontSize(1.2),
    color: 'white',
    fontWeight: 'bold',
    marginLeft: responsiveWidth(1)
   }
});

