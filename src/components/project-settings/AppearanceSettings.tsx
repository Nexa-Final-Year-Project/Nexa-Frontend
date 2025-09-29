// components/project-settings/AppearanceSettings.tsx
export const AppearanceSettings = ({ project }: { project: any }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Appearance Settings</h2>
        <p className="text-muted-foreground">
          Customize how your project appears
        </p>
      </div>
      {/* Add appearance settings here */}
    </div>
  );
};
