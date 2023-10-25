import { View, Text, Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import { PieChart } from 'react-native-chart-kit';

export default function MyPieChart(props: { data: any[] }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pie Progress Graph</Text>
            <PieChart
                data={props.data}
                width={Dimensions.get('window').width}
                height={300}
                chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
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