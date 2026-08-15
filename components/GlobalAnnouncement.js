"use client";

import { useEffect, useState } from "react";

export default function GlobalAnnouncement() {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.globalAnnouncement) {
          setAnnouncement(data.globalAnnouncement);
        } else {
          setAnnouncement("");
        }
      })
      .catch(err => console.error("Failed to fetch settings", err));
  }, []);

  if (!announcement) return null;

  return (
    <div className="bg-primary text-white overflow-hidden py-2 whitespace-nowrap">
      <div className="inline-block animate-[marquee_15s_linear_infinite] px-4 font-medium tracking-wide">
        {announcement} <span className="mx-8 opacity-50">•</span> {announcement} <span className="mx-8 opacity-50">•</span> {announcement}
      </div>
    </div>
  );
}
