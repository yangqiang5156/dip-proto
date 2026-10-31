import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRightLeft,
  BellRing,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MessageSquareText,
  ShieldCheck,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';

type CardTone = 'primary' | 'success' | 'warning' | 'destructive' | 'neutral';
type DecisionOption = 'approve' | 'reject' | 'transfer' | 'add-sign';
type ApprovalCardType = 'download' | 'permission';

interface NotificationCardProps {
  title: string;
  status: string;
  description: string;
  tone: CardTone;
  rows: Array<[string, string]>;
  actionLabel: string;
  onAction: () => void;
}

const toneStyles: Record<CardTone, {
  bar: string;
  badge: string;
}> = {
  primary: {
    bar: 'bg-[#3069e6]',
    badge: 'border-[#3069e6]/20 bg-[#3069e6]/10 text-[#3069e6]',
  },
  success: {
    bar: 'bg-success',
    badge: 'border-success/20 bg-success-light text-success',
  },
  warning: {
    bar: 'bg-warning',
    badge: 'border-warning/20 bg-warning-light text-warning',
  },
  destructive: {
    bar: 'bg-destructive',
    badge: 'border-destructive/20 bg-destructive-light text-destructive',
  },
  neutral: {
    bar: 'bg-slate-400',
    badge: 'border-slate-200 bg-slate-100 text-slate-600',
  },
};

