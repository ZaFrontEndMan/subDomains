import React, { useState, useEffect, useMemo } from "react";

// Custom
import { useHandleMessage } from "hooks";
import Table from "components/Table/Table";
import { Actions } from "components/UI";
import exportExcel from "utils/useExportExcel";


export default function TableComponent() {
  const [data, setData] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const handleMessage = useHandleMessage();

  const columns = useMemo(() => [
    {
      name: "ID",
      selector: (row) => row.id,
      getValue: (row) => `id:${row.id}`,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "ID",
      selector: (row) => row.id,
      noExport: true,
      sortable: true,
    },
  ], []);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleExportExcel = async (name = "test table") => {
    setExportingExcel(true);
    await exportExcel(data, columns, name, handleMessage);
    setTimeout(() => {
      setExportingExcel(false);
    }, 1000);
  };


  return (
    <div className="mb-4">
      <Table
        actions={
          <Actions
            addMsg={"Add Test"}

            onClickAdd={() => console.log("router push")}
            onClickPrint={() => console.log("Abdo")}

            onClickExport={() => handleExportExcel("test")}
            isDisabledExport={exportingExcel}
          />
        }
        data={data}
        columns={columns}
        noHeader={true}
        pagination={true}
        paginationPerPage={10}
        // paginationRowsPerPageOptions={[10, 20, 30]}
        loading={loading}
      // Additional props specific to DataTable can be added here
      />
    </div>
  )
}