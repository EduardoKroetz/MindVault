import NoteItem from "../components/note-item/note-item";
import SearchNotes from "../components/search-notes/search-notes";
import Layout from "../layouts/layout/layout";
import styles from "./page.module.css";

export default function Notes() {
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
          <p>50 anotações</p>
        </div>
        <div className={styles.notes}>
        <div className="accordion" id="accordionPanelsStayOpenExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                30/12/2024
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
              <div className="accordion-body">
                <ul className="list-group">
                  <NoteItem />
                </ul>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
