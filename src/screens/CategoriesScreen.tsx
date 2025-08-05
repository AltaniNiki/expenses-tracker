import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { getCategories } from "../database/categories"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, FAB } from 'react-native-paper';

import CategoryCard from '../components/Cards/CategoryCard';
import Category from '../components/Modals/Category';

export default function CategoriesScreen() {

    const [categories, setCategories] = useState([]);
    const [dialog, setDialog] = useState({
        open: false,
        type: null,
        data: null
    })

    // const [month, setMonth] = useState();
    // const [year, setYear] = useState();

    const loadData = async () => {
        const data = await getCategories();
        console.log(data);
        setCategories(data);
    }


    useEffect(() => {
        loadData();
    }, [])

    const onDialogHandler = ({ open, type, data }) => {

        setDialog({
            open,
            type,
            data
        })
    }

    const onEditCard = (item) => {
        onDialogHandler({ open: true, type: 'edit', data: item })
    }

    // useEffect(() => {
    //     console.log(month)
    //     console.log(year)
    // }, [month, year])



    return (
        <SafeAreaView style={{ flex: 1, padding: 16, width: '100%' }}>
            {!dialog.open && <View style={{ alignItems: 'center', backgroundColor: '#9f9f9fff', borderRadius: 7, padding: 10 }}>
                <Text style={{ color: 'white', fontWeight: 600 }} variant="titleMedium">Categories</Text>
            </View>
            }


            {!dialog.open && <View style={{ flex: 1, alignItems: "stretch", marginTop: 10, width: '100%' }}>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 100 }}
                    data={categories}
                    renderItem={({ item }) =>
                        <CategoryCard
                            id={item.id}
                            name={item.name}
                            type={item.type}
                            onClickCard={(i) => onEditCard(i)}
                        />}
                    keyExtractor={item => item.id}
                />
            </View>}

            {!dialog.open && <View>
                {/* <Button
                    mode="contained-tonal"
                    icon='plus'
                    buttonColor='#f37217'
                    textColor='white'
                    compact
                    onPress={() => {
                        onDialogHandler({ open: true, type: 'create', data: null })
                    }
                    }
                >

                </Button> */}
                <FAB
                    icon="plus"
                    style={styles.fab}
                    color='white'
                    variant='primary'
                    theme={{ colors: { primary: '#f37217' } }}
                    onPress={() => {
                        onDialogHandler({ open: true, type: 'create', data: null })
                    }
                    }
                />
            </View>
            }

            {dialog.open && <Category onCloseHandler={() => {
                onDialogHandler({ open: false, type: null, data: null })
                loadData();
            }} mode={dialog.type} data={dialog.data} />}
        </SafeAreaView >

    );
}

const styles = StyleSheet.create({
    //   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    //   text: { fontSize: 20 },
    fab: {
        position: 'absolute',
        margin: 5,
        right: 0,
        bottom: 0,
    },
});