import { useEffect, useState } from "react"
import { useCategories } from "@/app/contexts/categoriesContext";
import ICategory from "@/app/Interfaces/ICategory";
import { Badge, Button, Dropdown, DropdownMenu, DropdownToggle, Input, ListGroup, ListGroupItem, UncontrolledDropdown } from "reactstrap";
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
  const { setSearchedNotes, setFilterActive, setLoadingNotes } = useSearchNotes()
  const [categoryDPIsOpen, setCategoryDPIsOpen] = useState(false);
  const [dateDPIsOpen, setDateDPIsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 600)

    return () => clearTimeout(handler)
  }, [searchTerm])

  const fetchNotes = async () => {
    setLoadingNotes(true);
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
    setLoadingNotes(false)
  }

  useEffect(() => {
    if (debouncedTerm.length === 0 && !date && !category)
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
    <>
      <div className="d-flex gap-1 flex-grow-1">
        <div className="input-group flex-grow-1">
          <i className="input-group-text bi-filter" id="addon-wrapping" />
          <input type="text" className="form-control flex-grow-1" placeholder="Procurar anotações" aria-label="Procurar anotações" aria-describedby="addon-wrapping"
            onChange={(ev) => setSearchTerm(ev.target.value)}
            value={searchTerm}/>
        </div>
        <Dropdown toggle={toggleDateDP} isOpen={dateDPIsOpen} className="dropdown">
          <DropdownToggle 
            caret
            id="dropdownDateButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Data
          </DropdownToggle>
          <div className="dropdown-menu p-2" aria-labelledby="dropdownDateButton">
            <div className="d-flex gap-2">
              <Input
                type="date"
                onChange={(ev) => setSelectedDate(ev.target.value)}
                value={selectedDate} 
              />
              <Button onClick={filterDate} type="button" color="primary">Filtrar</Button>
            </div>
          </div>
        </Dropdown>
        <Dropdown isOpen={categoryDPIsOpen} toggle={toggleCategoryDP}>
          <DropdownToggle data-bs-toggle="dropdown" caret aria-expanded="false">
            Categoria
          </DropdownToggle>
          <div className="dropdown-menu p-2">
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
          </div>
        </Dropdown>
      </div>
      <div className="mt-2 d-flex gap-2">
        {debouncedTerm.length > 0 && (
          <Badge className="d-flex align-items-center" color="info">
            { debouncedTerm }
            <i className="bi-x-lg d-flex ms-2" onClick={() => {setDebouncedTerm(''); setSearchTerm('')}}></i>
          </Badge>
        )}
        {category && (
          <CategoryBadge category={category}>
            <i className="bi-x-lg d-flex ms-2" onClick={() => setCategory(null)}></i>
          </CategoryBadge>
        )}
        {date && (
          <Badge className="d-flex align-items-center" color="warning">
            { DateUtils.FormatDateOnly(date) }
            <i className="bi-x-lg d-flex ms-2" onClick={() => setDate(null)}></i>
          </Badge>
        )}
      </div>
    </>
  )
}