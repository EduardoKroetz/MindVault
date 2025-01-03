import { useEffect, useState } from "react"
import { useCategories } from "@/app/contexts/categoriesContext";
import ICategory from "@/app/Interfaces/ICategory";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem } from "reactstrap";
import CategoryBadge from "../category-badge";
import DateUtils from "@/app/Utils/DateUtils";
import axiosInstance from "@/app/api/axios";
import useToastMessage from "@/app/hooks/useToastMessage";
import { useSearchNotes } from "@/app/contexts/searchNotesContext";

export default function SearchNotes()
{
  const [debouncedTerm, setDebouncedTerm] = useState(""); // O valor final após debounce
  const [date, setDate] = useState<Date | null>(null)
  const [category, setCategory] = useState<ICategory | null | undefined>(null)
  
  const [searchTerm, setSearchTerm] = useState(""); // O valor digitado pelo usuário
  const [selectedDate, setSelectedDate] = useState<string | number | readonly string[] | undefined>(DateUtils.FormatToYYYYMMDD(new Date(Date.now()))) // Controla o input do tipo data
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 20;
  
  const showToast = useToastMessage();
  const { categories } = useCategories();
  const { setSearchedNotes, setFilterActive } = useSearchNotes()
  const [categoryDPIsOpen, setCategoryDPIsOpen] = useState(false);
  const [dateDPIsOpen, setDateDPIsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 600)

    return () => clearTimeout(handler)
  }, [searchTerm])

  const fetchNotes = async () => {
    try {
      let formatedDate : string | null = date ? DateUtils.FormatToYYYYMMDD(date) : null;
      
      const url = `/notes/search?pageNumber=${pageNumber}&pageSize=${pageSize}` 
        + (formatedDate ? `&date=${formatedDate}` : '')
        + (category ? `&categoryId=${category?.id}` : '')
        + (debouncedTerm.length > 0 ? `&reference=${debouncedTerm}` : '')

      const response = await axiosInstance.get(url)
      setSearchedNotes(response.data.data);
      setHasNextPage(response.data.hasNextPage)
    }catch (error: any) {
      showToast("Não foi possível filtrar as anotações", false);
    }
  }

  useEffect(() => {
    if (!debouncedTerm && !date && !category)
    {
      setFilterActive(false);
      return;
    }

    setFilterActive(true)
    setPageNumber(1);
    fetchNotes();
  }, [debouncedTerm, date, category])

  const loadMoreNotes = () => {
    setPageNumber(v => v++);
    fetchNotes()
  } 

  // Ativar/desativar dropdowns
  const toggleCategoryDP = () => setCategoryDPIsOpen(v => !v);
  const toggleDateDP = () => setDateDPIsOpen(v => !v);

  // Selecionar categoria
  const selectCategory = (category: ICategory) => {
    setCategory(category);
    toggleCategoryDP()
  }

  // Filtrar data
  const filterDate = () => {   
    if (!selectedDate)
      return

    const convertedDate = DateUtils.ConvertToDate(selectedDate)
    if (!convertedDate)
      return

    setDate(convertedDate);
    toggleDateDP()
  }

  return (
    <div>
      <div className="d-flex gap-1 flex-grow-1">
        <div className="input-group flex-grow-1">
          <i className="input-group-text bi-filter" id="addon-wrapping" />
          <input type="text" className="form-control flex-grow-1" placeholder="Procurar anotações" aria-label="Procurar anotações" aria-describedby="addon-wrapping"
            onChange={(ev) => setSearchTerm(ev.target.value)}
            value={searchTerm}/>
        </div>
        <Dropdown isOpen={dateDPIsOpen} toggle={toggleDateDP}>
          <DropdownToggle caret className="d-flex align-items-center gap-2">
            Data
          </DropdownToggle>
          <DropdownMenu className="p-2">
            <div className="d-flex gap-2">
              <input type="date" className="form-control"
                onChange={(ev) => setSelectedDate(ev.target.value)}
                value={selectedDate}/>
              <button onClick={filterDate} type="submit" className="btn btn-primary">Filtrar</button>          
            </div>
          </DropdownMenu>
        </Dropdown>
        <Dropdown isOpen={categoryDPIsOpen} toggle={toggleCategoryDP}>
          <DropdownToggle caret className="d-flex align-items-center gap-2">
            Categoria
          </DropdownToggle>
          <DropdownMenu className="p-2">
            <ListGroup>
              {categories.map(c => (
                <ListGroupItem 
                  onClick={() => selectCategory(c)}
                  className={`list-group-item d-flex ${category?.id === c.id ? 'active' : ''}`}
                  style={{cursor: 'pointer'}} 
                  key={c.id}>
                    <p className="fw-bold" style={{color: category?.id === c.id ? 'white' : c.color}}>{ c.name }</p>
                </ListGroupItem>
              ))}
            </ListGroup>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="mt-2 d-flex">
        {category && (
          <CategoryBadge category={category}>
            <i className="bi-x-lg d-flex ms-2" onClick={() => setCategory(null)}></i>
          </CategoryBadge>
        )}
        {date && (
          <span className="badge d-flex align-items-center text-bg-warning">
            { DateUtils.FormatDateOnly(date) }
            <i className="bi-x-lg d-flex ms-2" onClick={() => setDate(null)}></i>
          </span>
        )}
      </div>
    </div>
  )
}