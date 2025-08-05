import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { months, years } from "../constants/global"
import { Dropdown } from 'react-native-paper-dropdown';
import { Text, Divider, FAB, Button } from 'react-native-paper';
import { getFixedExpensesMonth, insertFixedExpensesMonth, deleteFixedExpensesMonthAll } from "../database/fixedExpensesMonth"
import { getFixedExpenses } from '../database/fixedExpenses';
import { getDailyExpenses, deleteDailyExpensesAll } from '../database/dailyExpenses';
import { getMontlyIncoming } from '../database/monthlyIncoming';
import ExpenseCard from '../components/Cards/ExpenseCard';
import Expenses from "../components/Modals/Expenses"
import FixedExpenses from '../components/Modals/FixedExpense';

export default function ExpensesScreen() {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [fixedMonth, setFixedMonth] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incoming, setIncoming] = useState([])
  const [dialog, setDialog] = useState({
    open: false,
    type: null,
    data: null
  });


  const onDialogHandler = ({ open, type, data }) => {

    setDialog({
      open,
      type,
      data
    })
  }


  const loadFixedMonth = async () => {
    try {

      if (month != null && year != null) {
        const result = await getFixedExpensesMonth(month, year);
        setFixedMonth(result)
      }
    } catch (e) {
      throw e;
    }
  }

  const loadMonthly = async () => {
    try {
      if (month != null && year != null) {
        const result = await getDailyExpenses(month, year);
        setExpenses(result)

      }
    } catch (e) {
      throw e;
    }
  }

  const loadMonthlyIncoming = async () => {
    try {
      if (month != null && year != null) {
        const result = await getMontlyIncoming(month, year);
        setIncoming(result)
      }
    } catch (e) {
      throw e;
    }
  }

  const addFixedToMonth = async () => {
    try {
      var result = await getFixedExpenses();
      result = result.map(async (r) => {
        await insertFixedExpensesMonth(r.title, r.amount, r.category_id, month, year)
      })
      loadFixedMonth();
    } catch (e) {
      throw e;
    }
  }

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // π.χ. "01"
    const currentYear = now.getFullYear(); // π.χ. "2025"

    setMonth(currentMonth);
    setYear(currentYear);

  }, [])

  const onSearchHandler = () => {
    loadMonthly();
    loadFixedMonth();
    loadMonthlyIncoming();
  }


  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      {!dialog.open && <ScrollView >
        <View style={{ alignItems: 'center', backgroundColor: '#9f9f9fff', borderRadius: 7, padding: 10, marginBottom: 10 }}>
          <Text style={{ color: 'white', fontWeight: 600 }} variant="titleMedium">Expenses</Text>
        </View>
        <View style={{ padding: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <Dropdown placeholder="Month" mode="outlined" options={months} value={month} onSelect={setMonth} />
          </View>
          <View>
            <Dropdown placeholder="Year" mode="outlined" options={years} value={year} onSelect={setYear} />
          </View>
          <View style={{ marginTop: 5 }}>
            <Button
              onPress={() => onSearchHandler()}
              buttonColor='#f37217'
              textColor='white'
            >
              Search
            </Button>
          </View>
          {fixedMonth.length == 0 && <View style={{ marginTop: 5 }}>
            <Button
              onPress={() => addFixedToMonth()}
              buttonColor='gray'
              textColor='white'
              disabled={month == null}
            >
              Apply fixed expenses
            </Button>
          </View>}
        </View>
        <View style={{ alignItems: 'center', backgroundColor: '#9f9f9fff', borderRadius: 7, padding: 10, borderColor: 'black' }}>
          <Text style={{ color: 'white', fontWeight: 600 }} variant="titleMedium">Fixed Expenses</Text>
        </View>
        <Divider style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
        <View>
          {fixedMonth?.map(item => (
            <ExpenseCard
              key={item.id}
              id={item.id}
              title={item.title}
              category={item.description}
              categoryId={item.category_id}
              amount={item.amount}
              onClickCard={() => {
                onDialogHandler({ open: true, type: 'edit-fixed', data: { ...item, categoryId: item.category_id } })
                loadFixedMonth();
              }

              }
            />
          ))}
        </View>
        <View style={{ alignItems: 'center', backgroundColor: '#9f9f9fff', borderRadius: 7, padding: 10, borderColor: 'black' }}>
          <Text style={{ color: 'white', fontWeight: 600 }} variant="titleMedium">Monthly Incoming</Text>
        </View>
        <View>
          {incoming?.map(item => (
            <ExpenseCard
              key={item.id}
              id={item.id}
              title={item.title}
              category={item.description}
              categoryId={item.category_id}
              amount={item.amount}
              date={item.date}
              onClickCard={() => {
                onDialogHandler({ open: true, type: 'edit-daily', data: { ...item, categoryId: item.category_id, type: 1 } })
                loadMonthlyIncoming();
              }
              }
            />
          ))}
        </View>
        <View style={{ alignItems: 'center', backgroundColor: '#9f9f9fff', borderRadius: 7, padding: 10, borderColor: 'black', marginTop: 5 }}>
          <Text style={{ color: 'white', fontWeight: 600 }} variant="titleMedium">Monthly Expenses</Text>
        </View>
        <View>
          {expenses?.map(item => (
            <ExpenseCard
              key={item.id}
              id={item.id}
              title={item.title}
              category={item.description}
              categoryId={item.category_id}
              amount={item.amount}
              date={item.date}
              onClickCard={() => {
                onDialogHandler({ open: true, type: 'edit-daily', data: item })
                loadMonthly()
              }
              }

            />
          ))}
        </View>
      </ScrollView>}

      {!dialog.open && <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => onDialogHandler({ open: true, type: 'create-daily', data: null })}
        variant='primary'
        theme={{ colors: { primary: '#f37217' } }}
      />}
      {dialog.open && ['create-daily', 'edit-daily'].includes(dialog.type) && <View>
        <Expenses
          onCloseHandler={() => { onDialogHandler({ open: false, type: null, data: null }); loadMonthly() }} data={dialog.data} mode={dialog.type == 'create-daily' ? 'create' : 'edit'} />
      </View>}
      {dialog.open && ['edit-fixed'].includes(dialog.type) && <View>
        <FixedExpenses
          onCloseHandler={() => { onDialogHandler({ open: false, type: null, data: null }); loadMonthly() }}
          data={dialog.data}
          mode={dialog.type == 'create-daily' ? 'create' : 'edit'}
          type={1}
          month={month}
          year={year} />
      </View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});