import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

export function getWorkbenchDate(now: Date) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(now);
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  const year = part('year');
  const month = part('month');
  const day = part('day');
  // 以周一为一周开始，含当年第一个周四的周为第 1 周。
  const thursday = new Date(Date.UTC(year, month - 1, day));
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const weekYear = thursday.getUTCFullYear();
  const week = Math.ceil(((thursday.getTime() - Date.UTC(weekYear, 0, 1)) / 86400000 + 1) / 7);
  return {
    date: `${year}年${month}月${day}日`,
    dateTime: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    weekday: new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', weekday: 'long' }).format(now),
    week, weekYear,
  };
}

export function WorkbenchDate() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  const date = getWorkbenchDate(now);
  return (
    <aside className="wb-date" aria-label="当前日期与周次">
      <span className="wb-date-icon"><CalendarDays size={23} aria-hidden="true" /></span>
      <div><time dateTime={date.dateTime}>{date.date}</time><p>{date.weekday}<span aria-hidden="true"> · </span><span title="周一为一周开始，含当年第一个周四的周为第 1 周">{date.weekYear}年第 {date.week} 周</span></p></div>
    </aside>
  );
}
