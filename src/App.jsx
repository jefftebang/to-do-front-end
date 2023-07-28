import { Fragment, useEffect, useState } from "react";
import Modal from "./components/modal/modal.component";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState("");
  const [currentProfileId, setCurrentProfileId] = useState("");
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isDeleteProfile, setIsDeleteProfile] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    getProfiles();
  }, []);

  const getProfiles = () => {
    fetch(import.meta.env.VITE_TODO_API_URL + "/get-profiles")
      .then((response) => response.json())
      .then((data) => {
        setProfiles(data.profiles);
        setCurrentProfileId(data.default.id);
      })
      .catch((error) => console.log(error));
  };

  const submitProfileHandler = (e) => {
    e.preventDefault();

    fetch(import.meta.env.VITE_TODO_API_URL + "/store-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setModalMessage(`Profile ${data.profile.name} is now created.`);
          setName("");
          setProfiles((profiles) => [
            data.profile,
            ...profiles.sort((a, b) => (a.name > b.name ? 1 : -1)),
          ]);
          setCurrentProfileId(data.profile.id);
        }
      })
      .catch((error) => console.log(error));
  };

  const editProfile = () => {
    const profile = profiles.find((prof) => prof.id == currentProfileId);
    setIsEditProfile(true);
    setName(profile.name);
    setIsOpen(true);
  };

  const updateProfile = (e) => {
    e.preventDefault();

    fetch(import.meta.env.VITE_TODO_API_URL + "/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileId: currentProfileId,
        name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setModalMessage(`Profile ${data.profile.name} is now updated.`);
          setName("");
          profiles.find((prof) =>
            prof.id == currentProfileId ? (prof.name = data.profile.name) : null
          );
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteProfileConfirm = () => {
    const profile = profiles.find((prof) => prof.id == currentProfileId);
    setIsDeleteProfile(true);
    setName(profile.name);
    setIsOpen(true);
  };

  const deleteProfile = () => {
    fetch(import.meta.env.VITE_TODO_API_URL + "/delete-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileId: currentProfileId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setModalMessage(`Profile ${data.profile.name} is now deleted.`);
          setProfiles((profs) =>
            profs.filter((prof) => prof.id != data.profile.id)
          );
          const defProf = profiles.find((prof) => prof.is_default === 1);
          setCurrentProfileId(defProf.id);
        }
      })
      .catch((error) => console.log(error));
  };

  const resetStates = () => {
    setIsOpen(false);
    setIsEditProfile(false);
    setIsDeleteProfile(false);
    setTimeout(() => {
      setModalMessage("");
      setName("");
    }, 500);
  };

  return (
    <Fragment>
      <div>
        <h3 className="font-medium">Profiles:</h3>
        <select
          onChange={(e) => setCurrentProfileId(e.target.value)}
          value={currentProfileId}
        >
          {profiles.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.name}
            </option>
          ))}
        </select>
        <button className="border-4" onClick={() => setIsOpen(true)}>
          create profile
        </button>
        <button className="border-4" onClick={editProfile}>
          edit profile
        </button>
        <button className="border-4" onClick={deleteProfileConfirm}>
          delete profile
        </button>
      </div>
      <Modal openModal={isOpen}>
        {modalMessage ? (
          <div>
            <p>{modalMessage}</p>
            <button className="border-4" onClick={resetStates}>
              Okay
            </button>
          </div>
        ) : isDeleteProfile ? (
          <Fragment>
            <p>Are you sure you want to delete your profile, {name}?</p>
            <div className="flex">
              <button className="border-4" onClick={deleteProfile}>
                Yes
              </button>
              <button className="border-4" onClick={resetStates}>
                Cancel
              </button>
            </div>
          </Fragment>
        ) : (
          <form onSubmit={isEditProfile ? updateProfile : submitProfileHandler}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="border-4">
              save
            </button>
            <button type="button" className="border-4" onClick={resetStates}>
              cancel
            </button>
          </form>
        )}
      </Modal>
    </Fragment>
  );
};

export default App;
