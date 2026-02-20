import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Heart, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ReportUploadCard from "@/components/analytics/ReportUploadCard";

const Analytics = () => {
  const [lastMonth, setLastMonth] = useState("");
  const [current, setCurrent] = useState("");
  const [chartData, setChartData] = useState<{ name: string; value: number }[] | null>(null);
  const [badge, setBadge] = useState("");

  const stats = [
    { label: "Health Score", value: "85", icon: Heart, color: "text-rose-500", bgColor: "bg-rose-50 dark:bg-rose-950" },
    { label: "Active Days", value: "23", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950" },
    { label: "Goals Met", value: "12", icon: TrendingUp, color: "text-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-950" },
  ];

  const handleCompare = () => {
    const past = parseFloat(lastMonth);
    const cur = parseFloat(current);
    if (isNaN(past) || isNaN(cur)) return;

    setChartData([
      { name: "Last Month", value: past },
      { name: "Current", value: cur },
    ]);
    setBadge(
      cur < past
        ? "Health is Improving! ✅"
        : cur === past
        ? "No change detected ➡️"
        : "Needs attention ⚠️"
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Health Analytics</h1>
              <p className="text-muted-foreground">Track your health insights</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compare Reports Widget */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Compare Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Last Month Blood Sugar"
                  value={lastMonth}
                  onChange={(e) => setLastMonth(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Current Blood Sugar"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                />
              </div>
              <Button onClick={handleCompare} disabled={!lastMonth || !current}>
                Compare
              </Button>

              {chartData && (
                <div className="mt-4 space-y-4">
                  {badge && (
                    <div className="inline-block rounded-full px-4 py-1 text-sm font-semibold bg-accent text-accent-foreground">
                      {badge}
                    </div>
                  )}
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(199, 89%, 48%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <ReportUploadCard />

          <Card>
            <CardHeader>
              <CardTitle>Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Start using the health modules to see your analytics here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analytics;
