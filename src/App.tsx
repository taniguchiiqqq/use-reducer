import { ChangeEvent, FormEvent, Reducer, useReducer, useState } from "react";
import "./App.css";

// types file
type TodoType = {
  id: number;
  task: string;
};

type TodoAction =
  | {
      type: "create";
      task: TodoType["task"];
    }
  | { type: "delete"; todoId: TodoType["id"] }
  | { type: "update"; todoId: TodoType["id"]; updatedTask: TodoType["task"] };

type TodoReducer = Reducer<TodoType[], TodoAction>;

const INITIAL_STATE: TodoType[] = [];

// reducer file
const todoReducer: TodoReducer = (prevState, action) => {
  switch (action.type) {
    case "create":
      return [
        ...prevState,
        {
          id: prevState.length,
          task: action.task
        }
      ];
    case "update":
      return prevState.map<TodoType>((todo) =>
        todo.id === action.todoId ? { ...todo, task: action.updatedTask } : todo
      );

    case "delete":
      return prevState.filter((todo) => todo.id !== action.todoId);

    default:
      break;
  }
  return prevState;
};

// component
function App() {
  const [task, setTask] = useState<string>("");
  const [updatedTask, setUpdatedTask] = useState<TodoType["task"]>("");
  const [todoIdInEdit, setTodoInEdit] = useState<TodoType["id"] | null>(null);
  const [todos2, dispatch] = useReducer<TodoReducer>(
    todoReducer,
    INITIAL_STATE
  );

  const HandleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch({ type: "create", task });
    setTask("");
  };

  const handleDelete = (todoId: TodoType["id"]) => {
    dispatch({ type: "delete", todoId });
  };

  const handleUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoIdInEdit) {
      dispatch({ type: "update", todoId: todoIdInEdit, updatedTask });
      setTodoInEdit(null);
      setUpdatedTask("");
    }
  };

  return (
    <div className="todos">
      <h1>Todo List</h1>

      <div className="new-todo">
        <form onSubmit={handleCreate}>
          <input type="text" value={task} onChange={HandleInputChange} />
          <button type="submit">Add Todo</button>
        </form>
      </div>
      <ul>
        {todos2.map(({ id, task }) => (
          <li key={id} style={{ padding: 12, border: "1px solid red" }}>
            {todoIdInEdit === id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  defaultValue={task}
                  onChange={(event) => setUpdatedTask(event.target.value)}
                />
                <button type="submit">Update</button>
              </form>
            ) : (
              <h3>{task}</h3>
            )}
            <button onClick={() => setTodoInEdit(id)}>Edit</button>
            <button onClick={() => handleDelete(id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
