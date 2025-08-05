import React, { useState, useEffect } from "react";
import { View, Text } from "react-native"
import { TextInput, IconButton, Button } from "react-native-paper";
import { Dropdown } from 'react-native-paper-dropdown';
import { insertCategories, deleteCategory, updateCategory } from "../../database/categories";

export default function Category({ onCloseHandler, data, mode }) {

    const typeList = [{
        label: "Outgoing", value: 0
    }, {
        label: "Incoming", value: 1
    }]

    const [type, setType] = useState(0)
    const [name, setName] = useState('')
    const [errors, setErrors] = useState({
        name: false,
        type: false
    });


    useEffect(() => {
        if (mode == 'edit') {

            setType(data.type);
            setName(data.name)
        }
    }, [])

    const onSubmit = async () => {
        try {
            const newErrors = {
                name: name === '' || name === null || name === " ",
                type: type === null || type === undefined
            };

            setErrors(newErrors);
            const hasError = Object.values(newErrors).some(e => e);
            if (hasError) return;

            await insertCategories(name, type)
            onCloseHandler();
        } catch (e) {
            console.log('Error inserting:', e);
            throw e;
        }
    }

    const onDeleteHandler = async () => {
        try {
            if (data.id != undefined)
                await deleteCategory(data.id)

            onCloseHandler()
        } catch (e) {
            throw e;
        }
    }

    const onUpdateHandler = async () => {
        try {
            await updateCategory(data.id, name, type)
            onCloseHandler();
        } catch (e) {
            throw e;
        }
    }
    return (
        <View>
            <View style={{ backgroundColor: '#9f9f9fff', borderRadius: 7, marginBottom: 15, padding: 10 }}>

                <Text style={{ color: 'white', fontWeight: 700, fontSize: 20 }} variant="titleMedium">{mode == 'create' ? 'Create Category' : 'Edit Category'}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
                <TextInput
                    label="Name"
                    value={name}
                    onChangeText={(text) => {
                        setName(text)
                    }}
                    mode="outlined"
                    cursorColor="#f37217"
                    selectionColor="#f37217"
                    underlineColor="#f37217"
                    activeUnderlineColor="#f37217"
                    outlineColor="#f37217"
                    activeOutlineColor="#f37217"
                    error={errors.name}
                />
                <Dropdown label="Type" mode="outlined" options={typeList} value={type} onSelect={setType} />

            </View>
            <View style={{ marginTop: 20, }}>
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
        </View>
    )
}