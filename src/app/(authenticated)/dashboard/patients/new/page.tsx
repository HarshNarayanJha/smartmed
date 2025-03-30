import { CreatePatientForm } from "@/components/dashboard/CreatePatientForm"

export default function Patients() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-3xl">Add New Patient</h1>

      <div className="mx-auto max-w-md rounded-lg p-6 shadow-md">
        <CreatePatientForm />
      </div>
    </div>
  )
}
