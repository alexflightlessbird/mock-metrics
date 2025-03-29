import Breadcrumb from "../../../../common/components/Breadcrumb";
import BreadcrumbPill from "../../../../common/components/BreadcrumbPill";
import { Link, useSearchParams } from "react-router-dom";
import { useCases, useCaseWitnesses } from "../../../../hooks/api/useCases";
import { useSelectedItem } from "../../../../common/hooks/useSelectedItem";
import { Fragment } from "react";

export default function CaseBreadcrumb() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get("caseId");
  const witnessId = searchParams.get("witnessId");

  const { data: allCases = [], isPending: isCasesPending } = useCases();
  const { data: allCaseWitnesses = [], isPending: isCaseWitnessesPending } =
    useCaseWitnesses(caseId);

  const selectedCase = useSelectedItem({ items: allCases, id: caseId });
  const selectedWitness = useSelectedItem({
    items: allCaseWitnesses,
    id: witnessId,
  });

  if (isCasesPending || (isCaseWitnessesPending && caseId)) return;

  const getBreadcrumbItems = () => {
    if (!caseId)
      return [{ title: <BreadcrumbPill active>Cases</BreadcrumbPill> }];

    const items = [
      {
        title: (
          <Link to="/cases">
            <BreadcrumbPill active={false}>Cases</BreadcrumbPill>
          </Link>
        ),
      },
    ];

    if (!selectedCase) {
      items.push({ title: <BreadcrumbPill active>Not Found</BreadcrumbPill> });
      return items;
    }

    if (!witnessId) {
      items.push({
        title: <BreadcrumbPill active>{selectedCase.name}</BreadcrumbPill>,
      });
      return items;
    }

    items.push({
      title: (
        <Link to={`/cases?caseId=${caseId}`}>
          <BreadcrumbPill active={false}>{selectedCase.name}</BreadcrumbPill>
        </Link>
      ),
    });

    if (!selectedWitness) {
      items.push({ title: <BreadcrumbPill active>Not Found</BreadcrumbPill> });
      return items;
    }

    items.push({
      title: <BreadcrumbPill active>{selectedWitness.name}</BreadcrumbPill>,
    });
    return items;
  };

  const breadcrumbItems = getBreadcrumbItems().map((item, index) => (
    <Fragment key={index}>{item.title}</Fragment>
  ));

  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
}
