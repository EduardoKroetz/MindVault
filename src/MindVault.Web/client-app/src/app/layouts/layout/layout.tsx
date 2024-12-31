"use client"

import Header from "@/app/components/header"
import styles from "./layout.module.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Layout({ children } : any)
{
  return (
    <div className={styles.layout}>
      <Header></Header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}