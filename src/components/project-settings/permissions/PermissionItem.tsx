import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const PermissionItem = ({
  id,
  label,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  icon: any;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/30 transition">
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div>
        <Label htmlFor={id} className="font-normal">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onChange} />
  </div>
);
