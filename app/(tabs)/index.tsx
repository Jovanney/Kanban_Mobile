import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import React from 'react';
import KanbanBoard from '../../components/KanbanBoard';



export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kanban Board</Text>
      <View style={styles.nestedContainer}>
        <KanbanBoard/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nestedContainer: {
    width: '100%',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
