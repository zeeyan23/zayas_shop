import { createContext, useContext, useState } from 'react';

const FavContext = createContext();

export const FavProvider = ({ children }) => {
  const [fav, setFav] = useState(null);

  const updateFav = (newFav) => {
    setFav(newFav);
  };

  return (
    <FavContext.Provider value={{ fav, updateFav }}>
      {children}
    </FavContext.Provider>
  );
};

export const favData = () => {
  return useContext(FavContext);
};
