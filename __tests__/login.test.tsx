import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../app/login/page";
import { AuthProvider } from "../lib/AuthContext";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

// Mock fetch API globally
global.fetch = jest.fn();

describe("Login Component", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("renders the login form correctly", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("9876543210")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next Step/i })).toBeInTheDocument();
  });

  it("prevents submission of invalid phone numbers (too short)", async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    const input = screen.getByPlaceholderText("9876543210");
    const button = screen.getByRole("button", { name: /Next Step/i });

    fireEvent.change(input, { target: { value: "12345" } });
    fireEvent.click(button);

    expect(screen.getByText("Please enter a valid 10-digit mobile number.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("requests OTP when given a valid 10-digit number", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const input = screen.getByPlaceholderText("9876543210");
    const button = screen.getByRole("button", { name: /Next Step/i });

    fireEvent.change(input, { target: { value: "9876543210" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/otp/send", expect.any(Object));
      expect(screen.getByText(/Enter the 6-digit OTP sent to/i)).toBeInTheDocument();
    });
  });

  it("handles API error responses gracefully during OTP send", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: "Rate limit exceeded" }),
    });

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const input = screen.getByPlaceholderText("9876543210");
    const button = screen.getByRole("button", { name: /Next Step/i });

    fireEvent.change(input, { target: { value: "9876543210" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Failed to send OTP. Please try again.")).toBeInTheDocument();
    });
  });
});
