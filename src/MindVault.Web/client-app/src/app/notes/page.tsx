"use client"

import SearchNotes from "../components/search-notes";
import { useNotes } from "../contexts/notesContext";
import Layout from "../layouts/layout/layout";
import styles from "./page.module.css";
import NoteAccordion from "../components/note-accordion";
import CreateNote from "../components/create-note";

export default function Notes() {
  const { dates, hasDatesNextPage, totalNotes } = useNotes();

  return (
    <Layout>
      <div className={"container-fluid " + styles.page}>
        <div className="mb-3">
          <CreateNote />
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
          {hasDatesNextPage && (
            <button className="btn btn-secondary">Carregar mais</button>
          )}
        </div>
      </div>
    </Layout>
  );
}
