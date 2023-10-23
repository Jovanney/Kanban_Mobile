import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

import { mapIndexToData, Item, getColor } from '../utils';
import AddTask from './AddTask';

interface TaskProps {
  id: string;
  column_id: string;
  title: string;
  position: number;
  backgroundColor?: string;
}
const tasks: TaskProps[] = [
  {
    id: '1',
    column_id: '1',
    title: 'Task 1',
    position: 1,
  },
  {
    id: '2',
    column_id: '1',
    title: 'Task 2',
    position: 2,
  },
  {
    id: '3',
    column_id: '2',
    title: 'Task 3',
    position: 1,
  },
  {
    id: '4',
    column_id: '2',
    title: 'Task 4',
    position: 2,
  },
  {
    id: '5',
    column_id: '3',
    title: 'Task 5',
    position: 1,
  },
];

const NUM_ITEMS = 5;

const initialData = tasks.map((item) => (item.backgroundColor = getColor(item.position, tasks.length)));

const initialData1: Item[] = [...Array(NUM_ITEMS)].map(mapIndexToData);


export default function Basic() {
  const [data1, setData1] = useState(initialData1);
  const [data2, setData2] = useState(initialData1);
  const [data3, setData3] = useState(initialData1);
  const [data, setData] = useState(initialData);


  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? 'red' : item.backgroundColor },
          ]}>
          <Text style={styles.text}>{item.text}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const keyExtractor = (item: Item) => item.key;

  return (
    <NestableScrollContainer style={{ backgroundColor: 'seashell' }}>
      <Header text={'TO DO'} column_id='todo' />
      <NestableDraggableFlatList
        data={data1}
        onDragEnd={({ data }) => setData1(data)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <Header text={'IN PROGRESS'} column_id='inprogress'/>
      <NestableDraggableFlatList
        data={data2}
        onDragEnd={({ data }) => setData2(data)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <Header text={'DONE'} column_id='done'/>
      <NestableDraggableFlatList
        data={data3}
        onDragEnd={({ data }) => setData3(data)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </NestableScrollContainer>
  );
}

function Header({ text, column_id }: { text: string, column_id: string }) {
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
      <AddTask columnId={column_id} />
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
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});