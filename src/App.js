import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useState, useEffect } from 'react';
import Todo from './components/todo/Todo';
import db from './firebase'; // firebase.js file
import firebase from 'firebase'; // firebase dependancie
import './App.css';

function App() {

  const [todos, setTodos] = useState([])
  const [input, setInput] = useState()

  useEffect(() => {

    db.collection('tasks').orderBy('created_at', 'desc').onSnapshot(snapshot => {
      // with doc.data we get an object that contain name, created_at and updated_at, finished_at
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, details: doc.data() })))
    })

  }, [])

  const addTodo = (event) => {
    // Avoid refresh after submit
    event.preventDefault();

    db.collection('tasks').add({
      name: input,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    })

    // empty the input after creating a new task
    setInput('');
  }

  return (
    <div className="App">
      <h1>Todo list with React</h1>
      <form>
        <FormControl>
          <InputLabel>Ajouter une tâche</InputLabel>
          <Input value={input} onChange={event => setInput(event.target.value)} />
        </FormControl>
        <Button disabled={!input} type="submit" onClick={addTodo} variant="contained" color="primary">
          Ajouter  <AddIcon />
        </Button>
      </form>
      {/* each todo is an object so we have to get all the different properties like todo.name, todo.created_at */}
      {todos.map(todo => (
        <Todo className="todo__container" key={todo.id}
          task={todo.details}
          id={todo.id}
        />
      ))}
    </div>
  );
}

export default App;
