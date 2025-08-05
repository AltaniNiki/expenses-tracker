import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput, Divider } from 'react-native-paper';
import { updateParams, getParams } from "../database/params"
import { getFixedExpenses } from "../database/fixedExpenses"
import ExpenseCard from '../components/Cards/ExpenseCard';
import FixedExpenses from '../components/Modals/FixedExpense';

export default function HomeScreen() {

    const [salary, setSalary] = useState(0);
    const [week, setWeek] = useState(0);
    const [fixed, setFixed] = useState([])
    const [dialog, setDialog] = useState({
        open: false, type: null, data: null
    })

    const onDialogHandler = ({ open, type, data }) => {
        setDialog({
            open,
            type,
            data
        })
    }

    const loadDataParams = async () => {
        try {
            var data = await getParams()
            setSalary(String(data.salary))
            setWeek(String(data.week_goal))
        } catch (e) {
            throw e;
        }
    }

    const loadDataFixed = async () => {
        try {
            var data = await getFixedExpenses();
            setFixed(data)
        } catch (e) {
            throw e;
        }
    }

    useEffect(() => {
        loadDataParams()
        loadDataFixed();
    }, [])


    const onUpdateParams = async () => {
        try {
            await updateParams(salary, week)
        } catch (e) {
            throw e;
        }
    }

    const onEditCard = (item) => {
        onDialogHandler({ open: true, type: 'edit', data: item })
    }

    return (
        <SafeAreaView style={{ flex: 1, padding: 10 }}>
            {!dialog.open && <View style={{ paddingLeft: 16, paddingRight: 16 }}>
                <View style={{ alignItems: 'center', backgroundColor: '#9f9f9fff', borderRadius: 7, padding: 10 }}>
                    <Text style={{ color: 'white', fontWeight: 600 }} variant="titleMedium">Config</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        label="Salary"
                        value={salary}
                        onChangeText={(text) => {
                            let numericValue = text.replace(/[^0-9]/g, '');
                            setSalary(numericValue)

                        }}
                        mode="outlined"
                        cursorColor="#f37217"
                        selectionColor="#f37217"
                        underlineColor="#f37217"
                        activeUnderlineColor="#f37217"
                        outlineColor="#f37217"
                        activeOutlineColor="#f37217"
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        label="Week"
                        value={week}
                        onChangeText={(text) => {
                            let numericValue = text.replace(/[^0-9]/g, '');
                            setWeek(numericValue);
                        }}
                        mode="outlined"
                        cursorColor="#f37217"
                        selectionColor="#f37217"
                        underlineColor="#f37217"
                        activeUnderlineColor="#f37217"
                        outlineColor="#f37217"
                        activeOutlineColor="#f37217"
                    />
                </View>

                <View>
                    <Button onPress={() => onUpdateParams()} style={{ marginTop: 10 }} buttonColor='#f37217' textColor='white' mode="outlined">Save</Button>
                </View>

                <Divider style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
                <View style={{ alignItems: 'center', backgroundColor: '#9f9f9fff', borderRadius: 7, padding: 10, borderColor: 'black', }}>
                    <Text style={{ color: 'white', fontWeight: 600 }} variant="titleMedium">Fixed Expenses</Text>
                </View>
            </View>}
            {!dialog.open && <View style={{ flex: 1, marginTop: 10 }}>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 100 }}
                    data={fixed}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <ExpenseCard
                            id={item.id}
                            title={item.title}
                            category={item.description}
                            categoryId={item.category_id}
                            amount={item.amount}
                            onClickCard={(i) => onEditCard(i)}
                        />}
                />

                <Button onPress={() => { onDialogHandler({ open: true, type: 'create', data: null }) }} style={{ marginTop: 10 }} textColor='white' mode="outlined" buttonColor='#f37217'>Create</Button>

            </View>}
            {dialog.open && <View>
                <FixedExpenses type={0} mode={dialog.type} data={dialog.data} onCloseHandler={() => {
                    onDialogHandler({ open: false, type: null, data: null })
                    loadDataFixed();
                }} />
            </View>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 20 },
});