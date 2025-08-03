import BaseModal from "./BaseModal";
import Loader from "../loader/GavelLoader";

export default function LoadingModal() {
  return (
    <BaseModal modalId="loading" title="Loading...">
      <Loader />
    </BaseModal>
  );
}
