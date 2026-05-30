import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportCard({
  icon: Icon,
  title,
  desc,
  actions,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  actions: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{desc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">{actions}</CardContent>
    </Card>
  );
}
