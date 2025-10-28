import {
  Button,
  Stack,
  Text,
  Table,
  Space,
  Flex,
  Card,
  Group,
} from "@mantine/core";
import { useBallotDetails } from "../../../common/hooks/useBallotDetails";
import ShowIdText from "../../../common/components/ShowIdText";
import { LuTrash } from "react-icons/lu";
import DeleteConfirmationModal from "../../../common/components/modals-new/DeleteConfirmationModal";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import PageSection from "../../../common/components/PageSection";
import { useTheme } from "../../../context/ThemeContext";

export default function BallotManagementModal({
  selected,
  caseType,
  role,
  trigger,
  tournamentStatus = true,
}) {
  const ballot = selected;
  const { isDark } = useTheme();
}
