// Compatibility shim: maps the react-router-dom API used by the original
// Fikrado site onto @tanstack/react-router.
import { Link as TanLink, Outlet, useLocation } from "@tanstack/react-router";

export { Outlet, useLocation };

export function Link({ to, children, ...rest }) {
  return (
    <TanLink to={to} {...rest}>
      {children}
    </TanLink>
  );
}

export function NavLink({ to, end, className, children, ...rest }) {
  const { pathname } = useLocation();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  const cls = typeof className === "function" ? className({ isActive }) : className;
  return (
    <TanLink to={to} className={cls} {...rest}>
      {children}
    </TanLink>
  );
}
