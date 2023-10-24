import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import AddTask from './AddTask';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

interface Task {
  id: string;
  title: string;
  columnId: string;
  position: number;
}

export default function Basic() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>('');

  const handleColumnSelect = (column: string) => {
    setSelectedColumn(column);
  };

  const addNewTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTaskPosition = async (taskId: string, newPosition: number) => {
    try {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, position: newPosition };
          }
          return task;
        });
      });

      // Update the task position in AsyncStorage
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].position = newPosition;
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveTask = () => {
    if (editingTask && selectedColumn) {
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex((task) => task.id === editingTask.id);
      
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...editingTask,
          columnId: selectedColumn,
          position: getColumnTasks(selectedColumn).length,
        };

        setTasks(updatedTasks);

        // Save the updated tasks in AsyncStorage
        AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks))
          .then(() => {
            closeModal();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

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

  const columns = ['to do', 'in progress', 'done'];

  const getColumnTasks = (columnId: string) => {
    const tasksInColumn = tasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.position - b.position);
    return tasksInColumn;
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    console.log(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setModalVisible(false);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
            {
              backgroundColor: isActive ? '#8AA6A3' : '#A8BFBD',
              borderWidth: 1,
              borderColor: 'black',
            },
          ]}>
          <View style={styles.taskContainer}>
            <Text style={styles.text}>{item.title}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => editTask(item)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const keyExtractor = (item: Task) => item.id;

  return (
    <NestableScrollContainer style={{ backgroundColor: '#085951' }}>
    {columns.map((column, index) => (
      <View key={column}>
        <Header
          text={column.toUpperCase()}
          column_id={column}
          addNewTask={addNewTask}
        />
        <NestableDraggableFlatList
            data={getColumnTasks(column)}
            onDragEnd={({ data }) => {
              data.forEach((task, index) => {
                updateTaskPosition(task.id, index);
              });
            }}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        </View>
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Task: {editingTask?.title}</Text>
              <Picker
                  selectedValue={selectedColumn}
                  onValueChange={(itemValue) => handleColumnSelect(itemValue)}
                  style={styles.picker}>
                    <Picker.Item label="TO DO" value="to do" />
                    <Picker.Item label="IN PROGRESS" value="in progress" />
                    <Picker.Item label="DONE" value="done" />
              </Picker>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.buttonSave} onPress={handleSaveTask}>
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
                <Pressable style={styles.buttonClose} onPress={closeModal}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </NestableScrollContainer>
  );
}

function Header({
  text,
  column_id,
  addNewTask,
}: {
  text: string;
  column_id: string;
  addNewTask: (newTask: Task) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          padding: 24,
          color: 'white',
        }}>
        {text}
      </Text>
      <AddTask columnId={column_id} addNewTask={addNewTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black', 
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  editButton: {
    backgroundColor: '#012623',
    padding: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonSave: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
  },
  buttonClose: {
    flex:1,
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginLeft: 20, 
  },
  picker: {
    width:150,
    height: 40, // Set a specific height
    backgroundColor: 'white', // Set a contrasting background color
    color: 'black', // Text color
  }
});
