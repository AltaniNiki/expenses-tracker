import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView } from "react-native"
import { TextInput, IconButton, Button, ToggleButton, SegmentedButtons } from "react-native-paper";
import { Dropdown } from 'react-native-paper-dropdown';
import { getCategories } from "../../database/categories";
import { insertDailyExpenses, updateDailyExpenses, deleteDailyExpenses } from "../../database/dailyExpenses"
import { insertMonthlyIncoming, updateMonthlyIncoming, deleteMonthlyIncmoming } from "../../database/monthlyIncoming";
import DateTimePicker from "@react-native-community/datetimepicker";


export default function Expenses({ onCloseHandler, data, mode }) {

    const [categoryList, setCategoryList] = useState([])
    const [category, setCategory] = useState(null);
    const [amount, setAmount] = useState(0);
    const [title, setTitle] = useState('')
    const [date, setDate] = useState(new Date())
    const [type, setType] = useState(0)


    const [errors, setErrors] = useState({
        category: false,
        amount: false,
        title: false
    });

    const loadCategories = async () => {
        try {
            let result = await getCategories();
            // const filtered = result
            //     .filter(d => d.type === 0)
            //     .map(d => ({
            //         label: d.name,
            //         value: d.id
            // }));
            setCategoryList(result)

        } catch (e) {
            throw e;
        }
    }

    useEffect(() => {
        loadCategories()

        if (mode == 'edit') {
            setTitle(data.title);
            setAmount(String(data.amount));
            setCategory(data.category_id)
            setDate(new Date(data.date))
            setType(Number(data.type))
        }
    }, [])

    const expensesCategories = useMemo(() => {
        // Κώδικας που κάνει τον υπολογισμό
        return categoryList.filter(d => d.type === 0)
            .map(d => ({
                label: d.name,
                value: d.id
            }));
    }, [categoryList]);

    const incomingCategories = useMemo(() => {
        // Κώδικας που κάνει τον υπολογισμό
        return categoryList.filter(d => d.type === 1)
            .map(d => ({
                label: d.name,
                value: d.id
            }));
    }, [categoryList]);

    const onDeleteHandler = async () => {
        try {
            if (type == 0) {
                await deleteDailyExpenses(data.id)
            } else {
                await deleteMonthlyIncmoming(data.id)
            }
            onCloseHandler()
        } catch (e) {
            throw e;
        }
    }

    const onUpdateHandler = async () => {
        try {
            const month = String(date.getMonth() + 1); // π.χ. "01"
            const year = String(date.getFullYear()); // π.χ. "2025"


            if (type == 0) {
                await updateDailyExpenses(title, amount, category, data.id, month, year, date);
            } else if (type == 1) {
                await updateMonthlyIncoming(title, amount, category, data.id, month, year, date);
            }
            onCloseHandler();
        } catch (e) {
            throw e;
        }
    }

    const onSubmit = async () => {
        try {
            const newErrors = {
                title: title === '' || title === null || title === " ",
                category: category === null || category === undefined,
                amount: amount === null || amount === undefined
            };

            setErrors(newErrors);
            const hasError = Object.values(newErrors).some(e => e);
            if (hasError) return;

            const month = String(date.getMonth() + 1); // π.χ. "01"
            const year = String(date.getFullYear()); // π.χ. "2025"


            if (type == 0) {
                await insertDailyExpenses(title, amount, category, month, year, date)
            } else {
                await insertMonthlyIncoming(title, amount, category, month, year, date)
            }

            onCloseHandler();
        } catch (e) {
            throw e;
        }
    }

    const onChangeDate = (e, selectedDate) => {
        // const day = String(new Date(selectedDate).getDate()).padStart(2, '0');        // π.χ. "03"
        // const monthFinal = String(new Date(selectedDate).getMonth() + 1).padStart(2, '0'); // π.χ. "08"
        // const yearFinal = new Date(selectedDate).getFullYear();

        // const newDate = yearFinal + '-' + monthFinal + '-' + day;

        setDate(new Date(selectedDate))

    }

    return (
        <View>
            <ScrollView>
                <View style={{ backgroundColor: '#9f9f9fff', borderRadius: 7, marginBottom: 15, padding: 10, flex: 1, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 700, fontSize: 20 }} variant="titleMedium">{mode == 'create' ? 'Add Row' : 'Edit Row'}</Text>
                </View>
                <View>
                    <SegmentedButtons
                        value={type}
                        onValueChange={setType}
                        buttons={[
                            {
                                value: 1,
                                label: 'Incoming',
                            },
                            {
                                value: 0,
                                label: 'Outgoing',
                            },
                        ]}
                    />
                </View>
                <View style={{ marginTop: 10 }}>

                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode='date'
                        is24Hour={true}
                        onChange={onChangeDate}
                    />

                </View>
                <View style={{ marginBottom: 10 }}>
                    <Dropdown label="Category" mode="outlined" options={type == 1 ? incomingCategories : expensesCategories} value={category} onSelect={setCategory} />
                </View>
                <View style={{ marginBottom: 10 }}>
                    <TextInput
                        label="Title"
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text)
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

                <View style={{ marginBottom: 10 }}>
                    <TextInput
                        label="Amount (€)"
                        value={amount}
                        onChangeText={(text) => {
                            let numericValue = text.replace(/[^0-9]/g, '');
                            setAmount(numericValue)
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
                    {mode == 'create' && <Button
                        mode="contained-tonal"
                        buttonColor='#f37217'
                        textColor='white'
                        compact
                        onPress={() => {
                            onSubmit()
                        }
                        }
                    >
                        Create
                    </Button>}
                    {mode == 'edit' && <Button
                        mode="contained-tonal"
                        buttonColor='#f37217'
                        textColor='white'
                        compact
                        onPress={() => {
                            onUpdateHandler()
                        }
                        }
                    >
                        Save
                    </Button>}
                    {mode == 'edit' && <Button
                        mode="contained-tonal"
                        buttonColor='#8B1302'
                        textColor='white'
                        compact
                        onPress={() => {
                            onDeleteHandler()
                        }
                        }
                        style={{ marginTop: 10 }}
                    >
                        Delete
                    </Button>}
                    <Button
                        style={{ marginTop: 10 }}
                        mode="contained-tonal"
                        textColor='black'
                        compact
                        onPress={() => {
                            onCloseHandler()
                        }
                        }
                    >
                        Back
                    </Button>
                </View>
            </ScrollView >
        </View >
    )
}