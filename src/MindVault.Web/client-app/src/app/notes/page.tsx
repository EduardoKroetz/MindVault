"use client"

import { useEffect } from "react";
import SearchNotes from "../components/search-notes";
import { useNotes } from "../contexts/notesContext";
import Layout from "../layouts/layout/layout";
import styles from "./page.module.css";
import NoteAccordion from "../components/note-accordion";

export default function Notes() {
  const { dates, fetchDates, hasDatesNextPage, totalNotes } = useNotes();

  useEffect(() => {
    fetchDates();
  }, [])

  return (
    <Layout>
      <div className={"container-fluid " + styles.page}>
        <div className="mb-3">
          <button className="btn btn-primary gap-2 d-flex">
            <i className="bi-plus"></i>
            Criar Anotação
          </button>
        </div>
        <SearchNotes />
        <div className={styles.info}>
          <p>{ totalNotes } { totalNotes > 1 ? 'anotações' : 'anotação' }</p>
        </div>
        <div className={styles.notes}>
        <div className="accordion" id="accordionPanelsStayOpenExample">
          {dates.map((d) => (
            <NoteAccordion key={d.toString()} date={d}/>
          ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
