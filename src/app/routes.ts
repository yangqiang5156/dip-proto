import { createBrowserRouter, createHashRouter } from "react-router";
import { EnterpriseLayout } from "./components/enterprise";
import MyApplications from "./pages/MyApplications";
import NewApplication from "./pages/NewApplication";
import ApprovalDetail from "./pages/ApprovalDetail";
import ApprovalDecision from "./pages/ApprovalDecision";
import ExportCenter from "./pages/ExportCenter";
import MyApprovals from "./pages/MyApprovals";
import AllRecords from "./pages/AllRecords";
import EntryConfiguration from "./pages/EntryConfiguration";
import AuditLogs from "./pages/AuditLogs";
import DownloadDemo from "./pages/DownloadDemo";
import ApprovalCenter from "./pages/ApprovalCenter";
import ApprovalConfig from "./pages/ApprovalConfig";
import DownloadableFiles from "./pages/DownloadableFiles";
import EnterpriseApprovalCenter from "./pages/EnterpriseApprovalCenter";

const createRouter =
  import.meta.env.VITE_STANDALONE === "true" || window.location.protocol === "file:"
    ? createHashRouter
    : createBrowserRouter;

export const router = createRouter([
  {
    path: "/",
    Component: EnterpriseLayout,
    children: [
      { index: true, Component: MyApplications },
      { path: "new-application", Component: NewApplication },
      { path: "approval/:id", Component: ApprovalDetail },
      { path: "approval-decision/:id", Component: ApprovalDecision },
      { path: "approval-config", Component: EntryConfiguration },
      { path: "export-center", Component: ExportCenter },
      { path: "my-approvals", Component: MyApprovals },
      { path: "pending-approval", Component: MyApprovals },
      { path: "approved", Component: MyApprovals },
      { path: "all-records", Component: AllRecords },
      { path: "audit-logs", Component: AuditLogs },
      { path: "download-demo", Component: DownloadDemo },
      { path: "approval-center-legacy", Component: ApprovalCenter },
      { path: "approval-config-legacy", Component: ApprovalConfig },
      { path: "downloadable-files", Component: DownloadableFiles },
      { path: "enterprise-approval-center", Component: EnterpriseApprovalCenter },
    ],
  },
]);
