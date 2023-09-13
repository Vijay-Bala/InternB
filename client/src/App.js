import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ConnectionCount from './ConnectionCount';
const api_base = 'http://localhost:3001';

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(api_base + '/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error: ", err));
  };

  const completeTodo = async (id) => {
    try {
      const response = await fetch(api_base + '/todo/complete/' + id);
      const data = await response.json();

      setTodos((todos) =>
        todos.map((todo) => {
          if (todo._id === data._id) {
            todo.complete = data.complete;
          }
          return todo;
        })
      );
    } catch (err) {
      console.error("Error completing todo: ", err);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch(api_base + "/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newTodo,
        }),
      });

      const data = await response.json();

      setTodos([...todos, data]);

      setPopupActive(false);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo: ", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(api_base + '/todo/delete/' + id, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos((todos) =>
          todos.filter((todo) => todo._id !== id)
        );
      } else {
        console.error("Error deleting todo: ", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting todo: ", err);
    }
  };

  return (
    <div className="App">
      <ConnectionCount />
      <h1>Welcome, My Friend</h1>
      <h4>Your tasks</h4>

      <TransitionGroup className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <CSSTransition key={todo._id} timeout={500} classNames="todo">
              <div
                className={"todo" + (todo.complete ? " is-complete" : "")}
                onClick={() => completeTodo(todo._id)}
              >
                <div className="checkbox"></div>
                <div className="text">{todo.text}</div>
                <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                  x
                </div>
              </div>
            </CSSTransition>
          ))
        ) : null}
      </TransitionGroup>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <CSSTransition in={true} timeout={300} classNames="popup" unmountOnExit>
          <div className="popup">
            <div className="closePopup" onClick={() => setPopupActive(false)}>
              X
            </div>
            <div className="content">
              <h3>Add Task</h3>
              <input
                type="text"
                className="add-todo-input"
                onChange={(e) => setNewTodo(e.target.value)}
                value={newTodo}
              />
              <div className="button" onClick={addTodo}>
                Create Task
              </div>
            </div>
          </div>
        </CSSTransition>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
