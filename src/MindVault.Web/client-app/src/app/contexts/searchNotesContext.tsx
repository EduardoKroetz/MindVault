"use client"

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import INote from "../Interfaces/INote";

const SearchNotesContext = createContext<{
  searchedNotes: INote[];
  setSearchedNotes: Dispatch<SetStateAction<INote[]>>,
  filterActive: boolean,
  setFilterActive: Dispatch<SetStateAction<boolean>>
}>({
  searchedNotes: [],
  setSearchedNotes: () => {},
  filterActive: false,
  setFilterActive: () => {}
});

export const useSearchNotes = () => {
  const context = useContext(SearchNotesContext);
  if (!context) {
    throw new Error("useSearchNotes must be used within a SearchNotesProvider");
  }
  return context;
};

export const SearchNotesProvider = ({ children }: any) => {
  const [searchedNotes, setSearchedNotes] = useState<INote[]>([]);
  const [filterActive, setFilterActive] = useState(false);

  return (
    <SearchNotesContext.Provider value={{searchedNotes, setSearchedNotes, filterActive, setFilterActive}}>
      {children}
    </SearchNotesContext.Provider>
  );
};
