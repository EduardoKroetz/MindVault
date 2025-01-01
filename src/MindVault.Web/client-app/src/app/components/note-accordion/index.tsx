"use client"

import DateUtils from "@/app/Utils/DateUtils";
import NoteItem from "../note-item";
import { useEffect, useState } from "react";
import { useNotes } from "@/app/contexts/notesContext";
import INote from "@/app/Interfaces/INote";

export default function NoteAccordion({ date } : { date: Date} )
{
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<INote[]>([])
  const [pageNumber, setPageNumber] = useState(1);
  const { fetchNotes } = useNotes();
  const pageSize = 20;

  useEffect(() => {
    if (isOpen)
      handleGetNotes()
  },[isOpen])

  const handleGetNotes = async () =>
  {
    const notes = await fetchNotes(date, pageNumber, pageSize)
    setNotes(notes)
  }

  return (
    <div className="accordion-item">
      <h2 onClick={() => setIsOpen(v => !v)} className="accordion-header">
        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
          { DateUtils.FormatDateOnly(date) }
        </button>
      </h2>
      <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
        <div className="accordion-body">
          <ul className="list-group">
            { notes.map(x => (
              <NoteItem key={x.id}/>
            )) }
          </ul>
        </div>
      </div>
    </div>
  )
}