"use client"

import DateUtils from "@/app/Utils/DateUtils";
import NoteItem from "../note-item";
import { useEffect, useState } from "react";
import { useNotes } from "@/app/contexts/notesContext";
import INote from "@/app/Interfaces/INote";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

export default function NoteAccordion({ date } : { date: Date} )
{
  const [open, setOpen] = useState<string | string[]>([]);
  const [notes, setNotes] = useState<INote[]>([]) // Anotações de X data
  const [pageNumber, setPageNumber] = useState(1);
  const { fetchNotes, notes: memoryNotes, filterMemoryNotes } = useNotes();
  const pageSize = 20;

  useEffect(() => {
    let notes = filterMemoryNotes(date);
    if (notes.length > 0)
      setNotes(notes)

  }, [memoryNotes])

  const toggle = (id: string) => {
    setOpen(open === id ? [] : id);

    if (open)
      handleGetNotes()
  };

  const handleGetNotes = async () =>
  {
    let notes = filterMemoryNotes(date);
    if (notes.length === 0)
      notes = await fetchNotes(date, pageNumber, pageSize)

    setNotes(notes)
  }

  return (
    <Accordion open={open} toggle={toggle}>
      <AccordionItem>
        <AccordionHeader targetId={date.toString()}>
          {DateUtils.FormatDateOnly(date)}
        </AccordionHeader>
        <AccordionBody accordionId={date.toString()}>
          <ul className="list-group">
            {notes.map((note) => (
              <NoteItem note={note} key={note.id} />
            ))}
          </ul>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  )
}