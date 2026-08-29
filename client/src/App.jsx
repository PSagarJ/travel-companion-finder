import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";
import Dashboard from "./pages/Dashboard";
import ChatRoom from "./pages/ChatRoom";
import BudgetSplitter from "./pages/BudgetSplitter"; // 💥 This is your ledger file!
import UserProfile from "./pages/UserProfile";
import Matches from "./pages/Matches";
import Login from "./pages/Login";
import Feed from "./pages/Feed";

function App() {
  return (
    <div>
      <Navbar />

      {/* The Routes decide which page content to load based on the URL */}
      <Routes>
        {/* 💥 FIXED: Linked View Ledger directly to your BudgetSplitter file using the :id parameter */}
        <Route path="/ledger/:id" element={<BudgetSplitter />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/destination/:id" element={<TripDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat/:tripId" element={<ChatRoom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </div>
  );
}

export default App;
