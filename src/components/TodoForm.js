import { useEffect, useState } from 'react';
import React from 'react';

function TodoForm() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [todoEditing, setTodoEditing] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const temp = localStorage.getItem('todoList');
    const loadedTodoList = JSON.parse(temp);

    if (loadedTodoList) {
      setTodoList(loadedTodoList);
    }
  }, []);

  useEffect(() => {
    const temp = JSON.stringify(todoList); // convert todoList sang string
    localStorage.setItem('todoList', temp); // nhận 2 value là 2 string
  }, [todoList]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTodo = {
      // Tạo một object newTodo chứa id, text, và trạng thái complete
      id: new Date().getTime(),
      text: todo,
      completed: false,
    };

    setTodoList([...todoList].concat(newTodo)); // Nối newTodo vào mảng todoList ban đầu
    setTodo('');
  };

  const deleteTodo = (id) => {
    const newTodoList = [...todoList].filter((todo) => todo.id !== id);
    setTodoList(newTodoList);
  };

  const toggleComplete = (id) => {
    const updatedTodoList = [...todoList].map((todo) => {
      // map qua mảng todoList
      if (todo.id === id) {
        // Nếu click vào id giống với id của todo
        todo.completed = !todo.completed; // => chuyển trạng thái completed của todo đó
      }
      return todo;
    });

    setTodoList(updatedTodoList);
  };

  const editTodo = (id) => {
    const updatedTodoList = [...todoList].map((todo) => {
      if (todo.id === id) {
        todo.text = editingText;
      }
      return todo;
    });
    setTodoList(updatedTodoList);
    setTodoEditing(null);
    setEditingText('');
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
              id="completed"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            {todoEditing === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => {
                  setEditingText(e.target.value);
                }}
              />
            ) : (
              <div>{todo.text}</div>
            )}
          </div>
          <div className="todo-actions">
            {todoEditing === todo.id ? (
              <button onClick={() => editTodo(todo.id)}>Submit Edits</button>
            ) : (
              <button onClick={() => setTodoEditing(todo.id)}>Edit Todo</button>
            )}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoForm;
