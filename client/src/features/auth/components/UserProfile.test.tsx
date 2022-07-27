import { render, screen } from "../../../test-utils/index";
import { UserProfile } from "./UserProfile";

const testUser = {
  email: "ohno@ohnohno.com",
};

test("greets the user", () => {
  render(<UserProfile />, {
    preloadedState: { user: { userDetails: testUser } },
  });

  expect(screen.getByText(/h1/i)).toBeInTheDocument();
});

test("redirects if user is false", () => {
  render(<UserProfile />);
  expect(screen.queryByText(/h1/i)).not.toBeInTheDocument();
});
