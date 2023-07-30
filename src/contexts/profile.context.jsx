import { createContext, useState } from "react";

export const ProfileContext = createContext(undefined);

export const ProfileProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  const value = {
    currentProfile,
    setCurrentProfile,
    currentProfileId,
    setCurrentProfileId,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
