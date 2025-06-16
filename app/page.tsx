"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { processScore, Result } from "@/lib/processing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 3, 23)
  );
  const [file, setFile] = React.useState<File | null>();
  const [result, setResult] = React.useState<Result>();
  const [time, setTime] = React.useState("F");
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <main>
      <div className="flex h-screen items-center font-[family-name:var(--font-geist-mono)]">
        <div className="flex flex-col gap-6 w-xs mx-auto">
          <h3 className="mb-2 text-2xl font-bold">KEAM Mark Calculator</h3>
          <div className="flex items-end">
            <div className="w-3/5">
              <Label className="mb-2 block">Choose your session.</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    defaultMonth={new Date(2025, 3)}
                    disabled={{
                      before: new Date(2025, 3, 23),
                      after: new Date(2025, 3, 29),
                    }}
                    disableNavigation
                    mode="single"
                    selected={date}
                    onSelect={(e) => {
                      setDate(e);
                      setIsCalendarOpen(false);
                    }}
                    className="font-[family-name:var(--font-geist-mono)]"
                    initialFocus
                    required
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-2/5">
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">Morning</SelectItem>
                  <SelectItem value="A">Afternoon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2">
              Upload your
              <span className="font-bold">Candidate Response</span>
              page.
            </Label>
            <Input
              type="file"
              onChange={(e) => {
                setFile(e.target.files?.[0]);
              }}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="underline">
                How to get the Candidate Response page?
              </Button>
            </DialogTrigger>
            <DialogContent className="font-[family-name:var(--font-geist-mono)]">
              <DialogHeader>
                <DialogTitle className="my-2">
                  How to get these documents:
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="flex flex-col gap-5">
                    <p>
                      1. Go to the Candidate response page from{" "}
                      <a
                        href="https://www.cee.kerala.gov.in/keam2025/anskey"
                        className="text-primary underline-offset-4 underline"
                        target="_blank"
                      >
                        www.cee.kerala.gov.in/
                      </a>{" "}
                      and press <span className="font-bold">Ctrl + S</span>
                    </p>
                    <p>
                      2. Upload the{" "}
                      <span className="font-bold">CEE Kerala.html</span> file.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button
            onClick={async () =>
              setResult(await processScore(date, file, time))
            }
          >
            Get Results
          </Button>
          {result != undefined && (
            <div className="mt-10 grid grid-cols-2 gap-10">
              <h2 className="text-3xl font-semibold m-auto">
                {result.score}/600
              </h2>
              <div className="grid grid-rows-2 gap-10">
                <Label>Correct: {result.correct}</Label>
                <Label>Incorrect: {result.incorrect}</Label>
              </div>
            </div>
          )}
          <Label className="my-5 block">
            Made by{" "}
            <a
              href="https://x.com/aryanbaburajan"
              className="text-primary underline-offset-4 underline"
              target="_blank"
            >
              @aryanbaburajan
            </a>
          </Label>
        </div>
      </div>
    </main>
  );
}
