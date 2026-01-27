import {
  Activity,
  FileText,
  Pill,
  Salad,
  Brain,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import ModuleCard from "./ModuleCard";

const modules = [
  {
    title: "Symptom Checker",
    description: "Describe your symptoms and get AI-powered insights",
    icon: Activity,
    href: "/symptom-checker",
    iconBgColor: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-500",
  },
  {
    title: "Report Simplifier",
    description: "Upload test reports and get easy-to-understand explanations",
    icon: FileText,
    href: "/report-simplifier",
    iconBgColor: "bg-rose-50 dark:bg-rose-950",
    iconColor: "text-rose-500",
  },
  {
    title: "Medicine Guide",
    description: "Learn about medicines, dosage, and side effects",
    icon: Pill,
    href: "/medicine-guide",
    iconBgColor: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-500",
  },
  {
    title: "Nutrition & Fitness",
    description: "Get personalized meal and exercise plans",
    icon: Salad,
    href: "/nutrition-fitness",
    iconBgColor: "bg-orange-50 dark:bg-orange-950",
    iconColor: "text-orange-500",
  },
  {
    title: "Mental Wellness",
    description: "Chat for stress relief, motivation, and mindfulness",
    icon: Brain,
    href: "/mental-wellness",
    iconBgColor: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-500",
  },
  {
    title: "Daily Health Tips",
    description: "Get personalized wellness advice",
    icon: Lightbulb,
    href: "/health-tips",
    iconBgColor: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-500",
  },
  {
    title: "Health Analytics",
    description: "Track your health insights",
    icon: BarChart3,
    href: "/analytics",
    iconBgColor: "bg-cyan-50 dark:bg-cyan-950",
    iconColor: "text-cyan-500",
  },
];

const ModulesSection = () => {
  return (
    <section id="modules" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Healthcare Modules
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose a module to get started with AI-powered healthcare guidance
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((module) => (
            <ModuleCard key={module.href} {...module} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
