import { Fragment, useContext, useEffect, useState } from "react";
import { ProfileContext } from "../../contexts/profile.context";
import EditIcon from "../icons/edit.icon.component";
import DeleteIcon from "../icons/delete.icon.component";
import CheckIcon from "../icons/check.icon.component";
import Modal from "../modal/modal.component";

const ToDos = () => {
  const [toDoList, setToDoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isEditToDo, setIsEditToDo] = useState(false);
  const [isDeleteToDo, setIsDeleteToDo] = useState(false);
  const [toDoInputs, setToDoInputs] = useState({
    id: "",
    title: "",
    description: "",
  });

  const { currentProfile } = useContext(ProfileContext);

  useEffect(() => {
    fetch(
      import.meta.env.VITE_TODO_API_URL +
        "/get-to-do-list?profileId=" +
        currentProfile?.id
    )
      .then((response) => response.json())
      .then((data) => {
        data.message
          ? (setMessage(data.message), setToDoList([]))
          : (setMessage(""), setToDoList(data.todos));

        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, [currentProfile]);

  const handleInput = (e) => {
    const newInputs = { ...toDoInputs };
    newInputs[e.target.id] = e.target.value;

    setToDoInputs(newInputs);
  };

  const handleAddToDo = (e) => {
    e.preventDefault();

    fetch(import.meta.env.VITE_TODO_API_URL + "/store-to-do", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileId: currentProfile.id,
        title: toDoInputs.title,
        description: toDoInputs.description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setModalMessage(`To Do ${data.todo.title} is now created.`);
          setToDoList(
            toDoList.length > 0 ? (todo) => [...todo, data.todo] : [data.todo]
          );
          setMessage("");
        }
      });
  };

  const handleConfirmToDo = (tdl) => {
    setToDoInputs({
      id: tdl.id,
      title: tdl.title,
      description: tdl.description,
    });
    setIsOpen(true);
  };

  const updateToDo = (e) => {
    e.preventDefault();

    fetch(import.meta.env.VITE_TODO_API_URL + "/update-to-do", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toDoId: toDoInputs.id,
        title: toDoInputs.title,
        description: toDoInputs.description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setModalMessage(`To Do ${data.todo.title} is now updated.`);
          toDoList.find((tdl) =>
            tdl.id === data.todo.id
              ? ((tdl.title = data.todo.title),
                (tdl.description = data.todo.description))
              : null
          );
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteToDo = () => {
    fetch(
      import.meta.env.VITE_TODO_API_URL +
        "/delete-to-do?toDoId=" +
        toDoInputs.id
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setModalMessage(`To Do ${data.todo.title} is now deleted.`);
          setToDoList((todos) =>
            todos.filter((todo) => todo.id != data.todo.id)
          );
        }
      });
  };

  const handleFinishToDo = (tdl) => {};

  const resetStates = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsDeleteToDo(false);
      setIsEditToDo(false);
      setModalMessage("");
      setToDoInputs({
        id: "",
        title: "",
        description: "",
      });
    }, 300);
  };

  if (isLoading) {
    return "Loading...";
  }

  return (
    <Fragment>
      <div className="">
        <h3 className="text-2xl">{currentProfile?.name}</h3>
        <button className="border-4" onClick={() => setIsOpen(true)}>
          create
        </button>
        {toDoList.length <= 0 ? (
          <p>No To Do list for the selected profile.</p>
        ) : (
          <div className="grid grid-cols-1">
            {toDoList?.map((tdl) => (
              <div className="flex items-center" key={tdl.id}>
                <CheckIcon
                  otherClass="w-6 h-6 text-gray-400 cursor-pointer"
                  onClick={handleFinishToDo(tdl)}
                />
                <div className="border border-black rounded-md my-3 py-2 px-3 relative w-full">
                  <EditIcon
                    otherClass="w-6 h-6 absolute right-12 text-yellow-600 cursor-pointer"
                    onClick={() => {
                      handleConfirmToDo(tdl);
                      setIsEditToDo(true);
                    }}
                  />
                  <DeleteIcon
                    otherClass="w-6 h-6 absolute right-2 text-red-700 cursor-pointer"
                    onClick={() => {
                      handleConfirmToDo(tdl);
                      setIsDeleteToDo(true);
                    }}
                  />
                  <h4>{tdl.title}</h4>
                  <p>{tdl.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal openModal={isOpen}>
        {modalMessage ? (
          <div>
            <p>{modalMessage}</p>
            <button className="border-4" onClick={resetStates}>
              Okay
            </button>
          </div>
        ) : isDeleteToDo ? (
          <div>
            <p>
              Are you sure you want to delete your To Do, {toDoInputs.title}?
            </p>
            <div className="flex">
              <button className="border-4" onClick={deleteToDo}>
                Yes
              </button>
              <button className="border-4" onClick={resetStates}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={isEditToDo ? updateToDo : handleAddToDo}>
            <div className="grid grid-cols-1">
              <input
                placeholder="Title"
                id="title"
                type="text"
                value={toDoInputs.title}
                onChange={(e) => handleInput(e)}
                className="border-2 border-black"
              />
              <textarea
                placeholder="Description (Optional)"
                id="description"
                value={toDoInputs.description}
                onChange={(e) => handleInput(e)}
                className="border-2 border-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <button type="submit">save</button>
              <button type="button" onClick={resetStates}>
                cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Fragment>
  );
};

export default ToDos;
