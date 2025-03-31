"use client"

import { createPatient } from "@/actions/patient"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Patient, SmokingStatus } from "@prisma/client"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const patientSchema = z.object({
  name: z.string().min(3, {
    message: "Patient name must be at least 3 characters."
  }),
  dob: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Date of birth must be a valid date"
  }),
  phoneNumber: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 digits."
    })
    .regex(/^[0-9]+$/, {
      message: "Phone number must contain only digits."
    }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select patient's gender."
  }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    message: "Please select patient's blood group."
  }),
  smokingStatus: z.enum(["PRESENT", "NEVER", "PAST"], {
    message: "Please select patient's smoking status."
  }),
  medicalHistory: z.string().min(10, {
    message: "Medical history must be at least 10 characters."
  }),
  allergies: z.array(z.string()).default([])
})

type PatientFormValues = z.infer<typeof patientSchema>

export function CreatePatientForm({ doctorId }: { doctorId: string }) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [allergyInput, setAllergyInput] = useState("")

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      dob: "",
      phoneNumber: "",
      email: "",
      medicalHistory: "",
      allergies: []
    }
  })

  const allergies = form.watch("allergies")

  const addAllergy = () => {
    if (
      allergyInput.trim() !== "" &&
      !allergies.includes(allergyInput.toLowerCase()) &&
      !allergyInput.includes(",")
    ) {
      form.setValue("allergies", [...allergies, allergyInput.toLowerCase()])
      setAllergyInput("")
    }
  }

  const removeAllergy = (allergy: string) => {
    form.setValue(
      "allergies",
      allergies.filter(a => a !== allergy)
    )
  }

  function onSubmit(data: PatientFormValues) {
    startTransition(async () => {
      try {
        console.log(data)

        const patientData = {
          name: data.name,
          dob: new Date(data.dob),
          phoneNumber: data.phoneNumber,
          email: data.email,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          smokingStatus: data.smokingStatus as SmokingStatus,
          medicalHistory: data.medicalHistory,
          allergies: data.allergies.join(","),
          doctorId: doctorId
        }

        const patient: Patient = await createPatient(patientData)

        form.reset()

        toast.success("Patient Registration Complete", {
          description: `Patient record for ${patient.name} has been successfully added to the system`,
          action: (
            <Button
              onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
            >
              View
            </Button>
          )
        })
      } catch (error) {
        console.log(error)
        toast.error("Registration Failed", {
          description: "Unable to register patient. Please try again."
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="dob"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="email"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="patient@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="phoneNumber"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="gender"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient's gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="bloodGroup"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient's blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="smokingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Smoking Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient's smoking status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PRESENT">Present</SelectItem>
                      <SelectItem value="PAST">Past</SelectItem>
                      <SelectItem value="NEVER">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div>
          <FormField
            control={form.control}
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical History</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Document patient's medical history, including previous diagnoses, surgeries, and chronic conditions"
                    className="min-h-[120px]"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="allergies"
            render={() => (
              <FormItem>
                <FormLabel>Known Allergies</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter patient allergy"
                    value={allergyInput}
                    onChange={e => setAllergyInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addAllergy()
                      }
                    }}
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    onClick={addAllergy}
                    disabled={isPending}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allergies.map((allergy, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="px-3 py-1"
                      onClick={() => removeAllergy(allergy)}
                    >
                      {allergy}
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Clear Form
          </Button>
          <Button type="submit" className="px-8" disabled={isPending}>
            {isPending ? "Registering Patient..." : "Register Patient"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
