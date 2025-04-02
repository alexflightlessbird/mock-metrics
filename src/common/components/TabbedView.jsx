// Dependency imports
import { Tabs } from "@mantine/core";

export default function TabbedView({ tabs = [], defaultTab, onTabChange }) {
  return (
    <Tabs defaultValue={defaultTab} onChange={onTabChange}>
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Panel key={tab.value} value={tab.value}>
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
