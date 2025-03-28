import React from "react";
import Breadcrumb from "../../common/components/Breadcrumb";
import { Pill, useMantineTheme } from "@mantine/core";
import { Link } from "react-router-dom";

export default function SchoolBreadcrumb({ selectedTeam }) {
  const theme = useMantineTheme();

  const inactiveProps = {
    size: "md",
    style: {
      backgroundColor: theme.colors.lightGray[0],
      color: theme.colors.darkBlue[0],
      border: "1px solid " + theme.colors.darkBlue[0],
    },
  };

  const activeProps = {
    size: "lg",
    style: {
      backgroundColor: theme.colors.primaryBlue[0],
      color: theme.colors.darkBlue[0],
    },
  };

  const breadcrumbItems = (
    selectedTeam
      ? [
          {
            title: (
              <Link to="/teams">
                <Pill {...inactiveProps}>Teams</Pill>
              </Link>
            ),
          },
          {
            title: <Pill {...activeProps}>{selectedTeam.name}</Pill>,
          },
        ]
      : [
          {
            title: <Pill {...activeProps}>Teams</Pill>,
          },
        ]
  ).map((item, index) => (
    <React.Fragment key={index}>{item.title}</React.Fragment>
  ));

  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
}
