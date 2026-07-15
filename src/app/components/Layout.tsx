import { Outlet, NavLink } from "react-router";
import { 
  Settings, 
  ChevronDown, 
  Bell
} from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const [expandedMenu, setExpandedMenu] = useState<string | null>("system");

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-[#4A7BF7] text-white h-14 flex items-center px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#4A7BF7] font-bold text-sm">AI</span>
          </div>
          <span className="font-semibold text-base">DEMO</span>
        </div>

        <nav className="flex items-center gap-8 ml-20">
          <a href="#" className="text-white border-b-2 border-white pb-1 text-sm">平台管理</a>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <button className="text-white/90 hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-white/90 hover:text-white text-sm">管理员</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 左侧导航栏 */}
        <aside className="w-48 bg-white border-r border-gray-200">
          <nav className="px-[0px] py-[10px]">
            {/* 系统管理 */}
            <div className="mb-2">
              <button
                onClick={() => toggleMenu("system")}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#4A7BF7]" />
                  <span>系统管理</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === "system" ? "rotate-180" : ""}`} />
              </button>
              {expandedMenu === "system" && (
                <div className="mt-1 space-y-1">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block px-6 py-2 text-sm ${
                        isActive
                          ? "text-[#4A7BF7] bg-blue-50 border-r-2 border-[#4A7BF7]"
                          : "text-gray-600 hover:bg-gray-50 pl-6"
                      }`
                    }
                  >
                    审批中心
                  </NavLink>
                  <NavLink
                    to="/approval-config"
                    className={({ isActive }) =>
                      `block px-6 py-2 text-sm ${
                        isActive
                          ? "text-[#4A7BF7] bg-blue-50 border-r-2 border-[#4A7BF7]"
                          : "text-gray-600 hover:bg-gray-50 pl-6"
                      }`
                    }
                  >
                    流程配置
                  </NavLink>
                  <NavLink
                    to="/export-center"
                    className={({ isActive }) =>
                      `block px-6 py-2 text-sm ${
                        isActive
                          ? "text-[#4A7BF7] bg-blue-50 border-r-2 border-[#4A7BF7]"
                          : "text-gray-600 hover:bg-gray-50 pl-6"
                      }`
                    }
                  >
                    导出中心
                  </NavLink>
                  <NavLink
                    to="/component-showcase"
                    className={({ isActive }) =>
                      `block px-6 py-2 text-sm ${
                        isActive
                          ? "text-[#4A7BF7] bg-blue-50 border-r-2 border-[#4A7BF7]"
                          : "text-gray-600 hover:bg-gray-50 pl-6"
                      }`
                    }
                  >
                    组件展示
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}