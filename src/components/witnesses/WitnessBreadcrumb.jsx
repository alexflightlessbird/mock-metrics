import { Fragment } from "react";
import Breadcrumb from "../../common/components/Breadcrumb";
import { Pill, useMantineTheme } from "@mantine/core";
import { Link } from "react-router-dom";

export default function WitnessBreadcrumb({ selectedWitness }) {
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
    selectedWitness
      ? [
          {
            title: (
              <Link to="/witnesses">
                <Pill {...inactiveProps}>Witnesses</Pill>
              </Link>
            ),
          },
          {
            title: <Pill {...activeProps}>{selectedWitness.name}</Pill>,
          },
        ]
      : [
          {
            title: <Pill {...activeProps}>Cases</Pill>,
          },
        ]
  ).map((item, index) => (
    <Fragment key={index}>{item.title}</Fragment>
  ));

  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
}
