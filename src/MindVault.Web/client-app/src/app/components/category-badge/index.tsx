import ICategory from "@/app/Interfaces/ICategory";
import ColorUtils from "@/app/Utils/ColorUtils";
import { ReactNode } from "react";

export default function CategoryBadge({ category, children } : { category: ICategory, children?: ReactNode })
{
  return (
    <span>
      <span className="badge mx-1 d-flex align-items-center gap-1" style={{backgroundColor: category.color, color: ColorUtils.getTextColorForBackground(category.color)}}>
        {category.name}
        { children }
      </span>
    </span>
  )
}