import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import AddTask from './AddTask';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  title: string;
  columnId: string;
  position: number;
}

export default function Basic() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addNewTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTaskPosition = (taskId: string, newPosition: number) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, position: newPosition };
        }
        return task;
      });
    });
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

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  const columns = ['todo', 'inprogress', 'done'];

  const getColumnTasks = (columnId: string) => {
    const tasksInColumn = tasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.position - b.position);
    return tasksInColumn;
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
              backgroundColor: isActive ? 'red' : 'gray',
              borderWidth: 1,
              borderColor: 'black',
            },
          ]}>
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const keyExtractor = (item: Task) => item.id;

  return (
    <NestableScrollContainer style={{ backgroundColor: 'seashell' }}>
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
                // Update the position attribute of each task within the column
                updateTaskPosition(task.id, index);
              });
            }}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        </View>
      ))}
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
          color: '#555',
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
    color: 'black', // Set text color here
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
