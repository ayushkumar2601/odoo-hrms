import { AttendanceStatus } from "@prisma/client";

export function determineAttendanceStatus(workedMinutes: number): AttendanceStatus {
  const workedHours = workedMinutes / 60;
  if (workedHours >= 8) {
    return AttendanceStatus.PRESENT;
  } else if (workedHours >= 4) {
    return AttendanceStatus.HALF_DAY;
  } else {
    return AttendanceStatus.ABSENT;
  }
}
