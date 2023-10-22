import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

import { mapIndexToData, Item } from '../utils';

const NUM_ITEMS = 5;

const initialData1: Item[] = [...Array(NUM_ITEMS)].map(mapIndexToData);
const initialData2: Item[] = [...Array(NUM_ITEMS)].map(mapIndexToData);
const initialData3: Item[] = [...Array(NUM_ITEMS)].map(mapIndexToData);


export default function Basic() {
  const [data1, setData1] = useState(initialData1);
  const [data2, setData2] = useState(initialData1);
  const [data3, setData3] = useState(initialData1);

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
      <Header text={'TO DO'} />
      <NestableDraggableFlatList
        data={data1}
        onDragEnd={({ data }) => setData1(data)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <Header text={'IN PROGRESS'} />
      <NestableDraggableFlatList
        data={data2}
        onDragEnd={({ data }) => setData2(data)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <Header text={'DONE'} />
      <NestableDraggableFlatList
        data={data3}
        onDragEnd={({ data }) => setData3(data)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </NestableScrollContainer>
  );
}

function Header({ text }: { text: string }) {
  return (
    <View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          padding: 24,
          color: '#555',
        }}>
        {text}
      </Text>
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