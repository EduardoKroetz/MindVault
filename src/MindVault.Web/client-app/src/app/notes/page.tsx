"use client"

import SearchNotes from "../components/search-notes";
import { useNotes } from "../contexts/notesContext";
import Layout from "../layouts/layout/layout";
import styles from "./page.module.css";
import NoteAccordion from "../components/note-accordion";
import CreateNote from "../components/create-note";
import { useSearchNotes } from "../contexts/searchNotesContext";
import { ListGroup, ListGroupItem } from "reactstrap";
import NoteItem from "../components/note-item";

export default function Notes() {
  const { dates, hasDatesNextPage, totalNotes } = useNotes();
  const { searchedNotes, filterActive } = useSearchNotes()

  return (
    <Layout>
      <div className={"container-fluid " + styles.page}>
        <div className="mb-3">
          <CreateNote />
        </div>
        <SearchNotes />
        <div className={styles.info}>
          {filterActive ? (
            <p>{ searchedNotes.length } { searchedNotes.length === 1 ? 'resultado' : 'resultados' }</p>
          ) : (
            <p>{ totalNotes } { totalNotes === 1 ? 'anotação' : 'anotações' }</p>
          )}
        </div>
        <div className={styles.notes}>
          {filterActive ? (
            <ListGroup>
              {searchedNotes.map(n => (
                <NoteItem key={n.id} note={n} />
              ))}
            </ListGroup>
          ) 
          : (
            <>
              <div className="accordion" id="accordionPanelsStayOpenExample">
                {dates.map((d) => (
                  <NoteAccordion key={d.toString()} date={d}/>
                ))}
              </div>
              {hasDatesNextPage && (
                <button className="btn btn-secondary">Carregar mais</button>
              )}
            </>

          )}

          </div>
      </div>
    </Layout>
  );
}
