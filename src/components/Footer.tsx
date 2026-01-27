import { AlertTriangle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div className="text-center">
            <h3 className="font-semibold text-foreground">Important Notice</h3>
            <p className="text-sm">
              This is an educational tool. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
