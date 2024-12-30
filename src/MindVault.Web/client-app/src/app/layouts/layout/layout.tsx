import Header from "@/app/components/header/header"
import styles from "./layout.module.css"

export default function Layout({ children } : any)
{
  return (
    <div className={styles.layout}>
      <Header></Header>
      <main>
        {children}
      </main>
    </div>
  )
}