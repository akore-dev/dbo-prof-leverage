import { render, screen } from "@testing-library/react";
import App from "./App";
import NotFound from "./component/NotFound";

test("renders the product landing page and primary call to action", () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: /more value than your career currently reflects/i })).toBeInTheDocument();
  const callsToAction = screen.getAllByRole("link", { name: /start your free 5-minute diagnostic/i });
  expect(callsToAction.length).toBeGreaterThan(0);
  callsToAction.forEach((link) => expect(link).toHaveAttribute("href", "/assessment"));
});

test("renders a useful not-found page", () => {
  render(<NotFound />);

  expect(screen.getByRole("heading", { name: /this page is out of view/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /return home/i })).toHaveAttribute("href", "/");
});