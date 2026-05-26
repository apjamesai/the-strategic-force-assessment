import React, { createContext, useContext } from 'react';

const SkinContext = createContext(null);

export function SkinProvider({ skin, children }) {
  return <SkinContext.Provider value={skin}>{children}</SkinContext.Provider>;
}

export function useSkin() {
  return useContext(SkinContext);
}

export function useChoreoOverrides() {
  const skin = useSkin();
  return skin?.choreoOverrides;
}

export function useDiscOverrides() {
  const skin = useSkin();
  return skin?.discOverrides;
}
