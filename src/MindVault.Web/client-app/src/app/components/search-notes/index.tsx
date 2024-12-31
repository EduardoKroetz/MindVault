import styles from "./styles.module.css"

export default function SearchNotes()
{
  return (
    <div className={styles.search}>
      <div className="input-group flex-nowrap">
        <i className="input-group-text bi-filter" id="addon-wrapping" />
        <input type="text" className="form-control" placeholder="Procurar anotações" aria-label="Procurar anotações" aria-describedby="addon-wrapping" />
      </div>
      <div className="dropdown">
        <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
          Data
        </button>
        <form className="dropdown-menu p-2">
          <div className="d-flex gap-2">
            <input type="date" className="form-control"/>
            <button type="submit" className="btn btn-primary">Filtrar</button>          
          </div>
        </form>
      </div>
      <div className="dropdown">
        <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
          Categoria
        </button>
        <form className="dropdown-menu p-2">
          <div className="d-flex gap-2">
            <input type="date" className="form-control"/>
            <button type="submit" className="btn btn-primary">Filtrar</button>          
          </div>
        </form>
      </div>
    </div>
  )
}