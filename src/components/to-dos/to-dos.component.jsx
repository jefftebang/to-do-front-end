import { Fragment, useContext, useEffect, useState } from "react";
import { ProfileContext } from "../../contexts/profile.context";
import EditIcon from "../icons/edit.icon.component";
import DeleteIcon from "../icons/delete.icon.component";
import CheckIcon from "../icons/check.icon.component";
import Modal from "../modal/modal.component";
import Button from "../button/button.component";
import InputField from "../input-field.component";

const ToDos = () => {
  const [toDoList, setToDoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isEditToDo, setIsEditToDo] = useState(false);
  const [isDeleteToDo, setIsDeleteToDo] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [toDoInputs, setToDoInputs] = useState({
    id: "",
    title: "",
    description: "",
  });

  const { currentProfile } = useContext(ProfileContext);

  useEffect(() => {
    let controller = new AbortController();
    fetch(
      import.meta.env.VITE_TODO_API_URL +
        "/get-to-do-list?profileId=" +
        currentProfile?.id,
      {
        signal: controller.signal,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setToDoList(data.todos);
        setIsLoading(false);
        controller = null;
      })
      .catch((error) => console.log(error));

    return () => controller?.abort();
  }, [currentProfile]);

  const handleInput = (e) => {
    const newInputs = { ...toDoInputs };
    newInputs[e.target.id] = e.target.value;

    setToDoInputs(newInputs);
  };

  const handleCreateToDo = (e) => {
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
          setModalMessage(
            <p className="mb-5 text-lg">
              To Do
              <span className="font-medium"> {data.todo.title} </span>
              is now created.
            </p>
          );
          setToDoList(
            toDoList.length > 0 ? (todo) => [...todo, data.todo] : [data.todo]
          );
        }
      });
  };

  const handleConfirmToDo = (tdl) => {
    setToDoInputs({
      id: tdl.id,
      title: tdl.title,
      description: tdl.description ? tdl.description : "",
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
          setModalMessage(
            <p className="mb-5 text-lg">
              To Do
              <span className="font-medium"> {data.todo.title} </span>
              is now updated.
            </p>
          );
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
          setModalMessage(
            <p className="mb-5 text-lg">
              To Do
              <span className="font-medium"> {data.todo.title} </span>
              is now deleted.
            </p>
          );
          setToDoList((todos) =>
            todos.filter((todo) => todo.id !== data.todo.id)
          );
        }
      })
      .catch((error) => console.log(error));
  };

  const handleFinishToDo = (tdl) => {
    fetch(import.meta.env.VITE_TODO_API_URL + "/done-to-do?toDoId=" + tdl.id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          toDoList.find((tdl) =>
            tdl.id === data.toDo_Id ? (tdl.is_done = data.toDo_IsDone) : null
          );
          setIsTriggered(!isTriggered);
        }
      })
      .catch((error) => console.log(error));
  };

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
      <div className="mt-8">
        <div title="Add To Do entry.">
          <Button
            otherClass="w-full"
            btnType="grayBTN"
            onClick={() => setIsOpen(true)}
          >
            Create To Do Entry
          </Button>
        </div>
        {toDoList.length <= 0 ? (
          <p className="text-center text-gray-500 mt-5">
            No To Do list for the selected profile.
          </p>
        ) : (
          <div className="grid grid-cols-1">
            {toDoList?.map((tdl) => (
              <div className="flex items-center" key={tdl.id}>
                <CheckIcon
                  isActive={tdl.is_done === 1 ? true : false}
                  otherClass={`w-8 h-8 ${
                    tdl.is_done === 1
                      ? "text-green-600"
                      : "text-gray-400 hover:text-green-600"
                  } cursor-pointer mr-2 transition-all`}
                  onClick={() => handleFinishToDo(tdl)}
                />
                <div
                  className={`shadow-lg drop-shadow-lg rounded-md my-3 py-3 pl-5 pr-3 relative w-full transition-all duration-500 flex justify-between ${
                    tdl.is_done === 1
                      ? "bg-slate-300"
                      : "hover:shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] hover:bg-slate-200"
                  }`}
                >
                  <div className="mr-6 my-auto">
                    <h4
                      className={`font-medium ${
                        tdl.is_done === 1
                          ? "text-[#959494] line-through"
                          : "text-gray-800"
                      } transition-all`}
                    >
                      {tdl.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        tdl.is_done === 1
                          ? "text-[#b8b8b8] line-through"
                          : "text-gray-400"
                      } transition-all`}
                    >
                      {tdl.description}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <EditIcon
                      otherClass="w-5 h-5 text-gray-400 hover:text-yellow-600 cursor-pointer transition-all mb-2"
                      onClick={() => {
                        handleConfirmToDo(tdl);
                        setIsEditToDo(true);
                      }}
                    />
                    <DeleteIcon
                      otherClass="w-5 h-5 text-gray-400  hover:text-red-700 cursor-pointer transition-all"
                      onClick={() => {
                        handleConfirmToDo(tdl);
                        setIsDeleteToDo(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal openModal={isOpen}>
        {modalMessage ? (
          <div className="text-center">
            {modalMessage}
            <Button btnType="blueBTN" onClick={resetStates}>
              Okay
            </Button>
          </div>
        ) : isDeleteToDo ? (
          <div>
            <p className="mb-5 text-center text-lg">
              Are you sure you want to delete your To Do,
              <br />
              <span className="font-medium">{toDoInputs.title}</span>?
            </p>

            <div className="grid grid-cols-2 gap-12 mt-7 px-16">
              <Button btnType="blueBTN" onClick={deleteToDo}>
                Yes
              </Button>
              <Button btnType="redBTN" onClick={resetStates}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={isEditToDo ? updateToDo : handleCreateToDo}>
            <p className="text-center text-lg mb-5">
              {isEditToDo ? "Edit" : "Create"} To Do
            </p>
            <div className="grid grid-cols-1">
              <InputField
                placeholder="Title"
                id="title"
                otherClass="w-[500px]"
                value={toDoInputs.title}
                onChangeProp={(e) => handleInput(e)}
                type="text"
                maxLength="60"
              />
              <InputField
                placeholder="Description (Optional)"
                id="description"
                otherClass="my-5 h-24"
                value={toDoInputs.description}
                onChangeProp={(e) => handleInput(e)}
                maxLength="255"
                isTextArea={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-12 px-16">
              <Button type="submit" btnType="blueBTN">
                Save
              </Button>
              <Button type="button" btnType="redBTN" onClick={resetStates}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </Fragment>
  );
};

export default ToDos;
