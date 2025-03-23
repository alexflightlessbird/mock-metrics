import React, { useEffect, useState, Suspense } from "react";
import { supabase } from "../services/supabaseClient";
import { Link, useSearchParams } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers";
import IconButton from "../components/common/buttons/IconButton";
import Breadcrumb from "antd/es/breadcrumb";
import Divider from "antd/es/divider";
import Tag from "antd/es/tag";
import Table from "antd/es/table";
import icons from "../utils/icons";

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the `caseId` from the query parameters
  const caseId = searchParams.get("caseId");

  // Fetch all cases when the component mounts
  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase.from("cases").select("*");
      if (error) {
        console.error("Error fetching cases:", error);
      } else {
        setCases(data);
      }
    };
    fetchCases();
  }, []);

  // Find the selected case from the `cases` array
  const selectedCase = caseId
    ? cases.find((c) => c.id === parseInt(caseId))
    : null;

  useEffect(() => {
    if (selectedCase) {
      setDocumentTitle({ title: selectedCase.name });
    } else {
      setDocumentTitle({ title: "Cases" });
    }
  }, [selectedCase]);

  const breadcrumbItems = selectedCase
    ? [{ title: <Link to="/cases">Cases</Link> }, { title: selectedCase?.name }]
    : [{ title: "Cases" }];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/cases?caseId=${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) => a.year - b.year,
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "descend",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "Civil" ? "#2dace6" : "#0a1f3c"}>{type}</Tag>
      ),
      filters: [
        { text: "Civil", value: "Civil" },
        { text: "Criminal", value: "Criminal" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      render: (area) => (
        <Tag
          color={
            area === "Invitationals/Regionals/ORCS" ? "#2dace6" : "#0a1f3c"
          }
        >
          {area}
        </Tag>
      ),
      filters: [
        {
          text: "Invitationals/Regionals/ORCS",
          value: "Invitationals/Regionals/ORCS",
        },
        { text: "Nationals", value: "Nationals" },
        { text: "Rookie Rumble", value: "Rookie Rumble" },
        { text: "OLT", value: "OLT" },
        { text: "Other", value: "Other" },
      ],
      onFilter: (value, record) => record.area === value,
    },
  ];

  const paginationConfig = {
    pageSize: 5,
    showQuickJumper: true,
    hideOnSinglePage: true,
  };

  return (
    <div>
      {!selectedCase && (
        <>
          <Breadcrumb items={breadcrumbItems} />
          <Divider />
          <h1>Cases</h1>
          <Table
            dataSource={cases.filter((c) => c.is_active)}
            columns={columns}
            rowKey="id"
            size="small"
            title={() => (
              <h3>
                <b>Active Cases</b>
              </h3>
            )}
            pagination={paginationConfig}
          />
          <Divider />
          <Table
            dataSource={cases.filter((c) => !c.is_active)}
            columns={columns}
            rowKey="id"
            size="small"
            title={() => (
              <h3>
                <b>Inactive Cases</b>
              </h3>
            )}
            pagination={paginationConfig}
          />
        </>
      )}

      {/* Display the selected case details */}
      {selectedCase && (
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <Divider />
          <h1>{selectedCase.name}</h1>
          <Tag color="#2dace6">{selectedCase.type}</Tag>
          <Tag color="#0a1f3c">{selectedCase?.area}</Tag>
          <p>Year: {selectedCase.year}</p>
          <p>Status: {selectedCase.is_active ? "Active" : "Inactive"}</p>
          <IconButton
            buttonText="Back to List"
            icon="back"
            onClick={() => setSearchParams({})}
          />
        </div>
      )}
    </div>
  );
}
