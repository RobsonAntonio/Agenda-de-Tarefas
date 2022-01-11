import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import ScrollViewStickyHeaderWithForwardedRef from "react-native/Libraries/Components/ScrollView/ScrollViewStickyHeader";
import Login from "./src/components/Login";
import TaskList from './src/components/TaskList'
import Feather from 'react-native-vector-icons/Feather';
import firebase from './src/services/firebaseConnection';



export default function App() {
  const [user, setUser] = useState(null);
  const [newTask, setNewStak] = useState('');
  const inputRef = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [key, setKey] = useState('');

  useEffect(() => {
    function getUser() {

      if (!user) {
        return;
      }

      firebase.database().ref('tarefas').child(user).once('value', (snapshot) => {
        setTasks([]);

        snapshot?.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(oldTasks => [...oldTasks, data])
        })
      })
    }
    getUser();
  }, [user]);

  function handleAdd() {
    if (newTask === '') {
      return;
    }

    //Usuario quer editar uma tarefa
    if (key !== '') {
      firebase.database().ref('tarefas').child(user).child(key).update({
        nome: newTask
      })
        .then(() => {
          const taskIndex = tasks.findIndex(item => item.key === key) //pega a posicao do item que foi selecionado
          const taskClone = tasks; // clona toda a lista que tem
          taskClone[taskIndex].nome = newTask // pega alista clonada e altera o item da lista que foi alterado apenas

          setTasks([...taskClone]) // altera a lista atualizada
        })

      Keyboard.dismiss();
      setNewStak('');
      setKey('');
      return;
    }

    let tarefas = firebase.database().ref('tarefas').child(user);
    let chave = tarefas.push().key;

    tarefas.child(chave).set({
      nome: newTask
    })
      .then(() => {
        const data = {
          key: chave,
          nome: newTask
        };

        setTasks(oldTasks => [...oldTasks, data])
      })

    Keyboard.dismiss();
    setNewStak('');

  }


  function handleDelete(key) {
    firebase.database().ref('tarefas').child(user).child(key).remove()
      .then(() => {
        const findTasks = tasks.filter(item => item.key !== key)
        setTasks(findTasks)
      })
  }

  function handleEdit(data) {
    setKey(data.key)
    setNewStak(data.nome)
    inputRef.current.focus();
  }

  function cancelEdit() {
    setKey('');
    setNewStak('');
    Keyboard.dismiss();
  }

  if (!user) {
    return <Login changeStatus={(user) => setUser(user)} />
  }

  return (
    <SafeAreaView style={styles.container}>

      { key.length > 0 && (

        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <TouchableOpacity onPress={cancelEdit}>
            <Feather name="x-circle" size={20} color='#FF0000' />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5, color:'#FF0000' }}>
            Você está editando uma tarefa!
          </Text>
        </View>

      )}

      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder="O que vai fazer hoje?"
          value={newTask}
          onChangeText={(text) => setNewStak(text)}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TaskList data={item} deleteItem={handleDelete} editItem={handleEdit} />
        )}

      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  },
  containerTask: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45,

  },
  buttonAdd: {
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 22,

  }



})