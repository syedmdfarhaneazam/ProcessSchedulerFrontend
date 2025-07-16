"use client";

// Enhanced JobForm component with IST timezone support - JavaScript and Shell only
import { useState } from "react";
import AceEditor from "react-ace";
import ISTTimezoneHelper from "../utils/ISTTimezoneHelper";

// Import Ace Editor modes and themes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";

function JobForm({ onSubmit, loading = false, availableJobs = [] }) {
  // Form state management
  const [formData, setFormData] = useState({
    description: "",
    codeType: "javascript",
    codeContent: "",
    priority: 1,
    dependencies: [""],
    retryPolicy: 0,
    startTime: "",
    repeat: 0,
  });

  // State for form validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes for regular form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle Ace Editor content changes
  const handleCodeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      codeContent: value,
    }));
    if (errors.codeContent) {
      setErrors((prev) => ({
        ...prev,
        codeContent: null,
      }));
    }
  };

  // Handle dependency input changes
  const handleDependencyChange = (index, value) => {
    const newDependencies = [...formData.dependencies];
    newDependencies[index] = value;
    setFormData((prev) => ({
      ...prev,
      dependencies: newDependencies,
    }));
  };

  // Add new dependency input field
  const addDependencyField = () => {
    setFormData((prev) => ({
      ...prev,
      dependencies: [...prev.dependencies, ""],
    }));
  };

  // Remove dependency input field
  const removeDependencyField = (index) => {
    if (formData.dependencies.length > 1) {
      const newDependencies = formData.dependencies.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({
        ...prev,
        dependencies: newDependencies,
      }));
    }
  };

  // Form validation function with IST support
  const validateForm = () => {
    const newErrors = {};
    // Required field validations
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.codeContent.trim()) {
      newErrors.codeContent = "Code content is required";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    } else {
      // Convert to API format first, then validate
      const convertedTime = ISTTimezoneHelper.convertToAPIFormat(
        formData.startTime,
      );
      const timeDiff =
        ISTTimezoneHelper.getTimeDifferenceFromNow(convertedTime);
      console.log("🇮🇳 Frontend validation:");
      console.log("  Original input:", formData.startTime);
      console.log("  Converted time:", convertedTime);
      console.log("  Time difference:", timeDiff.minutes, "minutes");
      console.log("  Is in future:", timeDiff.isInFuture);
      if (!timeDiff.isInFuture || timeDiff.minutes < 1) {
        newErrors.startTime = `Start time must be at least 1 minute in the future. Current IST: ${ISTTimezoneHelper.getCurrentIST()}`;
      }
    }
    // Validate retry policy
    if (formData.retryPolicy < 0 || formData.retryPolicy > 10) {
      newErrors.retryPolicy = "Retry policy must be between 0 and 10";
    }
    // Validate repeat interval
    if (formData.repeat < 0) {
      newErrors.repeat = "Repeat interval cannot be negative";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with IST conversion
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Prepare job data for API with IST conversion
    const jobData = {
      ...formData,
      startTime: ISTTimezoneHelper.convertToAPIFormat(formData.startTime),
      dependencies: formData.dependencies.filter((dep) => dep.trim() !== ""),
      repeat: formData.repeat * 60, // Convert minutes to seconds
      priority: Number.parseInt(formData.priority),
      retryPolicy: Number.parseInt(formData.retryPolicy),
    };

    console.log("📤 Submitting job with IST timezone handling:");
    console.log("  Original startTime:", formData.startTime);
    console.log("  Converted startTime:", jobData.startTime);
    console.log("  Current IST:", ISTTimezoneHelper.getCurrentIST());

    // Call parent component's submit handler
    const result = await onSubmit(jobData);

    // Reset form if submission was successful
    if (result && result.success) {
      setFormData({
        description: "",
        codeType: "javascript",
        codeContent: "",
        priority: 1,
        dependencies: [""],
        retryPolicy: 0,
        startTime: "",
        repeat: 0,
      });
      setErrors({});
      console.log("✅ Form reset after successful submission");
    }
  };

  // Get Ace Editor mode based on code type
  const getEditorMode = () => {
    switch (formData.codeType) {
      case "javascript":
        return "javascript";
      case "shell":
        return "sh";
      default:
        return "text";
    }
  };

  // Get placeholder text for code editor
  const getCodePlaceholder = () => {
    switch (formData.codeType) {
      case "javascript":
        return '// Enter your JavaScript code here\nconsole.log("Hello from IST timezone!");';
      case "shell":
        return '# Enter your shell commands here\necho "Hello from IST timezone!"';
      default:
        return "Enter your code here...";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Job</h2>
      {/* IST Timezone Info Display */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-blue-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-blue-700">
            🇮🇳 Current IST: {ISTTimezoneHelper.getCurrentIST()}
            <span className="ml-2 text-blue-600">(Asia/Kolkata +05:30)</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter job description..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Code Type Selection - JavaScript and Shell only */}
        <div>
          <label
            htmlFor="codeType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Code Type *
          </label>
          <select
            id="codeType"
            name="codeType"
            value={formData.codeType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="shell">Shell</option>
          </select>
        </div>

        {/* Code Content - Ace Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code Content *
          </label>
          <div
            className={`border rounded-md ${errors.codeContent ? "border-red-500" : "border-gray-300"}`}
          >
            <AceEditor
              mode={getEditorMode()}
              theme="github"
              value={formData.codeContent}
              onChange={handleCodeChange}
              placeholder={getCodePlaceholder()}
              width="100%"
              height="200px"
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
              }}
            />
          </div>
          {errors.codeContent && (
            <p className="mt-1 text-sm text-red-600">{errors.codeContent}</p>
          )}
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority * (DAG + Min-Heap Scheduling)
          </label>
          <div className="flex space-x-4">
            {[
              { value: 0, label: "High", color: "red" },
              { value: 1, label: "Medium", color: "yellow" },
              { value: 2, label: "Low", color: "green" },
            ].map((priority) => (
              <label key={priority.value} className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value={priority.value}
                  checked={formData.priority === priority.value}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span
                  className={`px-2 py-1 rounded text-sm font-medium bg-${priority.color}-100 text-${priority.color}-800`}
                >
                  {priority.label}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Jobs are scheduled using DAG dependency resolution and min-heap
            priority queue
          </p>
        </div>

        {/* Dependencies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dependencies (DAG Validation)
          </label>
          <div className="space-y-2">
            {formData.dependencies.map((dependency, index) => (
              <div key={index} className="flex items-center space-x-2">
                <select
                  value={dependency}
                  onChange={(e) =>
                    handleDependencyChange(index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a job...</option>
                  {availableJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.description} ({job.id.slice(0, 8)})
                    </option>
                  ))}
                </select>
                {formData.dependencies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDependencyField(index)}
                    className="px-2 py-2 text-red-600 hover:text-red-800"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDependencyField}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Dependency
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Dependencies are validated using DAG to prevent cycles
          </p>
        </div>

        {/* Retry Policy */}
        <div>
          <label
            htmlFor="retryPolicy"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Retry Count (Exponential Backoff)
          </label>
          <input
            type="number"
            id="retryPolicy"
            name="retryPolicy"
            value={formData.retryPolicy}
            onChange={handleInputChange}
            min="0"
            max="10"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.retryPolicy ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.retryPolicy && (
            <p className="mt-1 text-sm text-red-600">{errors.retryPolicy}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Failed jobs will retry with exponential backoff (1s, 2s, 4s, 8s...)
          </p>
        </div>

        {/* Start Time */}
        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Start Time * (IST - India Standard Time)
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            min={ISTTimezoneHelper.getCurrentISTForInput()}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            🇮🇳 All times are in IST (Asia/Kolkata +05:30). Job will execute at
            the exact IST time specified.
          </p>
        </div>

        {/* Repeat Interval */}
        <div>
          <label
            htmlFor="repeat"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Repeat Interval (minutes)
          </label>
          <input
            type="number"
            id="repeat"
            name="repeat"
            value={formData.repeat}
            onChange={handleInputChange}
            min="0"
            placeholder="0 = No repeat"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.repeat ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.repeat && (
            <p className="mt-1 text-sm text-red-600">{errors.repeat}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Set to 0 for one-time execution, or specify minutes for recurring
            jobs
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Job with DAG Validation...
              </div>
            ) : (
              "Create Job (DAG + Min-Heap Scheduled)"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobForm;
