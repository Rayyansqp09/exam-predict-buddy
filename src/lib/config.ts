// Sample PDF preview link
export const SAMPLE_PDF_LINK = "#";

// Supported courses and semesters
export const COURSES = ["FAIUGP", "B.Com", "BBA", "BSc", "BA", "BCA"] as const;
export type Course = (typeof COURSES)[number];

export const SEMESTERS = [1, 2, 3, 4, 5, 6] as const;
export type Semester = (typeof SEMESTERS)[number];

// Map of "Course|Semester" -> Razorpay hosted payment link.
// TODO: Replace each placeholder with the real Razorpay link for that paper.
export const RAZORPAY_LINKS: Record<string, string> = {
  "FAIUGP|1": "https://rzp.io/l/faiugp-sem1",
  "FAIUGP|2": "https://rzp.io/l/faiugp-sem2",
  "FAIUGP|3": "https://rzp.io/l/faiugp-sem3",
  "FAIUGP|4": "https://rzp.io/l/faiugp-sem4",
  "FAIUGP|5": "https://rzp.io/l/faiugp-sem5",
  "FAIUGP|6": "https://rzp.io/l/faiugp-sem6",

  "B.Com|1": "https://rzp.io/l/bcom-sem1",
  "B.Com|2": "https://rzp.io/l/bcom-sem2",
  "B.Com|3": "https://rzp.io/l/bcom-sem3",
  "B.Com|4": "https://rzp.io/l/bcom-sem4",
  "B.Com|5": "https://rzp.io/l/bcom-sem5",
  "B.Com|6": "https://rzp.io/l/bcom-sem6",

  "BBA|1": "https://rzp.io/l/bba-sem1",
  "BBA|2": "https://rzp.io/l/bba-sem2",
  "BBA|3": "https://rzp.io/l/bba-sem3",
  "BBA|4": "https://rzp.io/l/bba-sem4",
  "BBA|5": "https://rzp.io/l/bba-sem5",
  "BBA|6": "https://rzp.io/l/bba-sem6",

  "BSc|1": "https://rzp.io/l/bsc-sem1",
  "BSc|2": "https://rzp.io/l/bsc-sem2",
  "BSc|3": "https://rzp.io/l/bsc-sem3",
  "BSc|4": "https://rzp.io/l/bsc-sem4",
  "BSc|5": "https://rzp.io/l/bsc-sem5",
  "BSc|6": "https://rzp.io/l/bsc-sem6",

  "BA|1": "https://rzp.io/l/ba-sem1",
  "BA|2": "https://rzp.io/l/ba-sem2",
  "BA|3": "https://rzp.io/l/ba-sem3",
  "BA|4": "https://rzp.io/l/ba-sem4",
  "BA|5": "https://rzp.io/l/ba-sem5",
  "BA|6": "https://rzp.io/l/ba-sem6",

  "BCA|1": "https://rzp.io/l/bca-sem1",
  "BCA|2": "https://rzp.io/l/bca-sem2",
  "BCA|3": "https://rzp.io/l/bca-sem3",
  "BCA|4": "https://rzp.io/l/bca-sem4",
  "BCA|5": "https://rzp.io/l/bca-sem5",
  "BCA|6": "https://rzp.io/l/bca-sem6",
};

export function getRazorpayLink(course: string, semester: number): string | undefined {
  return RAZORPAY_LINKS[`${course}|${semester}`];
}
