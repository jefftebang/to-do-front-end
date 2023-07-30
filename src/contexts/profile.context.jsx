import { createContext, useState } from "react";

export const ProfileContext = createContext(undefined);

export const ProfileProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState(null);

  const value = {
    currentProfile,
    setCurrentProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