function NotificationCard({
  title,
  status,
  description,
  tone,
  rows,
  actionLabel,
  onAction,
}: NotificationCardProps) {
  const style = toneStyles[tone];

  return (
    <div className="relative overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className={`absolute inset-y-0 left-0 w-1 ${style.bar}`} />
      <div className="border-b px-5 py-4 pl-6">
        <h3 className="font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="p-5 pl-6">
        <p className="mb-4 text-sm leading-6 text-text-secondary">{description}</p>

        <div className="space-y-2 rounded-lg bg-muted/40 p-3">
          <div className="mb-2 flex items-center justify-between gap-4 border-b pb-2 text-sm">
            <span className="flex-shrink-0 text-text-tertiary">当前状态</span>
            <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${style.badge}`}>
              {status}
            </span>
          </div>
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 text-sm">
              <span className="flex-shrink-0 text-text-tertiary">{label}</span>
              <span className="text-right font-medium text-text-primary">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
          <span className="text-xs text-text-tertiary">飞书消息卡片 · 状态实时同步</span>
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NotificationCardDefinition extends Omit<NotificationCardProps, 'onAction'> {
  route: string;
}

const notificationCards: NotificationCardDefinition[] = [
  {
    title: '下载申请已提交',
    status: '已提交',
    description: '您的下载申请已进入审批流程，可在飞书卡片或网页审批中心查看最新进度。',
    tone: 'primary' as CardTone,
    rows: [['申请单号', 'DL202607270018'], ['申请名称', '用户行为数据导出'], ['最高字段密级', 'S3 秘密'], ['当前节点', 'L3数据管家']],
    actionLabel: '查看申请',
    route: '/approval-center/request/1',
  },
  {
    title: '您有一条待审批申请',
    status: '待审批',
    description: '李明发起的数据下载申请已到达您的审批节点，请核对用途、范围与密级后处理。',
    tone: 'warning' as CardTone,
    rows: [['申请单号', 'DL202604290015'], ['申请人', '李明 / 产品部'], ['申请类型', '数据下载'], ['当前节点', 'L3数据管家']],
    actionLabel: '立即审批',
    route: '/approval-center/approval/1',
  },
  {
    title: '申请审批通过',
    status: '已通过',
    description: '全部审批节点已处理完成，系统即将创建文件生成任务。',
    tone: 'success' as CardTone,
    rows: [['申请单号', 'DL202604280075'], ['申请名称', '订单明细'], ['最终审批人', '李晨'], ['完成时间', '2026-07-27 10:18:32']],
    actionLabel: '查看流程',
    route: '/approval-center/request/4',
  },
  {
    title: '申请已被驳回',
    status: '已驳回',
    description: '申请范围超过当前业务需要，请根据审批意见调整后重新发起。',
    tone: 'destructive' as CardTone,
    rows: [['申请单号', 'TB202604270089'], ['申请类型', '数据表权限'], ['驳回节点', '数据 Owner'], ['审批意见', '请限定负责区域并缩短有效期']],
    actionLabel: '查看详情',
    route: '/approval-center/request/table-approval-3',
  },
  {
    title: '导出文件生成中',
    status: '生成中',
    description: '审批已通过，系统正在生成导出文件，预计需要 3–5 分钟。',
    tone: 'primary' as CardTone,
    rows: [['申请单号', 'DL20260429002'], ['文件名称', '用户行为分析_Q1.xlsx'], ['任务状态', '队列处理中'], ['预计完成', '3–5 分钟']],
    actionLabel: '查看状态',
    route: '/?requestId=DL20260429002',
  },
  {
    title: '文件已生成，可下载',
    status: '待下载',
    description: '导出文件已生成，请在 7 天有效期内下载；有效期内不限制下载次数。',
    tone: 'success' as CardTone,
    rows: [['申请单号', 'DL20260428003'], ['文件名称', '订单明细_202604.xlsx'], ['文件大小', '1.8 MB'], ['有效期至', '2026-08-03 10:22:18']],
    actionLabel: '去下载',
    route: '/?requestId=DL20260428003',
  },
  {
    title: '文件生成失败',
    status: '生成失败',
    description: '文件生成任务未完成，可前往下载中心查看原因并重新生成。',
    tone: 'destructive' as CardTone,
    rows: [['申请单号', 'DL20260425007'], ['文件名称', '物流数据导出_202604.xlsx'], ['失败原因', '数据源连接超时'], ['发生时间', '2026-07-27 10:25:08']],
    actionLabel: '重新生成',
    route: '/?requestId=DL20260425007',
  },
  {
    title: '数据表权限已生效',
    status: '已生效',
    description: '数据表权限审批已通过，授权结果已同步至数据开发平台。',
    tone: 'success' as CardTone,
    rows: [['申请单号', 'TB202604270143'], ['数据表', 'ads_order_summary'], ['权限类型', '查询'], ['有效期', '180 天']],
    actionLabel: '查看授权',
    route: '/approval-center/request/table-approval-2',
  },
];

function FeishuApprovalCard({ type }: { type: ApprovalCardType }) {
  const navigate = useNavigate();
  const [decision, setDecision] = useState<DecisionOption>('approve');
  const [target, setTarget] = useState('');
  const [opinion, setOpinion] = useState('');
  const [result, setResult] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isDownload = type === 'download';
  const needsTarget = decision === 'transfer' || decision === 'add-sign';

  const submit = () => {
    if (needsTarget && !target) {
      setError(`请选择${decision === 'transfer' ? '转交' : '加签'}对象`);
      return;
    }
    if (!opinion.trim()) {
      setError('请输入审批说明');
      return;
    }

    setError('');
    setSubmitting(true);
    setTimeout(() => {
      const labels: Record<DecisionOption, string> = {
        approve: '通过',
        reject: '驳回',
        transfer: '转交',
        'add-sign': '加签',
      };
      setResult(`审批操作“${labels[decision]}”已提交，网页审批中心状态已同步。`);
      setSubmitting(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b bg-[#3069e6] px-5 py-4 text-white">
        <h3 className="font-semibold">{isDownload ? '数据下载审批' : '数据表权限审批'}</h3>
      </div>

      <div className="space-y-5 p-5">
        {result && (
          <div className="flex items-start gap-2 rounded-lg border border-success/20 bg-success-light p-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            {result}
          </div>
        )}

        <div>
          <h4 className="font-semibold text-text-primary">
            {isDownload
              ? '用户行为分析数据导出申请'
              : 'PROD-t05_ai_nlp_wakeup_log 表权限申请'}
          </h4>
          <div className="mt-1 flex items-center justify-between gap-4">
            <p className="text-sm text-text-secondary">
              {isDownload ? '申请单号：DL202604290015' : '申请单号：TB20260710001'}
            </p>
            <div className="flex flex-shrink-0 items-center gap-2">
              <span className="text-sm text-text-tertiary">审批状态</span>
              <span className="rounded-full border border-[#3069e6]/20 bg-[#3069e6]/10 px-3 py-1 text-xs font-medium text-[#3069e6]">
                {result ? '已处理' : '待您处理'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 rounded-lg bg-muted/40 p-4 text-sm">
          <Info label="申请人" value={isDownload ? '李明 / 产品部' : '杨强 / 智慧家庭平台'} />
          <Info label="当前节点" value={isDownload ? 'L3数据管家' : '数据 Owner'} />
          {isDownload ? (
            <>
              <Info label="最高字段密级" value="S3 秘密" />
              <Info label="个人信息/跨境" value="涉及" />
              <Info label="预计数据量" value="约 45,000 条" />
              <Info label="申请用途" value="经营分析与阶段复盘" />
            </>
          ) : (
            <>
              <Info label="数据库" value="hdw_dwb" />
              <Info label="物理表" value="t05_ai_nlp_wakeup_log" />
              <Info label="权限范围" value="7 个字段 / 查询" />
              <Info label="有效期" value="长期" />
            </>
          )}
        </div>

        <div className="space-y-3">
          <Label><span className="text-destructive">*</span>审批操作</Label>
          <div className="grid grid-cols-4 gap-2">
            {([
              ['approve', '通过', CheckCircle2],
              ['reject', '驳回', XCircle],
              ['transfer', '转交', ArrowRightLeft],
              ['add-sign', '加签', UserPlus],
            ] as const).map(([value, label, Icon]) => (
              <button
                type="button"
                key={value}
                onClick={() => {
                  setDecision(value);
                  setTarget('');
                  setResult('');
                  setError('');
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg border-2 px-2 py-2.5 text-sm font-medium transition-all ${
                  decision === value
                    ? 'border-[#3069e6] bg-[#3069e6]/10 text-[#3069e6] shadow-[0_0_0_2px_rgba(48,105,230,0.10)]'
                    : 'border-border text-text-secondary hover:border-[#3069e6]/40 hover:bg-[#3069e6]/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {needsTarget && (
          <div className="space-y-2">
            <Label><span className="text-destructive">*</span>{decision === 'transfer' ? '转交对象' : '加签对象'}</Label>
            <Select value={target} onValueChange={(value) => { setTarget(value); setError(''); }}>
              <SelectTrigger>
                <SelectValue placeholder={`请选择${decision === 'transfer' ? '转交' : '加签'}对象`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="li-chen">李晨（数据 Owner）</SelectItem>
                <SelectItem value="wang-fang">王芳（部门负责人）</SelectItem>
                <SelectItem value="wang-wei">王玮（信息安全）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`opinion-${type}`}><span className="text-destructive">*</span>审批说明</Label>
          <Textarea
            id={`opinion-${type}`}
            placeholder="请输入审批说明"
            maxLength={128}
            value={opinion}
            onChange={(event) => {
              setOpinion(event.target.value);
              setError('');
            }}
            className="min-h-24"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-destructive">{error}</span>
            <span className="text-xs text-text-tertiary">{opinion.length}/128</span>
          </div>
        </div>

        <div className="flex gap-3 border-t pt-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate(isDownload ? '/approval-center/approval/1' : '/approval-center/approval/table-approval-1')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            网页查看详情
          </Button>
          <Button className="flex-1 bg-[#3069e6] hover:bg-[#275dcc]" onClick={submit} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquareText className="mr-2 h-4 w-4" />}
            {submitting ? '提交中' : '在飞书中提交'}
          </Button>
        </div>

        <p className="text-center text-xs text-text-tertiary">
          飞书卡片与网页审批中心使用同一审批实例，任一端处理后另一端立即只读
        </p>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className="mt-1 truncate font-medium text-text-primary" title={value}>{value}</p>
    </div>
  );
}

export default function FeishuCardDemo() {
  const navigate = useNavigate();
  const [approvalType, setApprovalType] = useState<ApprovalCardType>('download');

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-text-primary">飞书卡片Demo</h1>
          <p className="mt-1 text-sm text-text-secondary">展示申请、审批、文件交付全流程通知，以及可在飞书内完成的审批操作</p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#3069e6]/20 bg-[#3069e6]/5 p-4">
          <MessageSquareText className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3069e6]" />
          <div>
            <p className="font-medium text-text-primary">双端协同规则</p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              飞书卡片和网页审批中心复用同一申请、审批实例及权限校验。通过、驳回、转交、加签操作支持在任一端完成，
              首次成功提交后立即锁定当前节点，另一端同步展示只读结果，避免重复审批。
            </p>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="gap-5">
          <TabsList className="h-10">
            <TabsTrigger value="notifications" className="px-4">
              <BellRing className="h-4 w-4" />
              流程通知卡片
            </TabsTrigger>
            <TabsTrigger value="approval" className="px-4">
              <ShieldCheck className="h-4 w-4" />
              审批操作卡片
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-text-primary">申请与审批全流程通知</h2>
                <p className="mt-1 text-sm text-text-secondary">覆盖数据下载和数据表权限申请的主要状态变化</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-text-secondary">
                共 {notificationCards.length} 类卡片
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {notificationCards.map((card) => (
                <NotificationCard
                  key={card.title}
                  {...card}
                  onAction={() => navigate(card.route)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approval">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-text-primary">飞书审批操作</h2>
                <p className="mt-1 text-sm text-text-secondary">选择不同申请类型，体验飞书卡片内完成审批</p>
              </div>
              <div className="flex rounded-lg border bg-white p-1">
                <button
                  type="button"
                  onClick={() => setApprovalType('download')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    approvalType === 'download' ? 'bg-[#3069e6] text-white' : 'text-text-secondary hover:bg-muted'
                  }`}
                >
                  数据下载
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalType('permission')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    approvalType === 'permission' ? 'bg-[#3069e6] text-white' : 'text-text-secondary hover:bg-muted'
                  }`}
                >
                  数据表权限
                </button>
              </div>
            </div>
            <FeishuApprovalCard key={approvalType} type={approvalType} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
