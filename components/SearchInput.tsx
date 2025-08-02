"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      type="text"
      placeholder="Search by name or symbol..."
      className="mb-4 p-2 border rounded w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
