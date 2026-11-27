export function getOptionClass(isSelected: boolean) {
  return `h-auto min-h-10 w-full min-w-0 whitespace-normal rounded-full border border-border/40 px-3 py-2 text-base leading-tight shadow-none ${
    isSelected
      ? "bg-brand-primary text-white hover:bg-brand-primary"
      : "bg-surface-hover/70 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
  }`;
}