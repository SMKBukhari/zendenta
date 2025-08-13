"use client";
import { Button } from "@/components/ui/button";
import { DentalRecord, Treatment } from "@prisma/client";
import { useState } from "react";

interface ToothCondition {
  id: string;
  name: string;
  value: string;
}

interface TeethSelectionProps {
  treatment: Treatment;
  selectedTeeth: DentalRecord[];
  setSelectedTeeth: (teeth: DentalRecord[]) => void;
}

const TeethSelection = ({
  treatment,
  selectedTeeth,
  setSelectedTeeth,
}: TeethSelectionProps) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [condition, setCondition] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const teethConditions: ToothCondition[] = [
    { id: "1", name: "Caries", value: "CARIES" },
    { id: "2", name: "Fracture", value: "FRACTURE" },
    { id: "3", name: "Missing", value: "MISSING" },
    { id: "4", name: "Restored", value: "RESTORED" },
    { id: "5", name: "Impacted", value: "IMPACTED" },
  ];

  const teeth = Array.from({ length: 32 }, (_, i) => i + 1);

  const handleToothSelect = (toothNumber: number) => {
    setSelectedTooth(toothNumber);

    // Check if tooth already has a record
    const existingRecord = selectedTeeth.find(
      (t) => t.toothNumber === toothNumber
    );
    if (existingRecord) {
      setCondition(existingRecord.teethConditionId);
      setNote(existingRecord.note || "");
    } else {
      setCondition("");
      setNote("");
    }
  };

  const handleSaveTooth = () => {
    if (!selectedTooth || !condition) return;

    const toothName = `Tooth ${selectedTooth}`;
    const newRecord: DentalRecord = {
      toothNumber: selectedTooth,
      toothName,
      teethConditionId: condition,
      treatmentId: treatment.id,
      note,
      isRecommended: false,
      isApproved: false,
      notApprovedReason: null,
      isDone: false,
      notDoneReason: null,
      // These are required by TypeScript but will be set by the server
      id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      medicalCheckupId: null,
      patientRecordId: null,
    };

    // Update or add the record
    const existingIndex = selectedTeeth.findIndex(
      (t) => t.toothNumber === selectedTooth
    );
    if (existingIndex >= 0) {
      const updatedTeeth = [...selectedTeeth];
      updatedTeeth[existingIndex] = newRecord;
      setSelectedTeeth(updatedTeeth);
    } else {
      setSelectedTeeth([...selectedTeeth, newRecord]);
    }

    // Reset for next selection
    setSelectedTooth(null);
    setCondition("");
    setNote("");
  };

  const getToothName = (number: number) => {
    if (number <= 8) return `Upper Right ${number}`;
    if (number <= 16) return `Upper Left ${17 - number}`;
    if (number <= 24) return `Lower Left ${25 - number}`;
    return `Lower Right ${number - 24}`;
  };

  return (
    <div className='space-y-6'>
      <h3 className='font-medium text-lg'>Teeth Selection</h3>

      <div className='grid grid-cols-8 gap-2'>
        {teeth.map((tooth) => {
          const isSelected = selectedTeeth.some((t) => t.toothNumber === tooth);
          const isActive = selectedTooth === tooth;

          return (
            <button
              key={tooth}
              onClick={() => handleToothSelect(tooth)}
              className={`h-10 w-10 rounded-full flex items-center justify-center border ${
                isSelected
                  ? "bg-blue-100 border-blue-500"
                  : isActive
                  ? "bg-gray-100 border-gray-500"
                  : "border-gray-300"
              }`}
              title={getToothName(tooth)}
            >
              {tooth}
            </button>
          );
        })}
      </div>

      {selectedTooth && (
        <div className='mt-6 space-y-4'>
          <h4 className='font-medium'>Tooth {selectedTooth} Details</h4>

          <div className='space-y-2'>
            <label className='block text-sm font-medium'>Condition</label>
            <select
              title='condition'
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select condition</option>
              {teethConditions.map((cond) => (
                <option key={cond.id} value={cond.id}>
                  {cond.name}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium'>Notes</label>
            <textarea
              title='notes'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='w-full p-2 border rounded'
              rows={3}
            />
          </div>

          <div className='flex justify-end'>
            <Button onClick={handleSaveTooth}>Save</Button>
          </div>
        </div>
      )}

      {selectedTeeth.length > 0 && (
        <div className='mt-6'>
          <h4 className='font-medium mb-2'>Selected Teeth</h4>
          <div className='space-y-2'>
            {selectedTeeth.map((tooth) => (
              <div
                key={tooth.toothNumber}
                className='flex justify-between items-center p-2 border rounded'
              >
                <div>
                  <span className='font-medium'>Tooth {tooth.toothNumber}</span>{" "}
                  -{" "}
                  {
                    teethConditions.find((c) => c.id === tooth.teethConditionId)
                      ?.name
                  }
                </div>
                <button
                  onClick={() => {
                    setSelectedTeeth(
                      selectedTeeth.filter(
                        (t) => t.toothNumber !== tooth.toothNumber
                      )
                    );
                    if (selectedTooth === tooth.toothNumber) {
                      setSelectedTooth(null);
                    }
                  }}
                  className='text-red-500 hover:text-red-700'
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeethSelection;
