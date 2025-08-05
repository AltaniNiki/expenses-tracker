import React from "react"
import { Card, Text } from "react-native-paper"
import { View, StyleSheet } from "react-native"

export default function CategoryCard({ id, name, type, onClickCard }) {
    return (
        <View style={styles.wrapper}>
            <Card mode="outlined" style={styles.card} onPress={()=>onClickCard({ id: id, name: name, type: type })}>
                <Card.Content style={styles.content}>
                    <Text variant="bodyMedium" style={{ fontWeight: '700' }}>{name}</Text>
                    <Text variant="bodyMedium" style={{ color: type == 0 ? 'red' : 'green' }}>{type == 0 ? 'Outgoing' : 'Incoming'}</Text>
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