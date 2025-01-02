import ICategory from "@/app/Interfaces/ICategory";
import { Dispatch, SetStateAction } from "react";
import CategoryBadge from "../category-badge";

interface SelectCategoriesProps
{
  categories: ICategory[], 
  selectedCategories: ICategory[],
  setSelectedCategories: Dispatch<SetStateAction<ICategory[]>>
}

export default function SelectCategories({ categories, selectedCategories, setSelectedCategories } : SelectCategoriesProps)
{
  const addCategory = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category && !selectedCategories.find((x) => x.id === category.id)) {
      setSelectedCategories((v) => [...v, category]);
    }
  };

  const removeCategory = (categoryId: number) => {
    const filteredCategories = selectedCategories.filter(c => c.id != categoryId);
    setSelectedCategories(filteredCategories)
  }

  return (
    <>
      <select className="form-select" id="floatingCategories" aria-label="Default select"
        onChange={(e) => addCategory(Number(e.target.value))}
        value="">
        <option value="">Selecione categorias</option>
        { categories.map(c => (
          <option key={c.id} value={c.id}>{ c.name }</option>
        )) }
      </select>
      <div className="mt-1 d-flex gap-1">
        {selectedCategories.map(c => (
          <CategoryBadge key={`selected-c-${c.id}`} category={c}>
            <i onClick={() => removeCategory(c.id)} style={{ cursor: 'pointer' }} className="bi-x"></i>
          </CategoryBadge>
        )) }
      </div>
    </>


  )
}