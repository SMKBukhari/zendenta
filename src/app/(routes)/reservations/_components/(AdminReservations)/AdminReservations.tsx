"use client";
import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReservationCalendar from "./ReservationCalendar";
import AddReservationDialog from "./AddReservationDialog";
import type { Treatment, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CalendarCheckIcon from "@/icons/CalendarCheck";
import axios from "axios";
import { Dentist, Reservation } from "@/types";

type Props = {
  user: User | null;
  treatments?: Treatment[] | null;
};

const AdminReservations = ({ user, treatments }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();
  const [selectedDentistId, setSelectedDentistId] = useState<
    string | undefined
  >();

  // Fetch dentists and reservations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch dentists
        const dentistsResponse = await axios.get("/api/staff/getDentists");
        const dentistsData = await dentistsResponse.data;

        // Fetch reservations for the selected date
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const reservationsResponse = await axios.get(
          "/api/reservations/getByDate",
          {
            params: { date: formattedDate },
          }
        );
        const reservationsData = await reservationsResponse.data;

        setDentists(dentistsData);
        setReservations(reservationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleDateSelectToday = () => {
    setSelectedDate(new Date());
  };

  const handleAddReservation = (timeSlot?: string, dentistId?: string) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedDentistId(dentistId);
    setIsAddReservationOpen(true);
  };

  const handleReservationAdded = async () => {
    // Refresh reservations after adding a new one
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await axios.get("/api/reservations/getByDate", {
        params: { date: formattedDate },
      });
      const data = await response.data;
      setReservations(data);
      toast.success("Reservation added successfully");
    } catch (error) {
      console.error("Error refreshing reservations:", error);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      await axios.delete("/api/reservations/delete", {
        data: { id },
      });

      // Remove the deleted reservation from the state
      setReservations((prev) => prev.filter((r) => r.id !== id));

      toast.success("Reservation deleted successfully");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete reservation");
    }
  };

  const handleUpdateReservation = async (
    id: string,
    dentistId: string,
    timeSlot: string
  ): Promise<boolean> => {
    try {
      await axios.put("/api/reservations/update", {
        id,
        dentistId,
        time: timeSlot,
      });

      // Refresh the reservations
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const refreshResponse = await axios.get("/api/reservations/getByDate", {
        params: { date: formattedDate },
      });
      const data = refreshResponse.data;
      setReservations(data);

      toast.success("Reservation updated successfully");

      return true;
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation");
      return false;
    }
  };

  const totalAppointments = reservations.length;

  return (
    <div className='flex flex-col h-full'>
      {/* Header with date navigation */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center'>
            <span className='p-1 mr-3 bg-brand-primary-blue/10 rounded-md'>
              <CalendarCheckIcon color='#415be7' />
            </span>
            <span className='text-2xl font-semibold text-brand-neutrals'>
              {format(selectedDate, "dd")}
            </span>
            <div className='flex flex-col ml-2'>
              <span className='text-sm font-medium text-brand-neutrals'>
                {format(selectedDate, "MMMM yyyy")}
              </span>
              <span className='text-xs text-brand-neutrals/70'>
                total appointments
              </span>
            </div>
          </div>
          <Badge
            variant='outline'
            className='bg-brand-light-blue/10 text-brand-primary-blue border-brand-primary-blue/25'
          >
            {totalAppointments}{" "}
            {totalAppointments === 1 ? "appointment" : "appointments"}
          </Badge>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='border-brand-neutrals/20'
            onClick={handleDateSelectToday}
          >
            Today
          </Button>

          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='icon'
              onClick={handlePreviousDay}
              className='border-brand-neutrals/20'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='text-lg font-medium text-brand-neutrals'>
              {format(selectedDate, "EEE, d MMM yyyy")}
            </div>
            <Button
              variant='outline'
              size='icon'
              onClick={handleNextDay}
              className='border-brand-neutrals/20'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar view */}
      <div className='flex-1 overflow-auto'>
        <ReservationCalendar
          date={selectedDate}
          dentists={dentists}
          reservations={reservations}
          isLoading={isLoading}
          onAddReservation={handleAddReservation}
          onDeleteReservation={handleDeleteReservation}
          onUpdateReservation={handleUpdateReservation}
        />
      </div>

      {/* Add Reservation Dialog */}
      <AddReservationDialog
        isOpen={isAddReservationOpen}
        onClose={() => setIsAddReservationOpen(false)}
        onReservationAdded={handleReservationAdded}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        selectedDentistId={selectedDentistId}
        dentists={dentists}
        getAllTreatments={treatments}
        
      />
    </div>
  );
};

export default AdminReservations;
