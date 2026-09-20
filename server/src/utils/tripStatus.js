// Derives a trip's actual current status from today's date, rather than
// trusting a stored value that would otherwise go stale the moment a day
// passes. Cancellation is the one exception — it's a manual, permanent
// override that dates can't undo.
export const deriveTripStatus = (trip) => {
  if (trip.status === 'Cancelled') return 'Cancelled';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  // Legacy or malformed date strings — fall back rather than crash
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return trip.status === 'Planning' ? 'Upcoming' : trip.status;
  }

  if (today < start) return 'Upcoming';
  if (today > end) return 'Completed';
  return 'Ongoing';
};