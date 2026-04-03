import { useState } from "react";
import { apiClient } from "../../../lib/ApiClient";
import { reportReasons } from "./reportReasons";

export default function ReportModal({
  isOpen,
  title,
  description,
  onClose,
  endpoint,
  onSubmitted,
}) {
  const [reason, setReason] = useState(reportReasons[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setReason(reportReasons[0]);
    setDetails("");
    setError("");
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await apiClient.post(endpoint, {
        reason,
        details,
      });

      resetForm();
      onClose();
      onSubmitted?.();
    } catch (submitError) {
      setError(submitError?.data?.message || "Could not submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md border border-gray-300 bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-800 hover:cursor-pointer"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm text-gray-700">
            <span className="mb-1 block font-medium">Reason</span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2"
            >
              {reportReasons.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-gray-700">
            <span className="mb-1 block font-medium">Details</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Add a short note if needed"
              className="w-full resize-none border border-gray-300 px-3 py-2"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="border border-gray-300 px-3 py-2 text-sm hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}