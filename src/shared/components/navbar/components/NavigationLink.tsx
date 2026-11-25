import { NavLink } from "react-router";
import type { NavigationLinkProps } from "@/shared/components/navbar/types/NavigationLink";

const NavigationLink = ({
  to,
  label,
  activeIcon,
  defaultIcon,
  end = false,
}: NavigationLinkProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex flex-1 flex-col items-center justify-center text-sm transition-colors md:flex-none md:text-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light focus-visible:rounded-lg ${
          isActive ? "text-brand-light" : "text-text-secondary"
        }`
      }
    >
      {({ isActive }) => (
        <span
          className={`flex w-fit flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-linear-to-t group-hover:from-brand-primary/40 group-hover:via-brand-primary/15 group-hover:to-card md:flex-row md:gap-2 ${
            isActive ? "text-brand-light" : ""
          }`}
        >
          <img
            src={isActive ? activeIcon : defaultIcon}
            alt=""
            className="size-5 md:size-6"
          />

          <span>{label}</span>
        </span>
      )}
    </NavLink>
  );
};

export default NavigationLink;
