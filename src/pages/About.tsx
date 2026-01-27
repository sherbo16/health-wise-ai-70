import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Brain, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Health-Focused",
      description: "Our AI is trained specifically for healthcare guidance and wellness support.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your health data is encrypted and never shared with third parties.",
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Advanced AI models provide accurate and helpful health insights.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Designed with users in mind for an intuitive and helpful experience.",
    },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">About AI Healthcare Assistant</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make healthcare information accessible and understandable for everyone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                AI Healthcare Assistant is designed to help you understand your health better. 
                We provide AI-powered tools to simplify medical reports, check symptoms, 
                learn about medicines, and support your overall wellness journey. 
                While our tools are educational, we always recommend consulting with 
                healthcare professionals for medical advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
