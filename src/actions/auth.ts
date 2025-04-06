"use server"

import { prisma } from "@/db/prisma"
import { handleError } from "@/lib/utils"
import { createClient, createServiceClient } from "@/utils/supabase/server"
import { Doctor, Gender } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { getDoctorByEmail } from "./doctor"

export async function login(formData: FormData) {
  try {
    const supabase = await createClient()

    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string
    }

    const { error } = await supabase.auth.signInWithPassword(credentials)

    if (error) throw error

    revalidatePath("/", "layout") // Revalidate the root layout after login
    return { errorMessage: null }
  } catch (error) {
    return handleError(error)
  }
}

export async function logout() {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) throw error

    revalidatePath("/", "layout") // Revalidate the root layout after logout
    return { errorMessage: null }
  } catch (error) {
    return handleError(error)
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    const name = formData.get("name") as string
    const gender = formData.get("gender") as string
    const practiceStarted = Number(formData.get("practiceStarted"))
    const degree = formData.get("degree") as string
    const speciality = formData.get("speciality") as string
    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string
    }

    const options = {
      data: {
        display_name: name
      }
    }

    const existingDoctor: Doctor | null = await getDoctorByEmail(
      credentials.email
    )

    if (existingDoctor) throw new Error("Email already exists")

    const { data, error } = await supabase.auth.signUp({
      ...credentials,
      options
    })

    if (error) throw error

    const userId = data.user?.id
    if (!userId) throw new Error("Error signing up")

    await prisma.doctor.create({
      data: {
        id: userId,
        email: credentials.email,
        name,
        gender: gender as Gender,
        practiceStarted,
        degree,
        speciality
      }
    })

    revalidatePath("/", "layout") // Revalidate the root layout after signup
    return { errorMessage: null }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteAccount(id: string) {
  try {
    const supabase = await createServiceClient()

    console.log("Deleting account with ID:", id)
    const { error } = await supabase.auth.admin.deleteUser(id)

    if (error) throw error

    revalidatePath("/", "layout")
    return { errorMessage: null }
  } catch (error) {
    return handleError(error)
  }
}
