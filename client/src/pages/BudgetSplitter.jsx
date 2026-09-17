import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import io from "socket.io-client";
import {
  ArrowLeft,
  Wallet,
  PlusCircle,
  ArrowRightLeft,
  Receipt,
  PartyPopper,
} from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const BudgetSplitter = () => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");

  // Form input states
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  // 🔑 FIX: Extract the ID primitive to safely track in dependencies
  const currentUserId = currentUser ? currentUser.id : null;

  useEffect(() => {
    // Prevents a stale request for a previously-viewed trip's ledger from
    // overwriting this one if it resolves out of order.
    let ignore = false;

    const loadLedgerData = async () => {
      try {
        // 1. Fetch trip document details
        const tripResponse = await api.get(`/api/trips/${id}`);
        if (ignore) return;
        setTrip(tripResponse.data);

        // 2. Fetch persistent expenses
        const expenseResponse = await api.get(`/api/expenses/${id}`);
        if (ignore) return;
        setExpenses(expenseResponse.data);

        // 🔑 FIX: Use the stable primitive ID here
        if (currentUserId) {
          setPaidBy(currentUserId);
        }

        setLoading(false);
      } catch (error) {
        if (!ignore) {
          console.error("Error loading live ledger matrix:", error.message);
          setLoading(false);
        }
      }
    };
    loadLedgerData();

    return () => {
      ignore = true;
    };
  }, [id, currentUserId]);

  // Live-sync expenses across devices/sessions viewing the same trip —
  // reuses the same authenticated, membership-checked room the chat feature uses.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io.connect(BASE_URL, { auth: { token } });
    socket.emit("join_trip_room", id);

    socket.on("expense_added", (newExpense) => {
      setExpenses((prevExpenses) => {
        // Avoid a duplicate for whichever device actually submitted this
        // expense — it already added it to its own state optimistically.
        if (prevExpenses.some((exp) => exp._id === newExpense._id)) {
          return prevExpenses;
        }
        return [newExpense, ...prevExpenses];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Handle adding an expense permanently to MongoDB
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!description || !amount || !paidBy) {
      setFormError("Please fill out all fields.");
      return;
    }

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
      setFormError("Something went wrong saving that expense. Try again.");
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

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading ledger...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-semibold text-destructive">Trip not found!</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/dashboard"
        className="mb-4 inline-flex items-center gap-1 font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <div className="mb-8 rounded-2xl bg-slate-900 p-8 text-white">
        <h1 className="flex items-center gap-2 font-display text-3xl font-semibold">
          <Wallet className="size-7" /> Trip ledger
        </h1>
        <p className="mt-1.5 text-slate-400">
          Real-time expenses for{" "}
          <strong className="text-white">{trip.title}</strong>
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-800 p-6 text-white">
          <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">
            Total trip cost
          </span>
          <h2 className="mt-2 text-4xl font-bold text-success">
            ₹{totalCost.toFixed(2)}
          </h2>
        </div>
        <div className="rounded-xl bg-slate-800 p-6 text-white">
          <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">
            Per person share ({totalCrewCount}-way split)
          </span>
          <h2 className="mt-2 text-4xl font-bold text-accent">
            ₹{perPersonShare.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr]">
        <Card className="p-6">
          <h3 className="mb-5 flex items-center gap-2 font-semibold text-foreground">
            <PlusCircle className="size-4.5" /> Add expense
          </h3>

          <form onSubmit={handleAddExpense} className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="What did you buy?"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              type="number"
              placeholder="How much? (₹)"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-full border border-input bg-background px-5 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
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

            {formError && (
              <p className="text-sm font-medium text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" className="mt-1 w-full">
              Log expense
            </Button>
          </form>
        </Card>

        <div>
          <h3 className="mb-5 flex items-center gap-2 font-semibold text-foreground">
            <ArrowRightLeft className="size-4.5" /> How to settle up
          </h3>
          {settlementsList.length === 0 ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-success/15 p-5 text-center font-semibold text-success">
              <PartyPopper className="size-4.5" /> Everyone is perfectly settled
              up!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {settlementsList.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-accent/10 p-4"
                >
                  <span className="text-sm text-foreground">
                    <strong>{step.from}</strong> pays <strong>{step.to}</strong>
                  </span>
                  <span className="text-lg font-bold text-accent">
                    ₹{step.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <Receipt className="size-4.5" /> Recent transactions
        </h3>
        {expenses.length === 0 ? (
          <p className="italic text-muted-foreground">
            No expenses logged yet for this trip itinerary.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {expenses.map((exp) => (
              <div
                key={exp._id || exp.id}
                className="flex items-center justify-between rounded-xl bg-secondary/50 p-4"
              >
                <div>
                  <strong className="block text-foreground">
                    {exp.description}
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    Paid by: {exp.payerName}
                  </span>
                </div>
                <span className="text-lg font-bold text-foreground">
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
