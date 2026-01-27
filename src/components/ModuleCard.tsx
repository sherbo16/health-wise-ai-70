import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  iconBgColor?: string;
  iconColor?: string;
}

const ModuleCard = ({
  title,
  description,
  icon: Icon,
  href,
  iconBgColor = "bg-accent",
  iconColor = "text-primary",
}: ModuleCardProps) => {
  return (
    <Link to={href}>
      <Card className="module-card h-full bg-card hover:shadow-lg cursor-pointer border">
        <CardHeader className="pb-2">
          <div
            className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center mb-4`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{description}</p>
          <span className="text-primary font-medium inline-flex items-center gap-1">
            Get Started <span>→</span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ModuleCard;
