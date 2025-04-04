import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return { errorMessage: error.message }
  } else {
    return { errorMessage: "An unknown error occurred" }
  }
}

export function calculateAge(dob: Date) {
  const today = new Date()
  const age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return Math.max(0, age - 1)
  }
  return Math.max(0, age)
}

/**
 * Calculates the Body Mass Index (BMI) based on weight and height.
 *
 * @param weight - The weight in kilograms.
 * @param height - The height in centimeters.
 * @returns The calculated BMI value.
 */
export function calculateBmi(weight: number, height: number) {
  const bmi = weight / (height / 100) ** 2
  return Math.max(0, bmi).toFixed(2)
}

export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric"
  }
  return date.toLocaleDateString("en-IN", options)
}

export function formatDateTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }
  return date.toLocaleString("en-IN", options)
}

export function formatTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }
  return date.toLocaleTimeString("en-IN", options)
}
