import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Heart, Activity } from "lucide-react";

const Analytics = () => {
  const stats = [
    { label: "Health Score", value: "85", icon: Heart, color: "text-rose-500", bgColor: "bg-rose-50 dark:bg-rose-950" },
    { label: "Active Days", value: "23", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950" },
    { label: "Goals Met", value: "12", icon: TrendingUp, color: "text-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-950" },
  ];

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
