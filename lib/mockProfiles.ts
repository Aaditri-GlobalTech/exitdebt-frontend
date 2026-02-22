export interface Account {
  lender: string;
  outstanding: number;
  apr: number;
  type: "credit_card" | "loan" | "emi";
  emi: number;
  dueDate: number; // day of month
}

export interface MockProfile {
  name: string;
  panHash: string;
  score: number;
  scoreLabel: string;
  color: "red" | "orange" | "yellow" | "green";
  totalOutstanding: number;
  monthlyEmi: number;
  activeAccounts: number;
  avgInterestRate: number;
  creditUtilization: number; // percentage 0-100
  missedPayments: number;    // count of missed payments in last 12 months
  accounts: Account[];
  overpayment: number;
  optimalRate: number;
  salary: number;
  salaryDate: number; // day of month
  otherIncome: number;
  currentTimeline: string;
  optimizedTimeline: string;
  timelineSaved: string;
  creditScore: number; // CIBIL score
}

export const mockProfiles: MockProfile[] = [
  {
    name: "Saurabh",
    panHash: "abcde1234f",
    score: 0, // calculated dynamically
    scoreLabel: "",
    color: "red",
    totalOutstanding: 624000,
    monthlyEmi: 28400,
    activeAccounts: 4,
    avgInterestRate: 22.3,
    creditUtilization: 78,
    missedPayments: 3,
    accounts: [
      { lender: "HDFC Credit Card", outstanding: 182000, apr: 42, type: "credit_card", emi: 5400, dueDate: 7 },
      { lender: "Bajaj Personal Loan", outstanding: 300000, apr: 14, type: "loan", emi: 12000, dueDate: 10 },
      { lender: "Amazon Pay EMI", outstanding: 42000, apr: 18, type: "emi", emi: 3500, dueDate: 15 },
      { lender: "ICICI Credit Card", outstanding: 100000, apr: 36, type: "credit_card", emi: 7500, dueDate: 20 },
    ],
    overpayment: 47200,
    optimalRate: 12,
    salary: 60000,
    salaryDate: 5,
    otherIncome: 0,
    currentTimeline: "4y 3mo",
    optimizedTimeline: "3y 4mo",
    timelineSaved: "11 months sooner",
    creditScore: 620,
  },
  {
    name: "Priya",
    panHash: "fghij5678k",
    score: 0,
    scoreLabel: "",
    color: "yellow",
    totalOutstanding: 320000,
    monthlyEmi: 12500,
    activeAccounts: 2,
    avgInterestRate: 16.2,
    creditUtilization: 42,
    missedPayments: 1,
    accounts: [
      { lender: "SBI Credit Card", outstanding: 85000, apr: 24, type: "credit_card", emi: 3200, dueDate: 3 },
      { lender: "HDFC Personal Loan", outstanding: 235000, apr: 13.5, type: "loan", emi: 9300, dueDate: 18 },
    ],
    overpayment: 18400,
    optimalRate: 11,
    salary: 75000,
    salaryDate: 1,
    otherIncome: 0,
    currentTimeline: "3y 1mo",
    optimizedTimeline: "2y 6mo",
    timelineSaved: "7 months sooner",
    creditScore: 720,
  },
  {
    name: "Rahul",
    panHash: "klmno9012p",
    score: 0,
    scoreLabel: "",
    color: "orange",
    totalOutstanding: 485000,
    monthlyEmi: 19800,
    activeAccounts: 3,
    avgInterestRate: 19.7,
    creditUtilization: 58,
    missedPayments: 2,
    accounts: [
      { lender: "Axis Credit Card", outstanding: 145000, apr: 38, type: "credit_card", emi: 5800, dueDate: 5 },
      { lender: "Tata Capital Loan", outstanding: 250000, apr: 15, type: "loan", emi: 10200, dueDate: 12 },
      { lender: "Flipkart Pay Later", outstanding: 90000, apr: 21, type: "emi", emi: 3800, dueDate: 25 },
    ],
    overpayment: 32600,
    optimalRate: 11.5,
    salary: 55000,
    salaryDate: 7,
    otherIncome: 0,
    currentTimeline: "3y 8mo",
    optimizedTimeline: "2y 11mo",
    timelineSaved: "9 months sooner",
    creditScore: 680,
  },
  {
    name: "Meera",
    panHash: "qrstu3456v",
    score: 0,
    scoreLabel: "",
    color: "green",
    totalOutstanding: 180000,
    monthlyEmi: 8200,
    activeAccounts: 2,
    avgInterestRate: 13.8,
    creditUtilization: 22,
    missedPayments: 0,
    accounts: [
      { lender: "Kotak Personal Loan", outstanding: 150000, apr: 12.5, type: "loan", emi: 6500, dueDate: 8 },
      { lender: "CRED Pay EMI", outstanding: 30000, apr: 16, type: "emi", emi: 1700, dueDate: 22 },
    ],
    overpayment: 5400,
    optimalRate: 11,
    salary: 90000,
    salaryDate: 1,
    otherIncome: 0,
    currentTimeline: "2y 0mo",
    optimizedTimeline: "1y 9mo",
    timelineSaved: "3 months sooner",
    creditScore: 760,
  },
];
