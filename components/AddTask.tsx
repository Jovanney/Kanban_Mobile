import React, { useEffect, useState } from 'react';
import { Button, TextInput, Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    columnId: string;
}

interface Task {
    id: string;
    title: string;
    columnId: string;
    position: number;
}

const AddTask: React.FC<Props> = ({ columnId }) => {
    const [title, setTitle] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await AsyncStorage.getItem('tasks');
                const parsedTasks: Task[] = tasks ? JSON.parse(tasks) : [];
                setTasks(parsedTasks);
            } catch (error) {
                console.log(error);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        console.log(tasks);
    }, [tasks]);

    const handleAddTask = async () => {
        const newTask: Task = {
            id: uuidv4(),
            title,
            columnId,
            position: tasks.length,
        };
        try {
            const tasks = await AsyncStorage.getItem('tasks');
            const parsedTasks: Task[] = tasks ? JSON.parse(tasks) : [];
            await AsyncStorage.setItem(
                'tasks',
                JSON.stringify([...parsedTasks, newTask])
            );
            setTitle('');
            setModalVisible(false);
            setTasks([...parsedTasks, newTask]);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            placeholder="Tap Here To Add Your Task"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.titleInput}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Save" onPress={handleAddTask}/>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#2196F3',
        borderRadius: 40,
        padding: 10,
        elevation: 2,
        alignItems: 'center',
        width: 80,
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        justifyContent: 'space-between',
        width: '50%',
        height: '30%',
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      titleInput:{
          fontSize : 20,
          fontWeight : "bold",
          alignContent: 'center',
          justifyContent: 'center',
          paddingTop : 20,
      },
      buttonContainer:{
          flexDirection : "row",
          justifyContent : "space-between",
          width : "90%",
          padding : 10,
      }
});


export default AddTask;
