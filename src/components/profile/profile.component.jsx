import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { ProfileContext } from "../../contexts/profile.context";
import Modal from "../modal/modal.component";
import AddIcon from "../icons/add.icon.component";
import EditIcon from "../icons/edit.icon.component";
import DeleteIcon from "../icons/delete.icon.component";
import DefaultIcon from "../icons/default.icon.component";
import Button from "../button/button.component";
import InputField from "../input-field.component";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [currentProfileId, setCurrentProfileId] = useState("");
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isDeleteProfile, setIsDeleteProfile] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState([]);

  const { currentProfile, setCurrentProfile } = useContext(ProfileContext);

  useEffect(() => {
    let controller = new AbortController();
    fetch(import.meta.env.VITE_TODO_API_URL + "/get-profiles", {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        setProfiles(data.profiles);
        setCurrentProfileId(data.default.id);
        setCurrentProfile(data.default);
        setIsLoading(false);
        controller = null;
      })
      .catch((error) => console.log(error));

    return () => controller?.abort();
  }, []);

  const handleProfileChange = (e) => {
    setCurrentProfileId(e.target.value);
    const profile = profiles.find((prof) => prof.id == e.target.value);
    setCurrentProfile(profile);
  };

  const handleInputChange = (e) => {
    e.target.value.length <= 0 ? setDisabledBtn(true) : setDisabledBtn(false);
    setName(e.target.value);
    setErrors([]);
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    setIsFetching(true);

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
        if (data.success) {
          profiles.filter((prof) => (prof.is_default = 0));
          setModalMessage(
            <p className="mb-5 text-lg">
              Profile
              <span className="font-medium"> {data.profile.name} </span>
              is now created.
            </p>
          );
          setName("");
          setProfiles((profiles) => [
            data.profile,
            ...profiles.sort((a, b) => (a.name > b.name ? 1 : -1)),
          ]);
          setCurrentProfileId(data.profile.id);
          setCurrentProfile(data.profile);
        } else if (data.error) {
          setErrors(data.error);
          console.log(data);
        }
        setIsFetching(false);
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
    setIsFetching(true);

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
        if (data.success) {
          setModalMessage(
            <p className="mb-5 text-lg">
              Profile
              <span className="font-medium"> {data.profile.name} </span>
              is now updated.
            </p>
          );
          setCurrentProfile(data.profile);
          setName("");
          profiles.find((prof) =>
            prof.id == currentProfileId ? (prof.name = data.profile.name) : null
          );
        } else if (data.error) {
          setErrors(data.error);
          console.log(data);
        }
        setIsFetching(false);
      })
      .catch((error) => console.log(error));
  };

  const deleteProfileConfirm = () => {
    setIsDeleteProfile(true);
    setName(currentProfile.name);
    setIsOpen(true);
  };

  const deleteProfile = () => {
    setIsFetching(true);

    fetch(
      import.meta.env.VITE_TODO_API_URL +
        "/delete-profile?profileId=" +
        currentProfileId
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setModalMessage(
            <p className="mb-5 text-lg">
              Profile
              <span className="font-medium"> {data.profile.name} </span>
              is now deleted.
            </p>
          );
          setProfiles((profs) =>
            profs.filter((prof) => prof.id != data.profile.id)
          );
          const defProf = profiles.find((prof) => prof.is_default === 1);
          setCurrentProfile(defProf);
          setCurrentProfileId(defProf.id);
        } else if (data.error) {
          console.log(data);
        }
        setIsFetching(false);
      })
      .catch((error) => console.log(error));
  };

  const makeDefaultProfile = () => {
    fetch(
      import.meta.env.VITE_TODO_API_URL +
        "/make-default-profile?profileId=" +
        currentProfileId
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setModalMessage(
            <p className="mb-5 text-lg">
              Profile
              <span className="font-medium"> {data.profile.name} </span>
              is now the default profile.
            </p>
          );
          profiles.filter((prof) => (prof.is_default = 0));
          currentProfile.is_default = 1;
          setIsOpen(true);
        } else if (data.error) {
          console.log(data);
        }
      })
      .catch((error) => console.log(error));
  };

  const resetStates = () => {
    setIsOpen(false);
    setTimeout(() => {
      setErrors([]);
      setIsEditProfile(false);
      setIsDeleteProfile(false);
      setModalMessage("");
      setName("");
    }, 300);
  };

  if (isLoading) {
    return <p className="m-10">Loading profiles...</p>;
  }

  return (
    <Fragment>
      <div className="mx-auto flex">
        <div className="flex flex-col relative w-[480px]">
          <div className="flex items-center">
            <p className="text-gray-400 mr-2 text-lg">Profile</p>
            <div title="Create your profile.">
              <AddIcon
                otherClass="w-6 h-6 text-gray-400 hover:text-green-600 cursor-pointer transition-all"
                onClick={() => setIsOpen(true)}
              />
            </div>
            <div title="Edit this profile.">
              <EditIcon
                otherClass="w-5 h-5 mx-2 text-gray-400 hover:text-yellow-600 cursor-pointer transition-all"
                onClick={editProfile}
              />
            </div>
            <div
              title={`${
                currentProfile.is_default === 1 ||
                currentProfile.is_default === true
                  ? "You cannot delete the default profile."
                  : "Delete this profile."
              }`}
            >
              <DeleteIcon
                otherClass={`w-5 h-5 text-gray-400 ${
                  currentProfile.is_default !== 1 &&
                  currentProfile.is_default !== true
                    ? "hover:text-red-700 cursor-pointer"
                    : null
                } transition-all`}
                onClick={
                  currentProfile.is_default !== 1 &&
                  currentProfile.is_default !== true
                    ? deleteProfileConfirm
                    : null
                }
              />
            </div>
            <div
              title={`${
                currentProfile.is_default === 1 ||
                currentProfile.is_default === true
                  ? "This is your default profile."
                  : "Make this your default profile."
              }`}
            >
              <DefaultIcon
                isActive={
                  currentProfile.is_default === 1 ||
                  currentProfile.is_default === true
                    ? true
                    : false
                }
                otherClass={`w-6 h-6 ml-2 text-${
                  currentProfile.is_default === 1 ||
                  currentProfile.is_default === true
                    ? "blue-600"
                    : "gray-400 hover:text-blue-600 cursor-pointer"
                }  transition-all`}
                onClick={
                  currentProfile.is_default !== 1 &&
                  currentProfile.is_default !== true
                    ? makeDefaultProfile
                    : null
                }
              />
            </div>
          </div>
          <select
            className="appearance-none bg-transparent absolute bottom-0 opacity-0 w-[480px] h-[40px] cursor-pointer"
            onChange={(e) => handleProfileChange(e)}
            value={currentProfileId}
          >
            {profiles.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
          <h3 className="text-3xl">{currentProfile.name}</h3>
        </div>
      </div>

      <Modal openModal={isOpen} otherClass="max-w-[500px]">
        {modalMessage ? (
          <div className="text-center">
            {modalMessage}
            <Button btnType="blueBTN" onClick={resetStates}>
              Okay
            </Button>
          </div>
        ) : isDeleteProfile ? (
          <div>
            <p className="mb-5 text-center text-lg">
              Are you sure you want to delete your profile,
              <br />
              <span className="font-medium">{name}</span>?
            </p>
            <p className="text-gray-500 text-sm text-center">
              <span className="font-medium text-gray-700">Note: </span>This will
              delete the To Do list under this profile.
            </p>
            <div className="grid grid-cols-2 gap-12 mt-7 px-16">
              <Button
                btnIsDisabled={isFetching}
                btnType="blueBTN"
                onClick={deleteProfile}
              >
                Yes
              </Button>
              <Button
                btnIsDisabled={isFetching}
                btnType="redBTN"
                onClick={resetStates}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={isEditProfile ? updateProfile : handleCreateProfile}
            className="flex flex-col"
          >
            <p className="text-center text-lg">
              {isEditProfile ? "Edit" : "Create"} Profile
            </p>

            <InputField
              requestErrors={errors}
              setMaxLength="30"
              placeholder="Profile name"
              containerClass="my-5"
              otherClass="w-[300px] mb-1"
              value={name}
              onChangeProp={(e) => handleInputChange(e)}
              type="text"
            />
            <div className="grid grid-cols-2 gap-12">
              <Button
                btnIsDisabled={disabledBtn || isFetching || name.length <= 0}
                type="submit"
                btnType="blueBTN"
              >
                Save
              </Button>
              <Button
                btnIsDisabled={isFetching}
                type="button"
                btnType="redBTN"
                onClick={resetStates}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </Fragment>
  );
};

export default Profile;
