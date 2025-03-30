"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const formSchema = z.object({
  bloodPressure: z.string().min(1, { message: "Blood pressure is required" }),
  heartRate: z.string().min(1, { message: "Heart rate is required" }),
  temperature: z.string().min(1, { message: "Temperature is required" }),
  oxygenSaturation: z
    .string()
    .min(1, { message: "Oxygen saturation is required" }),
  respiratoryRate: z
    .string()
    .min(1, { message: "Respiratory rate is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  glucoseLevel: z.string().optional(),
  notes: z.string().optional(),
  appointmentType: z
    .string()
    .min(1, { message: "Appointment type is required" })
})

export function PatientReadingsForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      respiratoryRate: "",
      weight: "",
      glucoseLevel: "",
      notes: "",
      appointmentType: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Here you would normally submit to an API
      console.log(values)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success("Reading submitted", {
        description:
          "The patient's medical reading has been saved successfully."
      })

      router.push("/patients")
    } catch (error) {
      console.log(error)
      toast.error("Error", {
        description: "There was a problem submitting the reading."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="bloodPressure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Pressure (mmHg)</FormLabel>
                <FormControl>
                  <Input placeholder="120/80" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="heartRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heart Rate (bpm)</FormLabel>
                <FormControl>
                  <Input placeholder="70" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature (°C)</FormLabel>
                <FormControl>
                  <Input placeholder="36.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oxygenSaturation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oxygen Saturation (%)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="98"
                    type="number"
                    min="0"
                    max="100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="respiratoryRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Respiratory Rate (breaths/min)</FormLabel>
                <FormControl>
                  <Input placeholder="16" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input placeholder="70" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="glucoseLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Glucose Level (mg/dL)</FormLabel>
                <FormControl>
                  <Input placeholder="100" type="number" {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="routine">Routine Check-up</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="specialist">
                      Specialist Consultation
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinical Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes or observations"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Reading"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
