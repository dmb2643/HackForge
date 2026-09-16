import { Bitcoin, Boxes, Cloud, Code2, Cpu, Database, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/components/ui/tooltip";

const TECH_ICONS: Record<string, LucideIcon> = {
  react: Boxes,
  python: Code2,
  aws: Cloud,
  ethereum: Bitcoin,
  solidity: Code2,
  typescript: Code2,
  node: Cpu,
  postgres: Database,
  default: Cpu,
};

function iconForTech(name: string): LucideIcon {
  const key = name.toLowerCase().replace(/\s+/g, "");
  if (key in TECH_ICONS && key !== "default") {
    return TECH_ICONS[key] as LucideIcon;
  }
  return TECH_ICONS.default as LucideIcon;
}

type TechStackIconsProps = {
  stack: string[];
};

export function TechStackIcons({ stack }: TechStackIconsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {stack.map((tech) => {
        const Icon = iconForTech(tech);
        return (
          <Tooltip key={tech}>
            <TooltipTrigger
              type="button"
              className="inline-flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              <Icon aria-hidden />
              <span className="sr-only">{tech}</span>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>{tech}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
