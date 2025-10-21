import { List } from "@mantine/core";
import { useCasesData } from "../common/hooks/useCasesData";
import Loader from "../common/components/loader/GavelLoader";
import BasePage from "../common/components/BasePage";

export default function CasesPage() {
  const { data: cases, isLoading: casesLoading } = useCasesData();

  if (casesLoading) return <Loader />;

  return (
    <BasePage titleText="Cases">
      <List>
        {cases.map((c) => {
          return (
            <List.Item key={c.id}>
              {c.name} - {c.year} ({c.witnesses.length} witnesses)
            </List.Item>
          );
        })}
      </List>
    </BasePage>
  );
}
