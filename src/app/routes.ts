import { createBrowserRouter, createHashRouter, redirect } from "react-router";
import { EnterpriseLayout } from "./components/enterprise";
import MyApplications from "./pages/MyApplications";
import ApprovalDetail from "./pages/ApprovalDetail";
import ApprovalDecision from "./pages/ApprovalDecision";
import ExportCenter from "./pages/ExportCenter";
import MyApprovals from "./pages/MyApprovals";
import AllRecords from "./pages/AllRecords";
import EntryConfiguration from "./pages/EntryConfiguration";
import AuditLogs from "./pages/AuditLogs";
import DownloadDemo from "./pages/DownloadDemo";
import DownloadableFiles from "./pages/DownloadableFiles";
import FeishuCardDemo from "./pages/FeishuCardDemo";
import DataClassificationDowngradeDemo from "./pages/DataClassificationDowngradeDemo";
import NewDataClassificationDowngrade from "./pages/NewDataClassificationDowngrade";

const createRouter =
  import.meta.env.VITE_STANDALONE === "true" || window.location.protocol === "file:"
    ? createHashRouter
    : createBrowserRouter;

export const router = createRouter([
  {
    path: "/",
    Component: EnterpriseLayout,
    children: [
      { index: true, Component: DownloadableFiles },
      { path: "approval-config", Component: EntryConfiguration },
      { path: "export-center", Component: ExportCenter },
      { path: "audit-logs", Component: AuditLogs },
      { path: "download-demo", Component: DownloadDemo },
      { path: "feishu-card-demo", Component: FeishuCardDemo },
      { path: "data-classification-downgrade-demo", Component: DataClassificationDowngradeDemo },
      { path: "data-classification-downgrade-demo/new", Component: NewDataClassificationDowngrade },
      { path: "approval-center", loader: () => redirect("/approval-center/my-applications") },
      { path: "approval-center/my-applications", Component: MyApplications },
      { path: "approval-center/request/:id", Component: ApprovalDetail },
      { path: "approval-center/my-approvals", Component: MyApprovals },
      { path: "approval-center/approval/:id", Component: ApprovalDecision },
      { path: "approval-center/all-records", Component: AllRecords },
      { path: "new-application", loader: () => redirect("/approval-center/my-applications") },
      { path: "approval/:id", loader: () => redirect("/approval-center/my-applications") },
      { path: "approval-decision/:id", loader: () => redirect("/approval-center/my-approvals") },
      { path: "my-approvals", loader: () => redirect("/approval-center/my-approvals") },
      { path: "pending-approval", loader: () => redirect("/approval-center/my-approvals") },
      { path: "approved", loader: () => redirect("/approval-center/my-approvals") },
      { path: "all-records", loader: () => redirect("/approval-center/all-records") },
      { path: "downloadable-files", loader: () => redirect("/") },
    ],
  },
], {
  basename: createRouter === createHashRouter ? "/" : import.meta.env.BASE_URL,
});
