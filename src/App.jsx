import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Upload, Info, Trash2, Download, FileText } from "lucide-react";
import Sidebar from "./components/sidebar";
import BlankPage from "./pages/blank";
import uberonTerms from "./data/uberon_terms.json";
import { useLLM } from "./context/LLMContext";
import ModelSelector from "./components/ModelSelector";
import ScoreParameters from "./components/ScoreParameters";
import Documentation from "./pages/documentation";

function MainPage() {
  const BASE_API = "http://api-cellannotations.menkrepp.my.id";
  // eslint-disable-next-line no-unused-vars
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [csvFiles, setCsvFiles] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedUberon, setSelectedUberon] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  // const [analyzingRelationship, setAnalyzingRelationship] = useState({});

  const { selectedModel } = useLLM();

  const [scoreParams, setScoreParams] = useState({
    alpha: 2.5,
    beta: 0.5,
    gamma: 1.0,
  });

  // Convert Uberon terms to a more usable format
  const uberonOptions = uberonTerms
    .map((term) => {
      const [id, name] = Object.entries(term)[0];
      return { id, name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Fetch list of CSV files on component mount
  useEffect(() => {
    fetchCsvFiles();
  }, []);

  const fetchCsvFiles = async () => {
    try {
      const response = await axios.get(`${BASE_API}/files`);
      setCsvFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching CSV files:", error);
      alert("Error loading CSV files");
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${BASE_API}/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchCsvFiles(); // Refresh the file list
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  const handleFileView = async (filename) => {
    try {
      const response = await axios.get(
        `${BASE_API}/data/${filename}`
      );
      setTableData(response.data.data);
      setSelectedFilename(filename);
    } catch (error) {
      console.error("Error fetching file data:", error);
      alert("Error loading file data");
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(
        `${BASE_API}/data/${filename}`
      );
      const csvContent = convertToCSV(response.data.data);
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    }
  };

  const handleDelete = async (filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        await axios.delete(`${BASE_API}/delete/${filename}`);
        fetchCsvFiles();
        if (selectedFilename === filename) {
          setSelectedFilename("");
          setTableData([]);
        }
        alert("File deleted successfully");
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Error deleting file");
      }
    }
  };

  const handleFindAnnotation = async () => {
    if (!selectedFilename || !selectedUberon) {
      alert("Please select both a file and a tissue type");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${BASE_API}/process-annotation/${selectedFilename}`,
        {
          uberon_ids: [selectedUberon],
          model: selectedModel,
          score_params: scoreParams,
        }
      );
      console.log("Response:", response.data);

      if (response.data.annotations) {
        const processedAnnotations = Object.entries(
          response.data.annotations.annotations
        ).map(([cluster, data]) => ({
          cluster,
          ...data,
        }));
        setAnnotations(processedAnnotations);
      } else {
        alert("No annotations found for this file and tissue type.");
      }
    } catch (error) {
      console.error("Error processing annotation:", error);
      const errorMessage =
        error.response?.data?.detail ||
        "Error processing annotation. Please try again.";
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files[0]);
    }
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const rows = data.map((obj) => headers.map((header) => obj[header]));
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showAnnotationInfo = (index) => {
    setSelectedAnnotation(index);
  };

  const renderTable = () => {
    if (!tableData.length) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(tableData[0]).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td
                    key={i}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAnnotationTable = () => {
    if (!annotations || annotations.length === 0) return null;

    return (
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cluster
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cell Annotation 1
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cell Annotation 2
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cell Annotation 3
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {annotations.map((annotation, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {annotation.cluster}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {annotation.cell_annotation_1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {annotation.cell_annotation_2}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {annotation.cell_annotation_3}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => showAnnotationInfo(index)}
                      className="text-blue-500 hover:text-blue-700"
                      title="View Details"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedAnnotation !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">
                Cluster {annotations[selectedAnnotation].cluster} Analysis
              </h3>
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Cell Types:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Cell Annotation 1:{" "}
                    {annotations[selectedAnnotation].cell_annotation_1}
                  </li>
                  <li>
                    Cell Annotation 2:{" "}
                    {annotations[selectedAnnotation].cell_annotation_2}
                  </li>
                  <li>
                    Cell Annotation 3:{" "}
                    {annotations[selectedAnnotation].cell_annotation_3}
                  </li>
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Documentation:
                </h4>
                <p className="text-gray-600">
                  {annotations[selectedAnnotation].Documentation}
                </p>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">References:</h4>
                <p className="text-gray-600">
                  {annotations[selectedAnnotation].References}
                </p>
              </div>
              <button
                onClick={() => setSelectedAnnotation(null)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Cell Annotation
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upload CSV File</h2>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your CSV file here, or
              <label className="ml-1 text-blue-600 hover:text-blue-500 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={(e) =>
                    e.target.files[0] && handleFileUpload(e.target.files[0])
                  }
                />
                browse
              </label>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">CSV Files</h2>
          <ul className="space-y-2">
            {csvFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <span className="text-gray-700 flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {file}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFileView(file)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FileText className="mr-1 h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(file)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ScoreParameters
            scoreParams={scoreParams}
            onScoreParamsChange={setScoreParams}
          />
          <div className="flex flex-row justify-between pb-6">
            <h2 className="text-xl font-semibold mb-4 px-8">
              {selectedFilename
                ? `Data from: ${selectedFilename}`
                : "No file selected"}
            </h2>
            <ModelSelector />
            <div className="flex gap-2">
              <select
                value={selectedUberon}
                onChange={(e) => setSelectedUberon(e.target.value)}
                className="w-52 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a tissue</option>
                {uberonOptions.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleFindAnnotation}
                disabled={isProcessing}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isProcessing ? "Processing..." : "Find Annotation"}
              </button>
            </div>
          </div>
          {renderTable()}
          {renderAnnotationTable()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/genetoannotation" element={<BlankPage />} />
            <Route path="/documentation" element={<Documentation />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
