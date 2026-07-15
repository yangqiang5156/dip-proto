import { createBrowserRouter } from "react-router";
import { EnterpriseLayout } from "./components/enterprise";
import MyApplications from "./pages/MyApplications";
import NewApplication from "./pages/NewApplication";
import ApprovalDetail from "./pages/ApprovalDetail";
import ApprovalDecision from "./pages/ApprovalDecision";
import ExportCenter from "./pages/ExportCenter";
import ApprovalConfig from "./pages/ApprovalConfig";
import ComponentShowcase from "./pages/ComponentShowcase";
import DownloadRequestModalDemo from "./pages/DownloadRequestModalDemo";
import PendingApproval from "./pages/PendingApproval";
import ApprovedByMe from "./pages/ApprovedByMe";
import AllRecords from "./pages/AllRecords";
import EntryConfiguration from "./pages/EntryConfiguration";
import ApprovalChainConfigDemo from "./pages/ApprovalChainConfigDemo";
import AuditLogs from "./pages/AuditLogs";
import NotificationDrawerDemo from "./pages/NotificationDrawerDemo";
import DownloadDemo from "./pages/DownloadDemo";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: EnterpriseLayout,
    children: [
      { index: true, Component: MyApplications },
      { path: "new-application", Component: NewApplication },
      { path: "approval/:id", Component: ApprovalDetail },
      { path: "approval-decision/:id", Component: ApprovalDecision },
      { path: "approval-config", Component: EntryConfiguration },
      { path: "component-showcase", Component: ComponentShowcase },
      { path: "download-request-modal-demo", Component: DownloadRequestModalDemo },
      { path: "pending-approval", Component: PendingApproval },
      { path: "approved", Component: ApprovedByMe },
      { path: "all-records", Component: AllRecords },
      { path: "audit-logs", Component: AuditLogs },
      { path: "approval-chain-demo", Component: ApprovalChainConfigDemo },
      { path: "notification-drawer-demo", Component: NotificationDrawerDemo },
      { path: "download-demo", Component: DownloadDemo },
    ],
  },
]);
