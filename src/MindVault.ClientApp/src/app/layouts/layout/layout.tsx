"use client"

import Header from "@/app/components/header"
import styles from "./layout.module.css"
import { useEffect } from "react";

export default function Layout({ children } : any)
{
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, [])

  return (
    <div className={styles.layout}>
      <Header></Header>
      <main className="p-3 flex-grow-1">
        {children}
      </main>
    </div>
  )
}