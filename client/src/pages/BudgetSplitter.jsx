import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const BudgetSplitter = () => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  // 🔑 FIX: Extract the ID primitive to safely track in dependencies
  const currentUserId = currentUser ? currentUser.id : null;

  useEffect(() => {
    const loadLedgerData = async () => {
      try {
        // 1. Fetch trip document details
        const tripResponse = await api.get(`/api/trips/${id}`);
        setTrip(tripResponse.data);

        // 2. Fetch persistent expenses
        const expenseResponse = await api.get(`/api/expenses/${id}`);
        setExpenses(expenseResponse.data);

        // 🔑 FIX: Use the stable primitive ID here
        if (currentUserId) {
          setPaidBy(currentUserId);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading live ledger matrix:", error.message);
        setLoading(false);
      }
    };
    loadLedgerData();
  }, [id, currentUserId]);

  // ... rest of your handleAddExpense function and return statement stay exactly the same!

  // Handle adding an expense permanently to MongoDB
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description || !amount || !paidBy)
      return alert("Please fill out all fields!");

    // Map out the correct visual descriptor name for who logged the payment item
    let payerName = "Unknown Crew Member";
    if (paidBy === trip?.creatorId) {
      payerName = "Creator";
    } else {
      const foundMember = trip?.approvedMembers?.find(
        (m) => m.userId === paidBy,
      );
      if (foundMember) payerName = foundMember.name;
    }

    const payload = {
      tripId: id,
      description,
      amount: parseFloat(amount),
      paidBy,
      payerName,
    };

    try {
      const response = await api.post("/api/expenses", payload);

      // Prepend the saved backend record right into our active visual UI layout state
      setExpenses([response.data, ...expenses]);

      setDescription("");
      setAmount("");
    } catch (error) {
      console.error("Failed to save transaction item records:", error.message);
      alert("Error saving transaction data entry to cloud storage logs.");
    }
  };

  // Calculations based on live backend data inputs
  const totalCost = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalCrewCount = (trip?.approvedMembers?.length || 0) + 1;
  const perPersonShare = totalCrewCount > 0 ? totalCost / totalCrewCount : 0;

  const calculateSettlements = () => {
    if (expenses.length === 0) return [];
    const balances = {};
    const namesMap = { [trip.creatorId]: "Creator" };

    balances[trip.creatorId] = 0;
    trip.approvedMembers?.forEach((m) => {
      balances[m.userId] = 0;
      namesMap[m.userId] = m.name;
    });

    expenses.forEach((exp) => {
      if (balances[exp.paidBy] !== undefined) {
        balances[exp.paidBy] += exp.amount;
      }
    });

    const netBalances = Object.keys(balances).map((uid) => ({
      uid,
      name: namesMap[uid] || "Explorer",
      net: balances[uid] - perPersonShare,
    }));

    let debtors = netBalances
      .filter((x) => x.net < 0)
      .map((x) => ({ ...x, net: Math.abs(x.net) }));
    let creditors = netBalances.filter((x) => x.net > 0);

    const steps = [];
    let d = 0,
      c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const actualOwed = Math.min(debtor.net, creditor.net);

      if (actualOwed > 0.01) {
        steps.push({
          from: debtor.name,
          to: creditor.name,
          amount: actualOwed,
        });
      }

      debtor.net -= actualOwed;
      creditor.net -= actualOwed;
      if (debtor.net <= 0.01) d++;
      if (creditor.net <= 0.01) c++;
    }
    return steps;
  };

  const settlementsList = calculateSettlements();

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "4rem", color: "#666" }}>
        Loading Ledger...
      </h2>
    );
  if (!trip)
    return (
      <h2 style={{ textAlign: "center", marginTop: "4rem", color: "#ef4444" }}>
        Trip not found!
      </h2>
    );

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      <Link
        to="/dashboard"
        style={{
          color: "#0284c7",
          textDecoration: "none",
          fontWeight: "bold",
          marginBottom: "1rem",
          display: "inline-block",
        }}
      >
        &larr; Back to Dashboard
      </Link>

      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2.2rem" }}>Trip Ledger</h1>
        <p
          style={{
            margin: "0.5rem 0 0 0",
            color: "#94a3b8",
            fontSize: "1.1rem",
          }}
        >
          🌐 Real-time Expenses for: <strong>{trip.title}</strong>
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "1.5rem",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Total Trip Cost
          </span>
          <h2
            style={{
              fontSize: "2.5rem",
              color: "#10b981",
              margin: "0.5rem 0 0 0",
            }}
          >
            ₹{totalCost.toFixed(2)}
          </h2>
        </div>
        <div
          style={{
            background: "#1e293b",
            padding: "1.5rem",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Per Person Share ({totalCrewCount} Way Split)
          </span>
          <h2
            style={{
              fontSize: "2.5rem",
              color: "#f59e0b",
              margin: "0.5rem 0 0 0",
            }}
          >
            ₹{perPersonShare.toFixed(2)}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
          }}
        >
          <h3
            style={{ marginTop: 0, marginBottom: "1.5rem", color: "#1e293b" }}
          >
            Add Expense
          </h3>

          <form
            onSubmit={handleAddExpense}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              placeholder="What did you buy?"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
              }}
            />

            <input
              type="number"
              placeholder="How much? (₹)"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
              }}
            />

            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "white",
                cursor: "pointer",
              }}
            >
              <option value="" disabled>
                Who paid?
              </option>
              <option value={trip.creatorId}>Creator (You)</option>
              {trip.approvedMembers?.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#0284c7",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Log Expense
            </button>
          </form>
        </div>

        <div>
          <h3
            style={{ marginTop: 0, marginBottom: "1.5rem", color: "#1e293b" }}
          >
            How to Settle Up
          </h3>
          {settlementsList.length === 0 ? (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                padding: "1.25rem",
                borderRadius: "12px",
                color: "#166534",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              🎉 Everyone is perfectly settled up!
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {settlementsList.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff7ed",
                    border: "1px solid #ffedd5",
                    padding: "1rem",
                    borderRadius: "10px",
                    color: "#c2410c",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.95rem" }}>
                    <strong>{step.from}</strong> pays <strong>{step.to}</strong>
                  </span>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#ea580c",
                    }}
                  >
                    ₹{step.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "2.5rem",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "1.5rem",
        }}
      >
        <h3 style={{ color: "#1e293b" }}>Recent Transactions</h3>
        {expenses.length === 0 ? (
          <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
            No expenses logged yet for this trip itinerary.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            {expenses.map((exp) => (
              <div
                key={exp._id || exp.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div>
                  <strong style={{ color: "#1e293b", display: "block" }}>
                    {exp.description}
                  </strong>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Paid by: {exp.payerName}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#1e293b",
                  }}
                >
                  ₹{exp.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSplitter;
