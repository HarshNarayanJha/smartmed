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
