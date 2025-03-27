function setDocumentTitle({ title, isHomePage = false }) {
  if (isHomePage) {
    document.title = `MockMetrics`;
    return;
  }
  document.title = `${title} | MockMetrics`;
}

function filterAssigneesByRole(assignees, role) {
  return (
    assignees
      ?.filter((a) => a.role === role)
      .map((a) => a.users)
      .flat() || null
  );
}

export { setDocumentTitle, filterAssigneesByRole };
