import * as React from "react"
import { useCallback, useState, useEffect, useRef } from "react"

import { AgGridColumn, AgGridReact } from "ag-grid-react"
import Button from "@material-ui/core/Button"
import RefreshIcon from "@material-ui/icons/Refresh"
import ControlPointIcon from "@material-ui/icons/ControlPoint"

import { getPatients } from "../../api"

import "ag-grid-community/dist/styles/ag-theme-material.css"
import * as styles from "./patients-table.module.scss"

const PatientsTable = () => {
  // component data
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // components state
  const [agGridApi, setAgGridApi] = useState(null)
  const isMounted = useRef(true)

  // agGrid callbacks
  const resizeGridCallback = useCallback(
    () => setTimeout(() => agGridApi?.sizeColumnsToFit()),
    [agGridApi]
  )
  const onGridReady = useCallback(
    params => {
      setAgGridApi(params.api)
      params.api.sizeColumnsToFit()
      window.addEventListener("resize", resizeGridCallback)
    },
    [resizeGridCallback]
  )

  // action buttons callbacks
  const refreshPatients = useCallback(async () => {
    setIsLoading(true)
    const _patients = await getPatients()

    if (isMounted.current) {
      setPatients(_patients)
      setIsLoading(false)
    }
  }, [])

  // fetch the first batch of patients
  useEffect(
    () =>
      (async () => {
        setIsLoading(true)
        const _patients = await getPatients()

        if (isMounted.current) {
          setPatients(_patients)
          setIsLoading(false)
        }
      })(),
    []
  )

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => (isMounted.current = false)
  }, [])

  // remove grid resize listener
  useEffect(() => {
    return () => window.removeEventListener("resize", resizeGridCallback)
  }, [resizeGridCallback])

  // show loading overlay when the time is right
  useEffect(() => {
    if (isLoading) {
      agGridApi?.showLoadingOverlay()
    } else {
      agGridApi?.hideOverlay()
    }
  }, [isLoading, agGridApi])

  // overlay templates
  const overlayLoading = `<span className="ag-overlay-loading-center">正在努力加载中...</span>`

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        <Button variant="outlined" onClick={refreshPatients}>
          <RefreshIcon />
          刷新
        </Button>
        <div className={styles.spacer}></div>
        <Button variant="contained" color="primary" disableElevation>
          <ControlPointIcon />
          导入病人
        </Button>
      </div>
      <div className={`${styles.tableContainer} ag-theme-material`}>
        <AgGridReact
          overlayLoadingTemplate={overlayLoading}
          rowData={patients}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          style={{ width: "100%" }}
          suppressCellSelection={true}
        >
          <AgGridColumn headerName="ID" field="id" />
          <AgGridColumn headerName="姓名" field="name" />
          <AgGridColumn headerName="性别" field="gender" />
          <AgGridColumn headerName="年龄" field="age" />
          <AgGridColumn headerName="民族" field="ethnicity" />
        </AgGridReact>
      </div>
    </div>
  )
}

export default PatientsTable
