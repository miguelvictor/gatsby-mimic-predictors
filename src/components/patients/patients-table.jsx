import * as React from "react"
import { useState } from "react"

import Button from "@material-ui/core/Button"
import { AgGridColumn, AgGridReact } from "ag-grid-react"

import * as styles from "./patients-table.module.scss"

const PatientsTable = () => {
  const [rowData, _] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        <Button variant="outlined">刷新</Button>
        <div className={styles.spacer}></div>
        <Button variant="contained" color="primary" disableElevation>
          导入病人
        </Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact rowData={rowData}>
          <AgGridColumn field="make"></AgGridColumn>
          <AgGridColumn field="model"></AgGridColumn>
          <AgGridColumn field="price"></AgGridColumn>
        </AgGridReact>
      </div>
    </div>
  )
}

export default PatientsTable
