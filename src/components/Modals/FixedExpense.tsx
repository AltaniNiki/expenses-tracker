import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native"
import { TextInput, IconButton, Button } from "react-native-paper";
import { Dropdown } from 'react-native-paper-dropdown';
import { getCategories } from "../../database/categories";
import { insertFixedExpenses, updateFixedExpenses, deleteFixedExpenses } from "../../database/fixedExpenses"
import { updateFixedExpensesMonth, deleteFixedExpensesMonth } from "../../database/fixedExpensesMonth";


// type ===> 0:Fixed 1: Monthly fixed

export default function FixedExpenses({ onCloseHandler, data, mode, type }) {

    const [categoryList, setCategoryList] = useState([])
    const [category, setCategory] = useState(null);
    const [amount, setAmount] = useState(0);
    const [title, setTitle] = useState('')

    const [errors, setErrors] = useState({
        category: false,
        amount: false,
        title: false
    });

    const loadCategories = async () => {
        try {
            let result = await getCategories();


            const filtered = result
                .filter(d => d.type === 0)
                .map(d => ({
                    label: d.name,
                    value: d.id
                }));
            setCategoryList(filtered)
        } catch (e) {
            throw e;
        }
    }

    useEffect(() => {
        loadCategories()
        console.log('data--->', data)
        if (mode == 'edit') {
            setTitle(data.title);
            setAmount(String(data.amount));
            setCategory(data.categoryId)
        }
    }, [])

    const onDeleteHandler = async () => {
        try {
            if (type == 0) {

                await deleteFixedExpenses(data.id)

            } else {
                await deleteFixedExpensesMonth(data.id)
            }
            onCloseHandler()
        } catch (e) {
            throw e;
        }
    }

    const onUpdateHandler = async () => {
        try {
            if (type == 0) {
                console.log('fixed')
                await updateFixedExpenses(title, amount, category, data.id);

            } else {
                console.log('fixed monthly')
                await updateFixedExpensesMonth(title, amount, category, data.id, data.month, data.year)
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


            await insertFixedExpenses(title, amount, category)
            onCloseHandler();
        } catch (e) {
            throw e;
        }
    }

    return (
        <View>
            <ScrollView>
                <View style={{ backgroundColor: '#9f9f9fff', borderRadius: 7, marginBottom: 15, padding: 10, flex: 1, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 700, fontSize: 20 }} variant="titleMedium">{mode == 'create' ? 'Create Fixed Expense' : 'Edit Fixed Expense'}</Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Dropdown label="Category" mode="outlined" options={categoryList} value={category} onSelect={setCategory} />
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
                            // console.log('lalalal');
                            onCloseHandler()
                        }
                        }
                    >
                        Back
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
}