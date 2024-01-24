import { useState } from "react";
import PropTypes from "prop-types";
import "./App.css";

const ToDoTask = ({ task, onToggleComplete, onDelete }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div className="to-do-task" onClick={() => onToggleComplete(task.id)}>
      <span className={`todo-text ${task.isCompleted ? "completed-task" : ""}`}>{task.text}</span>
      <button className="delete-button custom-delete-button" onClick={handleDeleteClick}>
        <i className="fa-solid fa-xmark"></i>
      </button>
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

  const handleClearAll = () => {
    setTodos([]);
    setHasTasks(false);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className="container">
      <div className="input-container">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
          type="text"
          placeholder="Add a new task"
        />
        <button className="add-button" onClick={handleAddTodo}>
          <i className="fas fa-plus"></i>ADD
        </button>
        {hasTasks && (
          <button className="clear-button" onClick={handleClearAll}>
            <i className="fa-solid fa-broom"></i>CLEAR
          </button>
        )}
      </div>

      {hasTasks && (
        <div className="output-container">
          {todos.map((task) => (
            <ToDoTask key={task.id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
