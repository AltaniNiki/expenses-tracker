import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Divider, Card } from 'react-native-paper';
import { months } from "../constants/global"
import { Dropdown } from 'react-native-paper-dropdown';
import { getWeeklySumsByMonth, sumByMonthDaily } from "../database/dailyExpenses"
import { sumByMonth } from "../database/fixedExpensesMonth"
import { sumByMonthIncoming } from "../database/monthlyIncoming"
import { getParams } from "../database/params"

export default function HomeScreen() {

  const [month, setMonth] = useState();
  const [year, setYear] = useState()
  const [weeks, setWeeks] = useState([])
  const [fixed, setFixed] = useState(0)
  const [daily, setDaily] = useState(0)
  const [salary, setSalary] = useState(0)
  const [goal, setGoal] = useState(0)
  const [incoming, setIncoming] = useState(0)


  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // π.χ. "01"
    const currentYear = now.getFullYear(); // π.χ. "2025"

    setMonth(currentMonth);
    setYear(currentYear);

  }, [])

  useEffect(() => {
    loadWeeks()
    loadFixed();
    loadDaily();
    loadMonthlyIncoming();
    loadParams();
  }, [month])



  const remaining = useMemo(() => {
    // Κώδικας που κάνει τον υπολογισμό
    return (salary + incoming) - (fixed + daily)
  }, [fixed, daily, salary, incoming]);

  const loadWeeks = async () => {
    try {
      var result = await getWeeklySumsByMonth(month, year)
      setWeeks(result)
    } catch (e) {
      throw e;
    }
  }


  const loadFixed = async () => {
    try {
      var result = await sumByMonth(month);
      if (result[0].total == null) {
        setFixed(0)
      } else {
        setFixed(result[0]?.total)
      }
    } catch (e) {
      throw e;
    }
  }
  const loadMonthlyIncoming = async () => {
    try {
      var result = await sumByMonthIncoming(month);
      if (result[0].total == null) {
        setIncoming(0)
      } else {
        setIncoming(result[0]?.total)
      }
    } catch (e) {
      throw e;
    }
  }

  const loadDaily = async () => {
    try {
      const result = await sumByMonthDaily(month);

      if (result[0].total == null) {
        setDaily(0)
      } else {
        setDaily(result[0]?.total)
      }

    } catch (e) {
      throw e;
    }
  }

  const loadParams = async () => {
    try {
      const result = await getParams();
      setSalary(result.salary)
      setGoal(result.week_goal)
    } catch (e) {
      throw e;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <View style={{ alignItems: 'center', backgroundColor: '#9f9f9fff', borderRadius: 7, padding: 10, marginBottom: 10 }}>
        <Text style={{ color: 'white', fontWeight: 600 }} variant="titleMedium">Home</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Dropdown placeholder="Month" mode="outlined" options={months} value={month} onSelect={setMonth} />
      </View>
      <ScrollView>
        <View>
          <Card mode="outlined">
            <Card.Content style={styles.content}>
              <Text variant="headlineSmall"> Remaining</Text>
              <Text variant="headlineSmall" style={{ fontWeight: '700', color: remaining > 0 ? 'green' : 'red' }}> {remaining}€ </Text>
            </Card.Content>
          </Card>
        </View>
        <View style={{ marginTop: 5 }}>
          <Card mode="outlined">
            <Card.Content >
              <View style={styles.content}>
                <Text variant="titleMedium">Fixed Expenses:</Text>
                <Text variant="titleMedium" style={{ color: 'red', fontWeight: '700' }}>{fixed}€</Text>
              </View>
              <Divider style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
              <View style={styles.content}>
                <Text variant="titleMedium" >Daily Expenses:</Text>
                <Text variant="titleMedium" style={{ color: 'red', fontWeight: '700' }}>{daily}€</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
        <View style={{ marginTop: 5 }}>
          <Card mode="outlined">
            <Card.Content >
              <View style={styles.content}>
                <Text variant="titleMedium">Salary:</Text>
                <Text variant="titleMedium" style={{ color: 'green', fontWeight: '700' }}>{salary}€</Text>
              </View>
              <Divider style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
              <View style={styles.content}>
                <Text variant="titleMedium">Extra Incoming:</Text>

                <Text variant="titleMedium" style={{ color: 'green', fontWeight: '700' }}>{incoming}€</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
        <View style={{ marginTop: 5 }}>
          <Card mode="outlined">
            <Card.Content >
              {weeks?.map((item, i) => (
                <View style={styles.content} key={'week' + i}>
                  <Text>{item.week_start} - {item.week_end}</Text>
                  <Text>{item.total} / {goal}€</Text>
                </View>
              ))}


            </Card.Content>
          </Card>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRow: {
    flex: 1,
    flexDirection: 'row',
  }
});