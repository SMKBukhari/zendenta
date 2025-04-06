"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import CalendarSkelton from "@/components/global/skelton/CalendarSkelton";
import { addHours, format, parse } from "date-fns";
import {
  Reservation as ReservationType,
  ReservationStatus,
  Dentist,
  DraggedReservation,
} from "@/types";

// Define the time slots from 9am to 5pm
const TIME_SLOTS = [
  { value: "09:00", display: "9am" },
  { value: "10:00", display: "10am" },
  { value: "11:00", display: "11am" },
  { value: "12:00", display: "12pm" },
  { value: "13:00", display: "1pm" },
  { value: "14:00", display: "2pm" },
  { value: "15:00", display: "3pm" },
  { value: "16:00", display: "4pm" },
];

// Item types for drag and drop
const ItemTypes = {
  RESERVATION: "reservation",
};

interface ReservationProps {
  reservation: ReservationType;
  dentistId: string;
  timeSlot: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onDelete: () => void;
  setDraggedReservation: (reservation: DraggedReservation | null) => void;
}

interface CellProps {
  id?: string;
  dentistId: string;
  timeSlot: string;
  onHover: () => void;
  onLeave: () => void;
  onAddReservation: () => void;
  isHovered: boolean;
  children: React.ReactNode;
  hasReservations: boolean;
  onUpdateReservation: (
    id: string,
    dentistId: string,
    timeSlot: string
  ) => Promise<boolean>;
  setDraggedReservation?: (reservation: DraggedReservation | null) => void;
  draggedReservation?: DraggedReservation | null;
}

interface ReservationCalendarProps {
  date: Date;
  dentists: Dentist[];
  reservations: ReservationType[];
  isLoading: boolean;
  onAddReservation: (timeSlot?: string, dentistId?: string) => void;
  onDeleteReservation: (id: string) => void;
  onUpdateReservation: (
    id: string,
    dentistId: string,
    timeSlot: string
  ) => Promise<boolean>;
}

