import { render, screen } from "@testing-library/react";
import LiteDashboard from "../components/dashboard/LiteDashboard";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

// Provide a mock user context
jest.mock("../lib/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "user-123",
      name: "Rohit Sharma",
      phone: "9876543210",
      phoneVerified: true,
      hasConsent: true,
      score: 65,
      scoreLabel: "Fair",
      color: "#F59E0B",
      totalOutstanding: 250000,
      monthlyEmi: 15000,
      optimalRate: 12,
      salary: 80000,
      salaryDate: 1,
      accounts: [
        { lender: "HDFC Bank", outstanding: 150000, type: "Credit Card", emi: 10000, dueDate: 5 },
        { lender: "ICICI Bank", outstanding: 100000, type: "Personal Loan", emi: 5000, dueDate: 10 }
      ],
      currentTimeline: 48,
      optimizedTimeline: 36,
      timelineSaved: 12,
    },
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("../lib/SubscriptionContext", () => ({
    useSubscription: () => ({
        tier: "lite",
    }),
}));

describe("LiteDashboard Component", () => {
  it("renders the dashboard greeting securely using the context user", () => {
    const testDate = new Date("2024-01-01T12:00:00Z");
    render(<LiteDashboard lastUpdated={testDate} />);
    
    expect(screen.getByText(/Hi, Rohit/i)).toBeInTheDocument();
    expect(screen.getByText("Here is your debt health analysis for today.")).toBeInTheDocument();
  });

  it("encourages upgrading when the user is on the lite plan", () => {
    const testDate = new Date("2024-01-01T12:00:00Z");
    render(<LiteDashboard lastUpdated={testDate} />);
    
    expect(screen.getByText("Activate Shield Plan")).toBeInTheDocument();
    expect(screen.getByText(/Explore Shield/i)).toBeInTheDocument();
  });
});

