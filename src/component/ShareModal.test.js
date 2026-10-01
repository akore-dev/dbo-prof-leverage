import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ShareModal from "./ShareModal";

const referralUrl = "https://profleverage.com/s/ABC123";

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ code: "ABC123", completed: 0, goal: 5, invitations: [] }),
  });
});

test("renders the prepared referral URL as a clickable link", async () => {
  render(
    <MemoryRouter>
      <ShareModal open onClose={jest.fn()} referralUrl={referralUrl} initialStep="share" />
    </MemoryRouter>,
  );

  expect(screen.getByRole("link", { name: /open your private invite link/i })).toHaveAttribute("href", referralUrl);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});

test("copies the prepared referral URL", async () => {
  const user = userEvent.setup();
  const onReferralActionComplete = jest.fn();

  render(
    <MemoryRouter>
      <ShareModal
        open
        onClose={jest.fn()}
        referralUrl={referralUrl}
        initialStep="share"
        onReferralActionComplete={onReferralActionComplete}
      />
    </MemoryRouter>,
  );

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  await user.click(screen.getByRole("button", { name: /copy private link/i }));

  expect(onReferralActionComplete).toHaveBeenCalledTimes(1);
  expect(screen.getByText("Link Copied!")).toBeInTheDocument();
});