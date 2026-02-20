import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserLogs } from "@/lib/userLogs";
import { LogOut, Shield } from "lucide-react";

const AdminPanel = () => {
  const { logout } = useAuth();
  const logs = getUserLogs();

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-muted-foreground">User activity logs</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Logs ({logs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No activity logged yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Time</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Action</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.slice().reverse().map((log) => (
                        <tr key={log.id} className="border-b last:border-0">
                          <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-2 font-medium text-foreground">{log.action}</td>
                          <td className="py-3 px-2 text-muted-foreground">{log.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPanel;
