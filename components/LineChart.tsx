import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit'
import { ChartData } from 'react-native-chart-kit/dist/HelperTypes'
export default function MyLineChart(props: { data: ChartData }) {
  return (
      <View style={styles.container}>
          <Text style={styles.title}>
            Done Task Line Chart
          </Text>
          <LineChart
            data={props.data}
            width={Dimensions.get('window').width}
            height={400}
            chartConfig={{
              backgroundGradientFrom: 'darkblue',
              backgroundGradientTo: 'blue',
              color: (opacity = 3) => `rgba(255, 255, 255, ${opacity})`
            }}
          />
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});