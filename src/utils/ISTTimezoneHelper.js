// Frontend IST Timezone helper utility
class ISTTimezoneHelper {
  // Get current IST time
  static getCurrentIST() {
    return new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  // Format date for IST display
  static formatIST(date) {
    if (!date) return "Not set";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // Get current IST time for datetime-local input
  static getCurrentISTForInput() {
    const now = new Date();
    // Convert to IST
    const istTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );

    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, "0");
    const day = String(istTime.getDate()).padStart(2, "0");
    const hours = String(istTime.getHours()).padStart(2, "0");
    const minutes = String(istTime.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Convert datetime-local input to proper format for API
  static convertToAPIFormat(datetimeLocalValue) {
    if (!datetimeLocalValue) return null;

    // The datetime-local input gives us a string like "2025-07-16T14:58"
    // We want to treat this as IST time and convert it properly

    // Parse the input manually to avoid timezone issues
    const [datePart, timePart] = datetimeLocalValue.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    // Create a date string that represents this time in IST
    // We'll format it as if it's IST and then let the backend handle it
    const istDateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00.000+05:30`;

    console.log("🇮🇳 Frontend IST conversion:");
    console.log("  Input from datetime-local:", datetimeLocalValue);
    console.log("  Parsed components:", { year, month, day, hours, minutes });
    console.log("  IST formatted string:", istDateString);
    console.log("  As Date object:", new Date(istDateString).toISOString());

    // Return the ISO string of the IST date
    return new Date(istDateString).toISOString();
  }

  // Calculate time difference from now
  static getTimeDifferenceFromNow(targetTime) {
    const now = new Date();
    const target = new Date(targetTime);

    const diffMs = target.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    return {
      milliseconds: diffMs,
      minutes: diffMinutes,
      isInFuture: diffMs > 0,
      humanReadable: this.formatTimeDifference(diffMs),
    };
  }

  // Format time difference in human readable format
  static formatTimeDifference(diffMs) {
    const absDiff = Math.abs(diffMs);
    const minutes = Math.floor(absDiff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "Now";
    }
  }

  // Validate if time is in future
  static isInFuture(dateTime, bufferMinutes = 1) {
    const now = new Date();
    const target = new Date(dateTime);
    return target.getTime() > now.getTime() + bufferMinutes * 60 * 1000;
  }

  // Get timezone info
  static getTimezoneInfo() {
    const now = new Date();
    return {
      timezone: "Asia/Kolkata",
      offset: "+05:30",
      currentTime: this.formatIST(now),
      utcTime: now.toISOString(),
      localTime: now.toLocaleString(),
    };
  }
}

export default ISTTimezoneHelper;
