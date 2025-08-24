// components/Card.js
import React from "react";

export default function Card({ className = "", children }) {
  return <div className={`card ${className}`}>{children}</div>;
}