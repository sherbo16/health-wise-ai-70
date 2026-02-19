export interface UserLog {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
}

const LOGS_KEY = "healthwise_user_logs";

export function addUserLog(action: string, detail: string) {
  const logs = getUserLogs();
  logs.push({
    id: crypto.randomUUID(),
    action,
    detail,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function getUserLogs(): UserLog[] {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || "[]");
  } catch {
    return [];
  }
}
