import { useState } from "react";
import PropTypes from "prop-types";
import "./App.css";

const ToDoTask = ({ task, onToggleComplete, onDelete }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div className={`to-do-task ${task.isCompleted ? "completed" : ""}`} onClick={() => onToggleComplete(task.id)}>
      <span className={`todo-text ${task.isCompleted ? "completed-text" : ""}`}>{task.text}</span>
      <span className="delete-button" onClick={handleDeleteClick}>
        <i className="fas fa-times"></i>
      </span>
    </div>
  );
};

ToDoTask.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    isCompleted: PropTypes.bool,
  }),
  onToggleComplete: PropTypes.func,
  onDelete: PropTypes.func,
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hasTasks, setHasTasks] = useState(false);

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        isCompleted: false,
      };
      setTodos([...todos, newTask]);
      setInputValue("");
      setHasTasks(true);
    }
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task));
    setTodos(updatedTodos);
  };

  const handleDelete = (id) => {
    const filteredTodos = todos.filter((task) => task.id !== id);
    setTodos(filteredTodos);
    setHasTasks(filteredTodos.length > 0);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className="app-container">
      <div className="input-container">
        <div className="input-button-container">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleInputKeyPress}
            type="text"
            placeholder="Add a new task"
          />
          <button className="add-button" onClick={handleAddTodo}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {hasTasks && (
        <div className="output-container">
          <div className="todo-list">
            {todos.map((task) => (
              <ToDoTask key={task.id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
