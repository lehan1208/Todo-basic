import { useEffect, useState } from 'react';
import React from 'react';

function TodoForm() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [todoEditing, setTodoEditing] = useState({});
  const [editingText, setEditingText] = useState('');

  const url = 'https://6293b734089f87a57ac4de6d.mockapi.io/list';
  const fetchData = () => {
    fetch(url, {
      method: 'GET', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Success:', data);
        setTodoList(data);
      })
      .catch((error) => {
        setTodoList([]);
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    // const temp = localStorage.getItem('todoList');
    // const loadedTodoList = JSON.parse(temp);
    fetchData();
    // if (loadedTodoList) {
    //   setTodoList(loadedTodoList);
    // }
  }, []);

  useEffect(() => {
    const temp = JSON.stringify(todoList); // convert todoList sang string
    localStorage.setItem('todoList', temp); // nhận 2 value là 2 string
  }, [todoList]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTodo = {
      content: todo,
      status: false,
    };

    // setTodoList([...todoList].concat(newTodo)); // Nối newTodo vào mảng todoList ban đầu
    fetch('https://6293b734089f87a57ac4de6d.mockapi.io/list', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        fetchData();
        setTodo('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const deleteTodo = (id) => {
    fetch(`https://6293b734089f87a57ac4de6d.mockapi.io/list/${id}`, {
      method: 'DELETE', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        fetchData();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const toggleComplete = (todo) => {
    const editTodo = {
      ...todo,
      status: !todo.status,
    };
    fetch(`https://6293b734089f87a57ac4de6d.mockapi.io/list/${editTodo.id}`, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        fetchData();
        setTodoEditing({});
        setEditingText('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const editTodo = () => {
    const editTodo = {
      ...todoEditing,
      content: editingText,
    };
    fetch(`https://6293b734089f87a57ac4de6d.mockapi.io/list/${editTodo.id}`, {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        fetchData();
        setTodoEditing({});
        setEditingText('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todo}
          onChange={(e) => {
            if (e.target.value.startsWith(' ')) {
              return;
            } else {
              setTodo(e.target.value);
            }
          }}
          placeholder="Add todo ..."
        />
        <button type="submit">Add todo</button>
      </form>

      {todoList.map((todo) => (
        <div key={todo.id} className="todo">
          <div className="todo-text">
            <input
              type="checkbox"
              id="status"
              checked={todo.status}
              onChange={() => toggleComplete(todo)}
            />
            {todoEditing.id === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => {
                  setEditingText(e.target.value);
                }}
              />
            ) : (
              <div>{todo.content}</div>
            )}
          </div>
          <div className="todo-actions">
            {todoEditing.id === todo.id ? (
              <button onClick={() => editTodo()}>Save</button>
            ) : (
              <button
                onClick={() => {
                  setEditingText(todo.content);
                  setTodoEditing(todo);
                }}
              >
                Edit Todo
              </button>
            )}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoForm;
