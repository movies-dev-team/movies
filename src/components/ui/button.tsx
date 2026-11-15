import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-brand text-primary-foreground hover:brightness-130 border border-border hover:border-border-hover",
        secondary:
          "border border-border bg-secondary text-secondary-foreground hover:border-border-hover hover:bg-surface-hover hover:brightness-140",
        ghost: "text-text-secondary hover:bg-accent hover:text-foreground",
        soft: "bg-brand-primary/20 text-brand-soft hover:bg-brand-primary/35 hover:text-white",
        glass:
          "border border-white/10 bg-black/40 text-white backdrop-blur-md hover:bg-brand-primary/40 data-[active=true]:bg-brand-primary",
        destructive:
          "bg-destructive/20 text-destructive hover:bg-destructive/40 hover:border-border-hover hover:brightness-110",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
