import React from "react"
import { Card, Text } from "react-native-paper"
import { View, StyleSheet } from "react-native"

export default function ExpenseCard({ id, title, category, amount, onClickCard, categoryId, date }) {

    return (
        <View style={{ margin: 5 }}>
            <Card mode="outlined" style={styles.card} onPress={() => onClickCard({ id: id, title: title, categoryId: categoryId, amount: amount })}>
                <Card.Content style={styles.content}>
                    {date != undefined && <Text variant="bodyMedium" style={{ fontWeight: '700' }}>{date}</Text>}
                    <Text variant="bodyMedium" style={{ fontWeight: '700' }}>{title}</Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '700' }}>{category}</Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '700' }}>{amount}€ </Text>
                </Card.Content>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginBottom: 8,
    },
    card: {
        width: '100%',

    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',

    }
});