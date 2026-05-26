export function courseMatches(storedCourse: string, selectedCourse: string) {
  const allowedCourses = storedCourse
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);

  const selected = selectedCourse.trim().toLowerCase();

  return allowedCourses.some((course) => {
    return (
      course === selected ||
      selected.startsWith(course + " ") ||
      selected.startsWith(course + "-")
    );
  });
}