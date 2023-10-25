import { Dimensions, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import MyPieChart from '../../components/PieChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import MyLineChart from '../../components/LineChart';

interface Task {
  id: string;
  title: string;
  columnId: string;
  position: number;
  completedDate?: Date;
}

interface Counts {
  [key: string]: number;
}


export default function TabTwoScreen() {
  const [pieData, setPieData] = useState<{ name: string; population: number; color: string }[]>([]);
  const [lineChartData, setLineChartData] = useState<{ labels: string[]; datasets: { data: number[] }[] }>({
    labels: [],
    datasets: [{ data: [] }],
  });
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await AsyncStorage.getItem('tasks');
        const parsedTasks: Task[] = tasks ? JSON.parse(tasks) : [];
        const columnCounts: Counts = parsedTasks.reduce((counts: Counts, task) => {
          const columnId = task.columnId;
          counts[columnId] = counts[columnId] ? counts[columnId] + 1 : 1;
          return counts;
        }, {});
        const pieData = Object.entries(columnCounts).map(([name, population], index) => ({
          name: name.toUpperCase(),
          population,
          color: COLORS[index % COLORS.length],
        }));

        // Calculate lineChartData for the line chart
        const doneTasks = parsedTasks.filter((task) => task.columnId === 'done');
        const dateCounts: Counts = doneTasks.reduce((counts: Counts, task) => {
          const completedDate = task.completedDate;
          if (completedDate) {
            const date = new Date(completedDate);
            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
              .toString()
              .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            counts[formattedDate] = counts[formattedDate] ? counts[formattedDate] + 1 : 1;
          }
          return counts;
        }, {});
        const labels = Object.keys(dateCounts);
        const data = labels.map((label) => dateCounts[label]);
        
        setPieData(pieData);
        setLineChartData({
          labels,
          datasets: [{ data }],
        });
      
      } catch (error) {
        console.log(error);
      }
    };

    fetchTasks();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <MyPieChart data={pieData} />
      </View>
      <View style={styles.separator} />
      <View style={styles.chartContainer}>
        {lineChartData.labels.length > 0 && (
          <MyLineChart data={lineChartData} />
        )}
      </View>
    </View>
  );
}

const COLORS = ['#725EF2', '#056CF2', '#010626'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
  },
});