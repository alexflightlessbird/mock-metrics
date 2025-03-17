function setDocumentTitle({ title, isHomePage = false }) {
  if (isHomePage) {
    document.title = `MockMetrics`;
    return;
  }
  document.title = `${title} - MockMetrics`;
}

function filterAssigneesByRole(assignees, role) {
  if (assignees) {
    return assignees
      .filter((a) => a.role === role)
      .map((a) => a.users)
      .flat();
  } else {
    return null;
  }
}

export { setDocumentTitle, filterAssigneesByRole };
