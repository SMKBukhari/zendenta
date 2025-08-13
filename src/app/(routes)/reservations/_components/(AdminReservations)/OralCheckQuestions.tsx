"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Question {
  id: string;
  question: string;
  options: string[];
}

const OralCheckQuestions = () => {
  const questions: Question[] = [
    {
      id: "1",
      question: "Do you have any pain or discomfort in your mouth?",
      options: ["Yes", "No"],
    },
    {
      id: "2",
      question: "Do your gums bleed when you brush or floss?",
      options: ["Yes", "No", "Sometimes"],
    },
    {
      id: "3",
      question: "Do you have bad breath frequently?",
      options: ["Yes", "No", "Occasionally"],
    },
    {
      id: "4",
      question: "Do you have any loose teeth?",
      options: ["Yes", "No"],
    },
  ];

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  return (
    <div className='space-y-6'>
      <h3 className='font-medium text-lg'>Oral Health Check</h3>

      <div className='space-y-4'>
        {questions.map((question) => (
          <div key={question.id} className='space-y-2'>
            <p className='font-medium'>{question.question}</p>
            <div className='flex gap-2'>
              {question.options.map((option) => (
                <Button
                  key={option}
                  variant={
                    answers[question.id] === option ? "default" : "outline"
                  }
                  size='sm'
                  onClick={() => handleAnswer(question.id, option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6'>
        <h4 className='font-medium mb-2'>Additional Notes</h4>
        <textarea
          className='w-full p-2 border rounded'
          rows={3}
          placeholder='Enter any additional observations...'
        />
      </div>
    </div>
  );
};

export default OralCheckQuestions;
