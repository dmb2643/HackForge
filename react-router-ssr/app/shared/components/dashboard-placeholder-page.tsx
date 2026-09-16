type DashboardPlaceholderPageProps = {
  title: string;
  description?: string;
};

export function DashboardPlaceholderPage({ title, description }: DashboardPlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 px-4 py-6 md:px-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      <p className="text-sm text-muted-foreground">Content coming soon.</p>
    </div>
  );
}
