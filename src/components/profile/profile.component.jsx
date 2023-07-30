import { Fragment, useContext, useEffect, useState } from "react";
import Modal from "../modal/modal.component";
import { ProfileContext } from "../../contexts/profile.context";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState("");
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isDeleteProfile, setIsDeleteProfile] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { currentProfile, setCurrentProfile } = useContext(ProfileContext);

  useEffect(() => {
    fetch(import.meta.env.VITE_TODO_API_URL + "/get-profiles")
      .then((response) => response.json())
      .then((data) => {
        setProfiles(data.profiles);
        setCurrentProfileId(data.default.id);
        setCurrentProfile(data.default);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleProfileChange = (e) => {
    setCurrentProfileId(e.target.value);
    const profile = profiles.find((prof) => prof.id == e.target.value);
    setCurrentProfile(profile);
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
    setIsEditProfile(true);
    setName(currentProfile.name);
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
          setCurrentProfile(data.profile);
          setName("");
          profiles.find((prof) =>
            prof.id == currentProfileId ? (prof.name = data.profile.name) : null
          );
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteProfileConfirm = () => {
    setIsDeleteProfile(true);
    setName(currentProfile.name);
    setIsOpen(true);
  };

  const deleteProfile = () => {
    fetch(
      import.meta.env.VITE_TODO_API_URL +
        "/delete-profile?profileId=" +
        currentProfileId
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setModalMessage(`Profile ${data.profile.name} is now deleted.`);
          setProfiles((profs) =>
            profs.filter((prof) => prof.id != data.profile.id)
          );
          const defProf = profiles.find((prof) => prof.is_default === 1);
          setCurrentProfile(defProf);
          setCurrentProfileId(defProf.id);
        }
      })
      .catch((error) => console.log(error));
  };

  const resetStates = () => {
    setIsOpen(false);
    setIsEditProfile(false);
    setTimeout(() => {
      setIsDeleteProfile(false);
      setModalMessage("");
      setName("");
    }, 300);
  };

  if (isLoading) {
    return "Loading...";
  }

  return (
    <Fragment>
      <div className="flex h-screen border-r-2 border-black">
        <div className="bg-green-300">
          <h3 className="font-medium">Profiles:</h3>
          <select
            onChange={(e) => handleProfileChange(e)}
            value={currentProfileId}
          >
            {profiles.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
          <button className="border-4" onClick={() => setIsOpen(true)}>
            create
          </button>
          <button className="border-4" onClick={editProfile}>
            edit
          </button>
          <button className="border-4" onClick={deleteProfileConfirm}>
            delete
          </button>
        </div>
        <div className="bg-blue-300">
          <h3>{}</h3>
        </div>
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
          <div>
            <p>Are you sure you want to delete your profile, {name}?</p>
            <div className="flex">
              <button className="border-4" onClick={deleteProfile}>
                Yes
              </button>
              <button className="border-4" onClick={resetStates}>
                Cancel
              </button>
            </div>
          </div>
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

export default Profile;
