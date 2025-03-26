import React from "react";
import Breadcrumb from "../common/Breadcrumb";
import { Pill, useMantineTheme } from "@mantine/core";
import { Link } from "react-router-dom";

export default function SchoolBreadcrumb({ selectedSchool }) {
    const theme = useMantineTheme();

    const inactiveProps = {
        size: "md",
        style: {
            backgroundColor: theme.colors.lightGray[0],
            color: theme.colors.darkBlue[0],
            border: "1px solid " + theme.colors.darkBlue[0]
        }
    };

    const activeProps = {
        size: "lg",
        style: {
            backgroundColor: theme.colors.primaryBlue[0],
            color: theme.colors.lightGray[0]
        }
    };

    const breadcrumbItems = (
        selectedSchool
        ? [
            {
                title: <Link to="/schools"><Pill {...inactiveProps}>Schools</Pill></Link>
            },
            {
                title: <Pill {...activeProps}>{selectedSchool.schools.name}</Pill>
            }
        ]
        : [
            {
                title: <Pill {...activeProps}>Schools</Pill>
            }
        ]
    ).map((item, index) => (
        <React.Fragment key={index}>{item.title}</React.Fragment>
    ));

    return <Breadcrumb>{breadcrumbItems}</Breadcrumb>
}