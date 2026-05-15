export type CourseKey = "BCA" | "BCom" | "BBA" | "MCom" | "MCA" | "BA" | "BSc";

export type SemesterKey = "1" | "2" | "3" | "4" | "5" | "6";

export type PurchaseProduct = {
  course: CourseKey;
  semester: SemesterKey;
  title: string;
  subtitle: string;
  price: number;
  currency: "INR";
  description: string;
  features: string[];
  note: string;
  razorpayKeyId?: string;
};

export const purchaseProducts: PurchaseProduct[] = [
  {
    course: "BCA",
    semester: "1",
    title: "BCA Semester 1 Model Paper",
    subtitle: "Predictive paper pack for first-semester BCA students",
    price: 49,
    currency: "INR",
    description:
      "A syllabus-based model paper prepared from topic weightage and exam pattern analysis.",
    features: [
      "Instant digital access",
      "Syllabus-aligned questions",
      "Exam-focused format",
      "Works on mobile and desktop",
    ],
    note: "Download link will be available after successful payment.",
  },
  {
    course: "BCom",
    semester: "2",
    title: "B.Com Semester 2 Model Paper",
    subtitle: "High-probability question set for B.Com students",
    price: 49,
    currency: "INR",
    description:
      "Prepared to help students revise likely questions faster and more strategically.",
    features: [
      "Instant digital access",
      "Syllabus-aligned questions",
      "Exam-focused format",
      "Works on mobile and desktop",
    ],
    note: "Download link will be available after successful payment.",
  },
];

export function getPurchaseProduct(course?: string, semester?: string) {
  return purchaseProducts.find(
    (item) => item.course === course && item.semester === semester,
  );
}