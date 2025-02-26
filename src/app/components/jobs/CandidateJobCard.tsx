import React, { useState } from "react";
import IJob from "../../types/job";
import JobCard from "./JobCard";
import { useJobActions } from "@/app/store/JobActionsContext";
import { FaBookmark, FaPaperPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ApplyEditModal from "../applications/ApplyEditModal";

interface CandidateJobCardProps {
  job: IJob;
  onJobAction: (jobId: string) => void;
  hasSkills: boolean;
}

const CandidateJobCard: React.FC<CandidateJobCardProps> = ({
  job,
  onJobAction,
  hasSkills,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(false); // Loading state for applying
  const { handleSaveJob, handleApplyJob } = useJobActions();
  const router = useRouter();

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "bg-orange-400";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const onSaveJob = () => {
    handleSaveJob(job._id);
    setIsSaved(true);
    onJobAction(job._id); // Notify parent
  };

  const handleApplyButtonClick = () => {
    setModalOpen(true); // Open the modal
  };

  const handleApplyNow = async () => {
    setLoading(true); // Start loading
    try {
      await handleApplyJob(job._id);
      onJobAction(job._id);
      setModalOpen(false); // Close the modal after applying
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleEditResume = () => {
    router.push("/pages/home/candidate/uploadResume");
    setModalOpen(false); // Close modal after editing resume
  };

  return (
    <div className="border p-6 rounded-lg shadow-lg bg-gray-800 text-white h-full flex flex-col justify-between">
      {hasSkills && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg flex items-center gap-4">
          <div className="flex-1 relative h-3 bg-gray-600 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-500 ${getMatchColor(
                job.matchPercentage || 0
              )}`}
              style={{ width: `${job.matchPercentage || 0}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 font-medium whitespace-nowrap">
            {job.matchPercentage || 0}% Match
          </div>
        </div>
      )}

      <JobCard job={job} missingSkills={job.missingSkills} />

      <div className="flex justify-center mt-4 gap-4 w-full">
        {/* Save Job with Icon and Tooltip */}
        <div className="w-full group relative">
          <button
            onClick={onSaveJob}
            disabled={isSaved}
            className={`w-full h-14 flex justify-center items-center rounded-full text-orange-400 ${isSaved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-transparent group-hover:bg-orange-400 group-hover:text-white transition-all duration-200"
              }`}
            title="Save Job"
          >
            <FaBookmark
              className={`${isSaved
                  ? "text-gray-400"
                  : "text-orange-400 group-hover:text-white"
                } transition-all duration-200`}
            />
          </button>
        </div>

        {/* Apply Now Button with Icon */}
        <div className="w-full group relative">
          <button
            onClick={handleApplyButtonClick}
            className="w-full h-14 flex justify-center items-center rounded-full text-orange-400 bg-transparent hover:bg-orange-400 hover:text-white transition-all duration-200"
            title="Apply Now"
          >
            <FaPaperPlane className="text-xl" />
          </button>
        </div>
      </div>

      {/* Apply/Edit Modal */}
      <ApplyEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApplyNow={handleApplyNow}
        onEditResume={handleEditResume}
        loading={loading} // Pass the loading state here
      />
    </div>
  );
};

export default CandidateJobCard;
