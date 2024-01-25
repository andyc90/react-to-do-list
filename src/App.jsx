import { useState, useRef } from "react";
import PropTypes from "prop-types";
import "./App.css";
import addSound from "./assets/audio/add_sfx.mp3";
import clearSound from "./assets/audio/clear_sfx.mp3";
import deleteSound from "./assets/audio/delete_sfx.mp3";
import editSound from "./assets/audio/edit_sfx.mp3";
import editCompleteSound from "./assets/audio/edit_complete_sfx.mp3";

const globalVolume = 0.1;

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const ToDoTask = ({ task, onToggleComplete, onDelete, onEdit, playDeleteSound, playEditSound }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const editInputRef = useRef(null);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(task.id);
    playDeleteSound();
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    playEditSound();
  };

  const handleInputChange = (e) => {
    setEditText(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      playEditSound();
      onEdit(task.id, editText);
      setIsEditing(false);
      if (editText !== task.text) {
        const editCompleteAudio = new Audio(editCompleteSound);
        editCompleteAudio.volume = globalVolume;
        editCompleteAudio.play();
      }
    } else if (e.key === "Escape") {
      setIsEditing(false);
      if (editInputRef.current) {
        editInputRef.current.blur();
      }
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="to-do-task" onClick={() => onToggleComplete(task.id)}>
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          className="edit-input"
          value={editText}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyPress}
          onBlur={handleInputBlur}
          autoFocus
        />
      ) : (
        <span className={`todo-text ${task.isCompleted ? "completed-task" : ""}`}>{task.text}</span>
      )}
      <div className="button-container">
        <button className="edit-button" onClick={handleEditClick}>
          <i className="fa-solid fa-pen"></i>
        </button>
        <button className="delete-button" onClick={handleDeleteClick}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
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
  onEdit: PropTypes.func,
  playDeleteSound: PropTypes.func,
  playEditSound: PropTypes.func,
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputContainerRef = useRef(null);
  const throttledPlayAddSound = throttle(() => playSound(addSound), 1000);
  const throttledPlayClearSound = throttle(() => playSound(clearSound), 1000);
  const throttledPlayDeleteSound = throttle(() => playSound(deleteSound), 1000);
  const throttledPlayEditSound = throttle(() => playSound(editSound), 1000);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.currentTime = 0;
    audio.volume = globalVolume;
    audio.play();
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        isCompleted: false,
      };
      setTodos([...todos, newTask]);
      setInputValue("");
      throttledPlayAddSound();
    }
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task));
    setTodos(updatedTodos);
  };

  const handleDelete = (id) => {
    const filteredTodos = todos.filter((task) => task.id !== id);
    setTodos(filteredTodos);
    throttledPlayDeleteSound();
  };

  const handleEdit = (id, newText) => {
    const updatedTodos = todos.map((task) => (task.id === id ? { ...task, text: newText } : task));
    setTodos(updatedTodos);
    throttledPlayEditSound();
  };

  const handleClearAll = () => {
    setTodos([]);
    throttledPlayClearSound();
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleInputEscape = (e) => {
    if (e.key === "Escape" && inputContainerRef.current) {
      inputContainerRef.current.querySelector("input").blur();
    }
  };

  return (
    <div className="container">
      <div className="input-container" ref={inputContainerRef}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            handleInputKeyPress(e);
            handleInputEscape(e);
          }}
          placeholder="Add a new task"
          type="text"
        />
        <button className="add-button" onClick={handleAddTodo}>
          <i className="fas fa-plus"></i>ADD
        </button>
        {todos.length > 0 && (
          <button className="clear-button" onClick={handleClearAll}>
            <i className="fa-solid fa-broom"></i>CLEAR
          </button>
        )}
      </div>

      {todos.length > 0 && (
        <div className="output-container">
          {todos.map((task) => (
            <ToDoTask
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
              playDeleteSound={throttledPlayDeleteSound}
              playEditSound={throttledPlayEditSound}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
