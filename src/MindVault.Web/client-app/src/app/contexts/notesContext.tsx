"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useToastMessage from "../hooks/useToastMessage";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";
import INote from "../Interfaces/INote";
import DateUtils from "../Utils/DateUtils";
import IResponse from "../Interfaces/IResponse";
import { useAccount } from "./accountContext";

const NotesContext = createContext<{
  notes: INote[];
  dates: Date[];
  loadingDates: boolean,
  addNote: (noteId: number) => Promise<void>,
  updateNote: (note: INote) => void,
  removeNote: (note: INote) => void,
  fetchNotes: (date: Date, pageNumber: number, pageSize: number) => Promise<INote[]>
  filterMemoryNotes: (date: Date) => INote[]
  hasDatesNextPage: boolean,
  totalNotes: number,
}>({
  notes: [],
  dates: [],
  loadingDates: true,
  async addNote() {},
  updateNote: () => {},
  removeNote: () => {},
  filterMemoryNotes: () => [],
  async fetchNotes() { return [] },
  hasDatesNextPage: true,
  totalNotes: 0
});

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export const NotesProvider = ({ children }: any) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [page, setPage] = useState(1);
  const [hasDatesNextPage, setHasNextPage] = useState(true);
  const [totalNotes, setTotalNotes] = useState(0);
  const pageSize = 20;
  const showToast = useToastMessage();
  const { account } = useAccount();
  const [firstLoad, setFirstLoad] = useState(true);
  

  useEffect(() => {
    if (account && firstLoad)
    {
      fetchDates()
      fetchTotalNotes();
      setFirstLoad(false)
    }

  }, [account])

  const fetchTotalNotes = async () => {
    try {
      var response = await axiosInstance.get(`/notes/search?pageNumber=1&pageSize=0`)
      setTotalNotes(response.data.totalCount);
    }catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  //Buscar datas que possuem anotações
  const fetchDates = async () => {
    setLoadingDates(true);
    try {
      var response = await axiosInstance.get(`/notes/dates?pageNumber=${page}&pageSize=${pageSize}`)
      setHasNextPage(response.data.hasNextPage);
      setDates(dates => [...dates, ...response.data.data])
      setTotalNotes(response.data.totalCount);
    }catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
    setLoadingDates(false);
  }

  const fetchNotes = async (date: Date, pageNumber: number, pageSize: number) => {
    const formatedDate = DateUtils.FormatToYYYYMMDD(date);

    try {
      const response = await axiosInstance.get(`/notes/search?pageNumber=${pageNumber}&pageSize=${pageSize}&date=${formatedDate}`)

      setNotes(notes => [...notes, ...response.data.data]);

      return response.data.data
    } catch (error: any) {
      showToast("Não foi possível obter as anotações", false)
    }
  }

  const filterMemoryNotes = (date: Date) : INote[] => {
    const formatedDate = DateUtils.FormatToYYYYMMDD(date);
    return notes.filter(x => DateUtils.FormatToYYYYMMDD(x.createdAt) == formatedDate)
  }

  const addNote = async (noteId: number) => {
    const getNoteResponse = await axiosInstance.get<IResponse<INote>>("/notes/"+noteId);
    const note = getNoteResponse.data.data;
    const noteDate = note.createdAt
    const formatedDate = DateUtils.FormatToYYYYMMDD(noteDate)
    setTotalNotes(t => t + 1);

    // Procurar se alguma data em memória corresponde com a data da anotação
    if (dates.find(d => DateUtils.FormatToYYYYMMDD(d) === formatedDate))
    {
      // Caso anotações NÃO tenham sido carregado em memória
      if (filterMemoryNotes(noteDate).length === 0)
        fetchNotes(noteDate, 1, 20); // Carregar em memória
      else // Se já foram carregadas, então adicionar
        setNotes(n => [note, ...n])
    }else { // Se não possui a data, então criar
      setDates(d => [noteDate, ...d])
      setNotes(n => [note, ...n])
    }
  }

  const updateNote = (note: INote) => {
    const noteIndex = notes.findIndex(x => x.id === note.id);
    if (noteIndex === -1)
      return

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = note;

    setNotes(updatedNotes);
  }

  const removeNote = (note: INote) => {

    setNotes(n => n.filter(x => x.id != note.id));
    setTotalNotes(t => t - 1);

    const noteDate = note.createdAt
    const formatedDate = DateUtils.FormatToYYYYMMDD(noteDate)

    // Procurar se alguma data em memória corresponde com a data da anotação
    if (dates.find(d => DateUtils.FormatToYYYYMMDD(d) === formatedDate))
    { 
      const notes = filterMemoryNotes(noteDate);
      if (notes.length === 1)      
        setDates(d => dates.filter(x => DateUtils.FormatToYYYYMMDD(x) != formatedDate))
    }
  }

  return (
    <NotesContext.Provider value={{notes, addNote, updateNote, removeNote, dates, loadingDates, fetchNotes, filterMemoryNotes ,hasDatesNextPage, totalNotes}}>
      {children}
    </NotesContext.Provider>
  );
};