const ReservationCalendar = ({
  date,
  dentists,
  reservations,
  isLoading,
  onAddReservation,
  onDeleteReservation,
  onUpdateReservation,
}: ReservationCalendarProps) => {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [hoveredReservation, setHoveredReservation] = useState<string | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(
    null
  );
  const [draggedReservation, setDraggedReservation] =
    useState<DraggedReservation | null>(null);

  const confirmDelete = (id: string) => {
    setReservationToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (reservationToDelete) {
      onDeleteReservation(reservationToDelete);
      setDeleteConfirmOpen(false);
      setReservationToDelete(null);
    }
  };

  if (isLoading) {
    return <CalendarSkelton />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='border rounded-lg overflow-hidden'>
        {/* Header with GMT and dentist names */}
        <motion.div
          className='grid'
          style={{
            gridTemplateColumns: "100px repeat(" + dentists.length + ", 1fr)",
          }}
        >
          <div className='p-4 font-medium text-brand-neutrals/70 text-sm border-r border-b border-brand-neutrals/20'>
            GMT
            <br />
            +07:00
          </div>
          {dentists.map((dentist) => (
            <div
              key={dentist.id}
              className='p-4 font-medium text-brand-neutrals border-r border-b border-brand-neutrals/20 relative'
            >
              <div className='flex items-center gap-2'>
                <div className='relative w-8 h-8 rounded-full overflow-hidden bg-brand-light-blue/10'>
                  {dentist.imageUrl ? (
                    <Image
                      src={dentist.imageUrl || "/placeholder.svg"}
                      alt={dentist.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-brand-primary-blue font-medium'>
                      {dentist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className='font-medium text-sm'>{dentist.name}</div>
                  <div className='text-xs text-brand-neutrals/70'>
                    Today&apos;s appointment:{" "}
                    <span className='font-bold'>
                      {
                        reservations.filter((r) => r.dentistId === dentist.id)
                          .length
                      }{" "}
                    </span>
                    <span className='font-bold'>patient(s)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Time slots grid */}
        {TIME_SLOTS.map((timeSlot, timeIndex) => (
          <motion.div
            key={`time-${timeSlot.value}`}
            className='grid'
            style={{
              gridTemplateColumns: "100px repeat(" + dentists.length + ", 1fr)",
            }}
          >
            {/* Time column */}
            <div className='p-4 font-medium text-brand-neutrals/70 text-sm border-r border-b border-brand-neutrals/20'>
              {timeSlot.display}
            </div>

            {/* Dentist columns */}
            {dentists.map((dentist, dentistIndex) => {
              const cellId = `${timeIndex}-${dentistIndex}`;
              const isHovered = hoveredCell === cellId;

              // Find reservations for this dentist and time slot
              const cellReservations = reservations.filter((reservation) => {
                const reservationHour = reservation.time.split(":")[0];
                const slotHour = timeSlot.value.split(":")[0];

                return (
                  reservation.dentistId === dentist.id &&
                  reservationHour === slotHour
                );
              });

              return (
                <Cell
                  key={`cell-${cellId}`}
                  id={cellId}
                  dentistId={dentist.id}
                  timeSlot={timeSlot.value}
                  onHover={() => setHoveredCell(cellId)}
                  onLeave={() => setHoveredCell(null)}
                  onAddReservation={() =>
                    onAddReservation(timeSlot.value, dentist.id)
                  }
                  isHovered={isHovered}
                  hasReservations={cellReservations.length > 0}
                  onUpdateReservation={onUpdateReservation}
                  setDraggedReservation={setDraggedReservation}
                  draggedReservation={draggedReservation}
                >
                  {cellReservations.map((reservation) => (
                    <Reservation
                      key={reservation.id}
                      reservation={reservation}
                      dentistId={dentist.id}
                      timeSlot={timeSlot.value}
                      isHovered={hoveredReservation === reservation.id}
                      onHover={() => setHoveredReservation(reservation.id)}
                      onLeave={() => setHoveredReservation(null)}
                      onDelete={() => confirmDelete(reservation.id)}
                      setDraggedReservation={setDraggedReservation}
                    />
                  ))}
                </Cell>
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this reservation. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-500 hover:bg-red-600'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndProvider>
  );
};

// Draggable reservation component
const Reservation = ({
  reservation,
  dentistId,
  timeSlot,
  isHovered,
  onHover,
  onLeave,
  onDelete,
  setDraggedReservation,
}: ReservationProps) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.RESERVATION,
    item: () => {
      setDraggedReservation({
        id: reservation.id,
        dentistId,
        timeSlot,
        patientName: reservation.patientName,
        treatmentName: reservation.treatmentName,
        status: reservation.status,
        time: reservation.time,
      });
      return {
        id: reservation.id,
        dentistId,
        timeSlot,
        patientName: reservation.patientName,
        treatmentName: reservation.treatmentName,
        status: reservation.status,
        time: reservation.time,
      };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      setDraggedReservation(null);
    },
  });

  // Connect the drag ref to the DOM element
  drag(ref);

  // Get status color
  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case "FINISHED":
        return "bg-green-50 border-green-200";
      case "DOING_TREATMENT":
        return "bg-amber-50 border-amber-200";
      case "REGISTERED":
        return "bg-blue-50 border-blue-200";
      case "WAITING_PAYMENT":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Get status badge
  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "FINISHED":
        return (
          <span className='text-green-600 text-xs bg-white p-1 px-2 rounded-xl shadow font-medium'>
            • Finished
          </span>
        );
      case "DOING_TREATMENT":
        return (
          <span className='text-amber-600 text-xs bg-white p-1 px-2 rounded-xl shadow font-medium'>
            • Doing Treatment
          </span>
        );
      case "REGISTERED":
        return (
          <span className='text-brand-neutrals font-medium text-xs bg-white p-1 px-2 rounded-xl shadow'>
            • Registered
          </span>
        );
      case "WAITING_PAYMENT":
        return (
          <span className='text-yellow-600 text-xs bg-white p-1 px-2 rounded-xl shadow font-medium'>
            • Waiting Payment
          </span>
        );
      default:
        return null;
    }
  };

  // Get patient initial for avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Format time to display
  const formatTimeDisplay = (time: string) => {
    const parsedTime = parse(time, "HH:mm", new Date());
    return format(parsedTime, "hh:mm a"); // e.g. 01:30 PM
  };

  // Get end time (1 hour after start)
  const getEndTime = (time: string) => {
    const parsedTime = parse(time, "HH:mm", new Date());
    const newTime = addHours(parsedTime, 1);
    return format(newTime, "HH:mm"); // returns 24h format like 14:00
  };

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: isDragging ? 0.8 : 1,
        opacity: isDragging ? 0.6 : 1,
        boxShadow: isDragging ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "none",
      }}
      exit={{ scale: 0.95, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`p-2 rounded-md border mb-2 cursor-grab relative ${getStatusColor(
        reservation.status
      )} ${isDragging ? "opacity-50" : "opacity-100"}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className='flex items-center gap-2 mb-1'>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
            reservation.patientName.startsWith("R")
              ? "bg-pink-500"
              : reservation.patientName.startsWith("S")
              ? "bg-green-500"
              : reservation.patientName.startsWith("A")
              ? "bg-green-500"
              : reservation.patientName.startsWith("L")
              ? "bg-blue-500"
              : reservation.patientName.startsWith("D")
              ? "bg-blue-500"
              : "bg-brand-primary-blue"
          }`}
        >
          {getInitial(reservation.patientName)}
        </div>
        <div className='flex-1'>
          <div className='text-sm font-medium'>{reservation.patientName}</div>
          <div className='flex justify-between items-center'>
            <span className='text-xs text-brand-neutrals/70'>
              {formatTimeDisplay(reservation.time)} -{" "}
              {formatTimeDisplay(getEndTime(reservation.time))}
            </span>
            {getStatusBadge(reservation.status)}
          </div>
        </div>
      </div>
      <div className='mt-1'>
        <span
          className={`text-xs font-medium bg-white border
          ${getStatusColor(reservation.status)}
          text-brand-neutrals/80 px-2 py-0.5 rounded-full`}
        >
          {reservation.treatmentName}
        </span>
      </div>

      {/* Delete button that appears on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className='absolute top-1 cursor-pointer right-1 p-1 bg-red-100 rounded-full text-red-500 hover:bg-red-200'
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Droppable cell component
const Cell = ({
  id,
  dentistId,
  timeSlot,
  onHover,
  onLeave,
  onAddReservation,
  isHovered,
  children,
  hasReservations,
  onUpdateReservation,
  setDraggedReservation,
  draggedReservation,
}: CellProps) => {
  const ref = useRef(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.RESERVATION,
    canDrop: (item: DraggedReservation) => {
      // Can't drop on a cell that already has a reservation
      // Unless it's the same reservation (dropping back)
      if (hasReservations) {
        return item.dentistId === dentistId && item.timeSlot === timeSlot;
      }
      return true;
    },
    drop: async (item) => {
      // Only update if actually changing position
      if (item.dentistId !== dentistId || item.timeSlot !== timeSlot) {
        try {
          // Handle the drop - update reservation with new dentist and time
          const success = await onUpdateReservation(
            item.id,
            dentistId,
            timeSlot
          );
          if (success) {
            toast.success("Reservation moved successfully");
          }
          return { success };
        } catch (error) {
          console.error("Error updating reservation:", error);
          toast.error("Failed to move reservation");
          return { success: false };
        }
      }
      return { success: false };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Connect the drop ref to the DOM element
  drop(ref);

  // Determine background color based on drop state
  let bgColor = "";
  if (isOver) {
    bgColor = canDrop ? "bg-green-100" : "bg-red-100";
  }

  // Show the plus button only if the cell is empty and not being dragged over
  const showAddButton = isHovered && !hasReservations && !isOver;

  return (
    <div
      ref={ref}
      className={`p-2 border-r border-b border-brand-neutrals/20 min-h-[80px] relative ${bgColor} transition-colors duration-200`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {children}

      {/* Add button that appears on hover only if no reservations */}
      <AnimatePresence>
        {showAddButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute cursor-pointer inset-0 flex items-center justify-center bg-brand-light-blue/5'
            onClick={onAddReservation}
          >
            <div className='w-8 h-8 rounded-full bg-brand-primary-blue flex items-center justify-center cursor-pointer'>
              <Plus className='h-5 w-5 text-white' />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview of dragged item */}
      <AnimatePresence>
        {isOver && canDrop && draggedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 flex items-center justify-center pointer-events-none'
          >
            <div className='w-full h-full bg-brand-primary-green/10 rounded-md border border-brand-primary-green/60 flex items-center justify-center'>
              <span className='text-sm text-brand-primary-green font-medium'>
                Drop here
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationCalendar;
