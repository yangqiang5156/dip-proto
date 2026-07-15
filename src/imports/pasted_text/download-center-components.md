// SYSTEM SETUP: Download Center Component Library V1

// GOAL
Create a reusable design system for a B2B web-based download approval center used inside a data intelligence platform.
It must support applicant, approver, admin, security, and audit roles, plus all required states for request, approval, file lifecycle, configuration, logging, and notifications.
Do not omit business-specific components.

// 1. GLOBAL STYLES & TOKENS
SET LIBRARY_NAME "Download Center Component Library V1"
SET FONT_FAMILY "PingFang SC"
SET PRIMARY_COLOR #3069E6 // enterprise blue for primary actions
SET SECONDARY_COLOR #EAF2FF // light blue surfaces for selected and info states
SET ACCENT_COLOR #0F766E // supporting accent for success and highlights
SET BACKGROUND_COLOR #F6F8FB
SET SURFACE_COLOR #FFFFFF
SET TEXT_PRIMARY #1F2937
SET TEXT_SECONDARY #667085
SET ERROR_COLOR #E53935
SET SUCCESS_COLOR #2E7D32
SET WARNING_COLOR #FB8C00
SET DESIGN_TOKEN "Radius/Card" VALUE 12px
SET DESIGN_TOKEN "Radius/Element" VALUE 8px
SET DESIGN_TOKEN "Radius/Button" VALUE 8px
SET DESIGN_TOKEN "Spacing/Base" VALUE 8px
SET SHADOW_STYLE "Soft low-elevation enterprise dashboard shadow"

// 2. LAYOUT & SCREEN CONTAINER
CREATE COMPONENT "Screen_Container" WITH PROPERTIES {
  width: "Fill_Container",
  background_color: BACKGROUND_COLOR,
  padding_x: 24,
  padding_top: 24,
  layout: "Vertical Auto-Layout",
  description: "Responsive web application frame for all screens, adapting to browser width instead of using a fixed desktop canvas."
}

// 3. NAVIGATION COMPONENTS
CREATE COMPONENT "Navigation/TopBar" WITH PROPERTIES {
  width: "Fill_Container",
  height: 64,
  background_color: SURFACE_COLOR,
  shadow: SHADOW_STYLE,
  layout: "Horizontal Auto-Layout with product logo left, breadcrumb center-left, notification bell and user avatar right.",
  description: "Global top bar for the download center."
}

CREATE COMPONENT "Navigation/Sidebar" WITH PROPERTIES {
  width: 240,
  background_color: SURFACE_COLOR,
  layout: "Vertical Auto-Layout with grouped menu items.",
  description: "Sidebar navigation for My Applications, Pending Approval, Approved History, Downloadable Files, All Records, Entry Config, Audit Logs."
}

// 4. CORE ATOMIC COMPONENTS
CREATE COMPONENT "Button/Primary" WITH PROPERTIES {
  height: 40,
  width: "Hug_Content",
  background_color: PRIMARY_COLOR,
  text_color: #FFFFFF,
  border_radius: "Radius/Button",
  font_weight: "SemiBold",
  padding_x: 20
}

CREATE COMPONENT "Button/Secondary" WITH PROPERTIES {
  height: 40,
  width: "Hug_Content",
  background_color: "transparent",
  border: "1px solid PRIMARY_COLOR",
  text_color: PRIMARY_COLOR,
  border_radius: "Radius/Button"
}

CREATE COMPONENT "Button/Danger" WITH PROPERTIES {
  height: 40,
  width: "Hug_Content",
  background_color: ERROR_COLOR,
  text_color: #FFFFFF,
  border_radius: "Radius/Button"
}

CREATE COMPONENT "Input/Text" WITH PROPERTIES {
  height: 40,
  width: "Fill_Container",
  background_color: SURFACE_COLOR,
  border: "1px solid #D0D5DD",
  border_radius: "Radius/Element",
  padding_x: 12
}

CREATE COMPONENT "Input/TextArea" WITH PROPERTIES {
  min_height: 96,
  width: "Fill_Container",
  background_color: SURFACE_COLOR,
  border: "1px solid #D0D5DD",
  border_radius: "Radius/Element",
  padding: 12
}

CREATE COMPONENT "Input/Select" WITH PROPERTIES {
  height: 40,
  width: "Fill_Container",
  background_color: SURFACE_COLOR,
  border: "1px solid #D0D5DD",
  border_radius: "Radius/Element",
  trailing_icon: "chevron-down"
}

CREATE COMPONENT "Input/DateRange" WITH PROPERTIES {
  height: 40,
  width: "Fill_Container",
  background_color: SURFACE_COLOR,
  border: "1px solid #D0D5DD",
  border_radius: "Radius/Element",
  trailing_icon: "calendar"
}

CREATE COMPONENT "Card/Standard" WITH PROPERTIES {
  width: "Fill_Container",
  background_color: SURFACE_COLOR,
  border_radius: "Radius/Card",
  shadow: SHADOW_STYLE,
  padding: 16,
  layout: "Vertical Auto-Layout"
}

CREATE COMPONENT "Table/Standard" WITH PROPERTIES {
  width: "Fill_Container",
  background_color: SURFACE_COLOR,
  border_radius: "Radius/Card",
  header_background: BACKGROUND_COLOR,
  row_height: 52,
  description: "Data table with sortable headers and pagination."
}

// 5. STATEFUL VARIANTS
Define visible variants for:
- Button: default / hover / disabled / loading
- Input: default / focused / error / disabled
- Table: empty / loading / populated / error
- Notification: unread / read / warning / failure / success
- Status Badge: 审批中 / 已驳回 / 审批通过 / 文件生成中 / 待下载 / 已下载 / 已过期 / 生成失败 / 已停用

// 6. BUSINESS-SPECIFIC COMPONENTS
Create these business components with explicit role and state variants:
- "Card/ContextSummary": shows 入口名称, 所属模块, 页面名称, 下载按钮名称, 导出条件摘要, 风险等级
- "Timeline/ApprovalProgress": serial approval timeline with current node, completed nodes, rejected node, opinion snippets
- "Badge/RiskLevel": low / medium / high severity badge
- "Form/DownloadRequest": fields for 下载用途, 使用场景, 是否对外使用, 备注
- "Card/FileItem": file name, size, generated time, expiry date, remaining downloads, primary download CTA
- "Builder/ApprovalNode": approver source chip, node order, resolver status, fallback warning
- "Panel/DecisionActions": Approve button, Reject button, opinion textarea, required reject reason
- "Banner/SystemStatus": info / warning / error banners for 配置缺失, 审批人解析失败, 文件生成失败
- "Table/AuditLog": tabular log with operation type, actor, result, time, remarks, IP/device columns when available
- "Notification/MessageItem": grouped messages for submitted, pending approval, approved, rejected, file ready, expiring soon, generation failed

For each business-specific component, define:
- what it displays
- what actions it supports
- what states it has
- which roles can use it

// 7. BRAND COMPONENT
CREATE COMPONENT "Brand/Logo" WITH PROPERTIES {
  asset: "A simple enterprise wordmark reading 下载中心 with a shield-and-download icon.",
  description: "Product logo mark."
}