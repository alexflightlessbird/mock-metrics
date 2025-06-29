import React, { useState } from "react";
import { setDocumentTitle } from "../utils/helpers";
import { AddIcon, EditIcon, DeleteIcon } from "../common/components/ActionIcons";
import { NavLink, Group, Box, Flex, Text, Select, ActionIcon } from "@mantine/core";
import IconButton from "../common/components/IconButton";
import icons from "../utils/icons";
import { useSearchParams } from "react-router-dom";

export default function Test() {
  setDocumentTitle({ title: "Test" });

  const [school, setSchool] = useState("uofm");
  const [searchParams, setSearchParams] = useSearchParams();

  function onSchoolChange (newSchool) {
    setSchool(newSchool);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("sch", newSchool);
    setSearchParams(newSearchParams);
  }

  return (
    <div>
      <h1>Testing Page</h1>
      <Flex maw="50%" direction="column">
        <Group>
          <Text>School:</Text>
          <Select
            variant="default"
            data={[
              { group: "Primary Admin", items: [{ value: "msu", label: "Michigan State University" }] },
              { group: "Admin", items: [{ value: "uofm", label: "University of Michigan" }] },
              { group: "Viewer", items: [] }
            ]}
            value={school}
            onChange={onSchoolChange}
            allowDeselect={false}
          />
        </Group>
        <Flex maw="80%" direction="column">
          <NavLink 
            label="Dashboard"
            leftSection={React.createElement(icons["dashboard"])}
          />
          <NavLink
            label="Students"
            leftSection={React.createElement(icons["user"])}
          />
          <NavLink
            label="Teams"
            leftSection={React.createElement(icons["team"])}
          />
          <NavLink
            label="Tournaments"
            leftSection={React.createElement(icons["trophy"])}
          />
        </Flex>
      </Flex>
    </div>
  );
}
