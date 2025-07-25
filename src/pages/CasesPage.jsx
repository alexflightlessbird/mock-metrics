import { Container, Title, List } from "@mantine/core";
import { useCasesData } from "../features/cases/hooks/useCasesData";
import Loader from "../common/components/loader/GavelLoader";

export default function CasesPage() {
  const { data: cases, isLoading: casesLoading } = useCasesData();

  if (casesLoading) return <Loader />;

  return (
    <Container fluid>
      <Title order={1}>Cases</Title>
      <List>
        {cases.map((c) => {
          return (
            <List.Item key={c.id}>
              {c.name} - {c.year} ({c.witnesses.length} witnesses)
            </List.Item>
          );
        })}
      </List>
    </Container>
  );
}
