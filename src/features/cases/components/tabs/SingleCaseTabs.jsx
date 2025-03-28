import { Tabs } from "@mantine/core";
import WitnessList from "../lists/WitnessList";

export default function SingleCaseTabs({ pWitnesses, dWitnesses, sWitnesses, pSide, currentTab, setCurrentTab }) {
    return (
        <Tabs defaultValue={currentTab} onChange={setCurrentTab}>
            <Tabs.List>
                <Tabs.Tab value={pSide}>{pSide}</Tabs.Tab>
                <Tabs.Tab value="defense">Defense</Tabs.Tab>
                <Tabs.Tab value="swing">Swing</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={pSide}>
                <h3>{pSide} Witnesses</h3>
                <WitnessList witnesses={pWitnesses} />
            </Tabs.Panel>

            <Tabs.Panel value="defense">
                <h3>Defense Witnesses</h3>
                <WitnessList witnesses={dWitnesses} />
            </Tabs.Panel>

            <Tabs.Panel value="swing">
                <h3>Swing Witnesses</h3>
                <WitnessList witnesses={sWitnesses} />
            </Tabs.Panel>
        </Tabs>
    )
}