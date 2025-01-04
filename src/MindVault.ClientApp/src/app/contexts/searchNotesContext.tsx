"use client"

import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import INote from "../Interfaces/INote";

const SearchNotesContext = createContext<{
  searchedNotes: INote[];
  loadingNotes: boolean,
  setLoadingNotes: Dispatch<SetStateAction<boolean>>,
  setSearchedNotes: Dispatch<SetStateAction<INote[]>>,
  filterActive: boolean,
  setFilterActive: Dispatch<SetStateAction<boolean>>
}>({
  searchedNotes: [],
  loadingNotes: false,
  setLoadingNotes: () => {},
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
  const [loadingNotes, setLoadingNotes] = useState(false);

  return (
    <SearchNotesContext.Provider value={{searchedNotes, loadingNotes, setLoadingNotes, setSearchedNotes, filterActive, setFilterActive}}>
      {children}
    </SearchNotesContext.Provider>
  );
};
