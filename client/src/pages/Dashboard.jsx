import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, MapPin, CalendarDays, Users, Ban } from "lucide-react";
import api from "../api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Dashboard = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  const currentUserId = currentUser ? currentUser.id : null;

  useEffect(() => {
    let ignore = false;

    const fetchMyTrips = async () => {
      if (!currentUserId) {
        if (!ignore) setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/api/trips/user/${currentUserId}`);
        if (!ignore) setMyTrips(response.data);
      } catch (error) {
        if (!ignore) console.error("Dashboard engine error:", error.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchMyTrips();

    return () => {
      ignore = true;
    };
  }, [currentUserId]);

  const handleDecision = async (tripId, applicantId, decision) => {
    try {
      const dbStatus = decision === "approve" ? "approved" : "rejected";

      await api.put(`/api/trips/${tripId}/status`, {
        userId: applicantId,
        status: dbStatus,
      });

      setMyTrips((prevTrips) =>
        prevTrips.map((trip) => {
          if (trip._id === tripId) {
            const applicantToMove = trip.applicants.find(
              (a) => a.userId === applicantId,
            );
            return {
              ...trip,
              applicants: trip.applicants.filter(
                (a) => a.userId !== applicantId,
              ),
              approvedMembers:
                decision === "approve"
                  ? [...(trip.approvedMembers || []), applicantToMove]
                  : trip.approvedMembers,
            };
          }
          return trip;
        }),
      );
    } catch (error) {
      console.error("Error updating applicant:", error.message);
    }
  };

  const handleCancelTrip = async (tripId) => {
    try {
      await api.put(`/api/trips/${tripId}/cancel`);
      setMyTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripId ? { ...trip, status: "Cancelled" } : trip,
        ),
      );
    } catch (error) {
      console.error("Error cancelling trip:", error.message);
    }
  };

  const statusStyles = {
    Upcoming: "bg-primary/15 text-primary",
    Planning: "bg-primary/15 text-primary",
    Ongoing: "bg-success/15 text-success",
    Completed: "bg-secondary text-muted-foreground",
    Cancelled: "bg-destructive/15 text-destructive",
  };

  const hostedTrips = myTrips.filter(
    (trip) => trip.creatorId === currentUserId,
  );
  const joinedTrips = myTrips.filter(
    (trip) => trip.creatorId !== currentUserId,
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  const renderTripCard = (trip, isHost) => {
    const pendingApplicants =
      trip.applicants?.filter((a) => a.status === "pending" || !a.status) || [];

    return (
      <Card key={trip._id} className="mb-6 overflow-hidden p-0">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-muted/40 p-6">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {trip.title}
              </h2>
              <Badge
                className={statusStyles[trip.status] || statusStyles.Upcoming}
              >
                {trip.status || "Upcoming"}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {trip.destination}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3.5" /> {trip.startDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" size="sm">
              <Link to={`/ledger/${trip._id}`}>View Ledger</Link>
            </Button>
            <Badge className="gap-1">
              <Users className="size-3" />
              {(trip.approvedMembers?.length || 0) + 1} in crew
            </Badge>
            {isHost &&
              trip.status !== "Completed" &&
              trip.status !== "Cancelled" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleCancelTrip(trip._id)}
                >
                  <Ban className="size-3.5" /> Cancel
                </Button>
              )}
          </div>
        </div>

        {/* Pending applications — host only */}
        {isHost && (
          <div className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Pending applications ({pendingApplicants.length})
            </h3>

            {pendingApplicants.length === 0 ? (
              <p className="text-sm italic text-muted-foreground">
                No pending applications right now.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingApplicants.map((applicant, index) => (
                  <div
                    key={applicant.userId || index}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/50 p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {applicant.name}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {applicant.travelStyle}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-success text-success-foreground hover:bg-success/90"
                        onClick={() =>
                          handleDecision(trip._id, applicant.userId, "approve")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDecision(trip._id, applicant.userId, "reject")
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Compass className="size-8 text-primary" />
        <h1 className="font-display text-3xl font-semibold text-foreground">
          My travel control deck
        </h1>
      </div>

      <Tabs defaultValue="hosted">
        <TabsList>
          <TabsTrigger value="hosted">
            Hosting {hostedTrips.length > 0 && `(${hostedTrips.length})`}
          </TabsTrigger>
          <TabsTrigger value="joined">
            Joined {joinedTrips.length > 0 && `(${joinedTrips.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hosted">
          {hostedTrips.length === 0 ? (
            <p className="italic text-muted-foreground">
              You haven't posted any trip itineraries yet.
            </p>
          ) : (
            hostedTrips.map((trip) => renderTripCard(trip, true))
          )}
        </TabsContent>

        <TabsContent value="joined">
          {joinedTrips.length === 0 ? (
            <p className="italic text-muted-foreground">
              You haven't joined any buddy crews yet.
            </p>
          ) : (
            joinedTrips.map((trip) => renderTripCard(trip, false))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
