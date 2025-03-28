import { Tabs } from "@mantine/core";
import CaseList from "../lists/CaseList";

export default function AllCasesTabs({ activeCases, inactiveCases, currentTab, setCurrentTab }) {
    return (
        <Tabs defaultValue={currentTab} onChange={setCurrentTab}>
            <Tabs.List>
                <Tabs.Tab value="active">Active</Tabs.Tab>
                <Tabs.Tab value="inactive">Inactive</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="active">
                <h3>Active Cases</h3>
                <CaseList cases={activeCases} />
            </Tabs.Panel>

            <Tabs.Panel value="inactive">
                <h3>Inactive Cases</h3>
                <CaseList cases={inactiveCases} />
            </Tabs.Panel>
        </Tabs>
    )

}